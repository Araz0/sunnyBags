import { ExtendedBag } from '../data'
import { extFor, renderBagImage, renderPhoto } from '../utils/export'
import { getExtraPhoto } from './extras'
import { DIMENSION_BG, dimensionImage } from '../utils/dimensions'
import { cloudinaryReady, Connections, routeFor } from './connections'
import { getBag } from './helpers'
import { studioActions } from './store'
import { Platform, PostStats, PublishLogEntry, ScheduledPost } from './types'

export interface RenderedImage {
  url: string // data URL
  name: string
}

export const renderPostImages = async (
  post: ScheduledPost,
  bag: ExtendedBag,
  forceJpeg = false,
): Promise<RenderedImage[]> => {
  // Slide order: front, back, size diagram, then the optional extra photo.
  const sides: ('A' | 'B')[] = post.design.side === 'both' ? ['A', 'B'] : [post.design.side]
  const format = forceJpeg ? 'image/jpeg' : post.design.format
  const rendered = await Promise.all(
    sides.map((side) => renderBagImage({ ...post.design, format, item: bag, side }).catch(() => null)),
  )
  const urls = rendered.filter((u): u is string => !!u) // skip a missing back photo
  const dims = post.design.includeDimensions !== false ? dimensionImage(bag) : undefined
  if (dims && urls.length) {
    const url = await renderPhoto({ src: dims, w: post.design.w, h: post.design.h, bgColor: DIMENSION_BG, format, fit: 'contain' }).catch(() => null)
    if (url) urls.push(url)
  }
  const extra = post.design.includeExtra !== false ? getExtraPhoto(bag.id) : undefined
  if (extra) {
    urls.push(await renderPhoto({ src: extra, w: post.design.w, h: post.design.h, bgColor: post.design.bgColor, format }))
  }
  if (!urls.length) throw new Error(`No photos found for Bag #${bag.id}`)
  return urls.map((url, i) => ({ url, name: `sunnybags_${bag.id}_${i + 1}_${post.design.sizeId}.${extFor(format)}` }))
}

const dataUrlToBlob = async (url: string) => (await fetch(url)).blob()

// ── Cloudinary (public image hosting — Instagram needs a public URL) ───────

export const uploadToCloudinary = async (dataUrl: string, c: Connections): Promise<string> => {
  const fd = new FormData()
  fd.append('file', dataUrl)
  fd.append('upload_preset', c.cloudinary.uploadPreset)
  fd.append('folder', 'sunnybags')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(c.cloudinary.cloudName)}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Cloudinary: ${json?.error?.message ?? res.statusText}`)
  return json.secure_url as string
}

// ── Meta Graph API ──────────────────────────────────────────────────────────

const graph = async (c: Connections, path: string, params: Record<string, string> | FormData, method = 'POST') => {
  const base = `https://graph.facebook.com/${c.meta.graphVersion || 'v27.0'}/${path}`
  let res: Response
  if (method === 'GET') {
    const q = new URLSearchParams({ ...(params as Record<string, string>), access_token: c.meta.pageToken })
    res = await fetch(`${base}?${q}`)
  } else {
    let body: FormData | URLSearchParams
    if (params instanceof FormData) {
      params.append('access_token', c.meta.pageToken)
      body = params
    } else {
      body = new URLSearchParams({ ...params, access_token: c.meta.pageToken })
    }
    res = await fetch(base, { method, body })
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) throw new Error(json?.error?.message ?? `Graph API error ${res.status}`)
  return json
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const waitForContainer = async (c: Connections, id: string) => {
  for (let i = 0; i < 15; i++) {
    const { status_code } = await graph(c, id, { fields: 'status_code' }, 'GET')
    if (status_code === 'FINISHED') return
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Instagram media ${status_code}`)
    await sleep(2000)
  }
  throw new Error('Instagram media took too long to process')
}

export const publishInstagram = async (c: Connections, caption: string, imageUrls: string[]) => {
  const ig = c.meta.igUserId
  let creationId: string
  if (imageUrls.length === 1) {
    const { id } = await graph(c, `${ig}/media`, { image_url: imageUrls[0], caption })
    creationId = id
  } else {
    const children: string[] = []
    for (const url of imageUrls) {
      const { id } = await graph(c, `${ig}/media`, { image_url: url, is_carousel_item: 'true' })
      children.push(id)
    }
    const { id } = await graph(c, `${ig}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption })
    creationId = id
  }
  await waitForContainer(c, creationId)
  const { id } = await graph(c, `${ig}/media_publish`, { creation_id: creationId })
  return id as string
}

/**
 * Image hosting without Cloudinary: upload each image to the Facebook Page as
 * an unpublished (hidden) photo and use its CDN URL. Deleted after posting.
 */
export const hostViaFacebook = async (c: Connections, images: RenderedImage[]) => {
  const urls: string[] = []
  const photoIds: string[] = []
  for (const img of images) {
    const fd = new FormData()
    fd.append('source', await dataUrlToBlob(img.url), img.name)
    fd.append('published', 'false')
    fd.append('temporary', 'true')
    const { id } = await graph(c, `${c.meta.pageId}/photos`, fd)
    photoIds.push(id)
    const info = await graph(c, id, { fields: 'images' }, 'GET')
    const best = (info.images as { source: string; width: number }[] | undefined)?.sort((a, b) => b.width - a.width)[0]
    if (!best?.source) throw new Error('Facebook did not return an image URL for Instagram')
    urls.push(best.source)
  }
  return { urls, photoIds }
}

export const publishFacebook = async (c: Connections, caption: string, images: RenderedImage[]) => {
  const page = c.meta.pageId
  if (images.length === 1) {
    const fd = new FormData()
    fd.append('source', await dataUrlToBlob(images[0].url), images[0].name)
    fd.append('message', caption)
    const res = await graph(c, `${page}/photos`, fd)
    return (res.post_id ?? res.id) as string
  }
  const ids: string[] = []
  for (const img of images) {
    const fd = new FormData()
    fd.append('source', await dataUrlToBlob(img.url), img.name)
    fd.append('published', 'false')
    ids.push((await graph(c, `${page}/photos`, fd)).id)
  }
  const params: Record<string, string> = { message: caption }
  ids.forEach((id, i) => (params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id })))
  return (await graph(c, `${page}/feed`, params)).id as string
}

const PERMISSION_HINT =
  'Your token is missing permissions. Add the Page and Instagram use cases to your Meta app, then generate a new token (see Guide → Set up Instagram & Facebook).'

const explain = (field: string, e: Error) => {
  const m = e.message
  if (/does not exist|cannot be loaded/i.test(m))
    return `${field}: this ID wasn't found with this token. Use the "id" from GET me/accounts, not your profile ID.`
  if (/permission|\(#10\)|\(#200\)/i.test(m)) return `${field}: ${PERMISSION_HINT}`
  if (/OAuth|session|expired|invalid.*token/i.test(m)) return `Token: ${m}`
  return `${field}: ${m}`
}

export interface MetaTestResult {
  message: string
  /** Instagram user id discovered from the Page, if any. */
  igUserId?: string
}

export const testMeta = async (c: Connections): Promise<MetaTestResult> => {
  const out: string[] = []
  let igUserId: string | undefined

  if (!c.meta.pageId) throw new Error('Enter your Facebook Page ID first (the "id" from GET me/accounts).')

  let page: { name: string; instagram_business_account?: { id: string } }
  try {
    page = await graph(c, c.meta.pageId, { fields: 'name,instagram_business_account' }, 'GET')
  } catch (e) {
    throw new Error(explain('Facebook Page ID', e as Error))
  }
  out.push(`✓ Facebook Page: ${page.name}`)

  const foundIg = page.instagram_business_account?.id
  if (foundIg && foundIg !== c.meta.igUserId) igUserId = foundIg
  const ig = c.meta.igUserId || foundIg
  if (!ig) {
    out.push(
      '✕ No Instagram account found on this Page. Make Instagram a professional account, link it to the Page, and make sure the token includes instagram_basic.',
    )
  } else {
    try {
      const acc = await graph(c, ig, { fields: 'username' }, 'GET')
      out.push(`✓ Instagram: @${acc.username}${igUserId ? ' (ID filled in)' : ''}`)
    } catch (e) {
      out.push(`✕ ${explain('Instagram user ID', e as Error)}`)
    }
  }
  return { message: out.join('\n'), igUserId }
}

// ── Webhook (Make / Zapier / n8n / your own server) ─────────────────────────

export const sendWebhook = async (c: Connections, payload: Record<string, unknown>) => {
  const body = JSON.stringify({ secret: c.webhook.secret || undefined, ...payload })
  try {
    const res = await fetch(c.webhook.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`)
    return 'sent'
  } catch (e) {
    if (!(e instanceof TypeError)) throw e
    // CORS blocked the JSON request: resend as a "simple" request. We can't read
    // the response, so this is fire-and-forget.
    await fetch(c.webhook.url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body })
    return 'sent (unconfirmed — CORS)'
  }
}

export const testWebhook = (c: Connections) =>
  sendWebhook(c, { event: 'sunnybags.test', message: 'Hello from SunnyBags Studio', sentAt: new Date().toISOString() })

// ── Orchestration ───────────────────────────────────────────────────────────

export const automatedPlatforms = (post: ScheduledPost, c: Connections) =>
  post.platforms.filter((p) => routeFor(p, c) !== 'manual')

export const manualPlatforms = (post: ScheduledPost, c: Connections) =>
  post.platforms.filter((p) => routeFor(p, c) === 'manual')

/**
 * Publish a post to every platform that has an automated route. Saves a log on
 * the post, and marks it posted once nothing is left to do by hand.
 */
export const publishPost = async (
  post: ScheduledPost,
  c: Connections,
  onProgress?: (msg: string) => void,
): Promise<PublishLogEntry[]> => {
  const bag = getBag(post.bagId)
  if (!bag) throw new Error(`Bag #${post.bagId} not found`)
  const targets = automatedPlatforms(post, c).filter(
    (p) => !post.publishLog?.some((l) => l.platform === p && l.ok), // don't double-post
  )
  if (!targets.length) return []

  onProgress?.('Rendering images…')
  const images = await renderPostImages(post, bag, true)

  let hosted: string[] | null = null
  let tempPhotos: string[] = []
  const igViaMeta = targets.some((p) => p === 'instagram' && routeFor(p, c) === 'meta')
  const webhookWantsUrls = targets.some((p) => routeFor(p, c) === 'webhook') && cloudinaryReady(c)
  if (cloudinaryReady(c) && (igViaMeta || webhookWantsUrls)) {
    onProgress?.('Uploading images…')
    hosted = await Promise.all(images.map((i) => uploadToCloudinary(i.url, c)))
  } else if (igViaMeta) {
    onProgress?.('Preparing images…')
    const r = await hostViaFacebook(c, images)
    hosted = r.urls
    tempPhotos = r.photoIds
  }

  const log: PublishLogEntry[] = []
  const at = () => new Date().toISOString()
  const webhookTargets: Platform[] = []

  for (const platform of targets) {
    const route = routeFor(platform, c)
    if (route === 'webhook') {
      webhookTargets.push(platform)
      continue
    }
    onProgress?.(`Publishing to ${platform}…`)
    try {
      const ref =
        platform === 'instagram'
          ? await publishInstagram(c, post.caption, hosted!)
          : await publishFacebook(c, post.caption, images)
      const url =
        platform === 'instagram'
          ? await graph(c, ref, { fields: 'permalink' }, 'GET').then((r) => r.permalink as string, () => undefined)
          : `https://www.facebook.com/${ref}`
      log.push({ platform, ok: true, via: 'meta', at: at(), ref, url })
    } catch (e) {
      log.push({ platform, ok: false, via: 'meta', at: at(), error: explain(platform, e as Error) })
    }
  }

  // Instagram has copied the images by now — remove the hidden helper photos.
  tempPhotos.forEach((id) => graph(c, id, { method: 'delete' }).catch(() => undefined))

  if (webhookTargets.length) {
    onProgress?.('Sending to webhook…')
    try {
      const ref = await sendWebhook(c, {
        event: 'sunnybags.publish',
        postId: post.id,
        platforms: webhookTargets,
        caption: post.caption,
        scheduledAt: post.scheduledAt,
        bag: { id: bag.id, category: bag.category, description: bag.description, price: bag.finalPrice, fabric: bag.fabric },
        shopUrl: `${window.location.origin}/item/${bag.id}`,
        imageUrls: hosted ?? undefined,
        // Only inline images when there's no hosting — they're large.
        images: hosted ? undefined : images.map((i) => ({ name: i.name, dataUrl: i.url })),
      })
      webhookTargets.forEach((platform) => log.push({ platform, ok: true, via: 'webhook', at: at(), ref }))
    } catch (e) {
      webhookTargets.forEach((platform) =>
        log.push({ platform, ok: false, via: 'webhook', at: at(), error: (e as Error).message }),
      )
    }
  }

  const fullLog = [...(post.publishLog ?? []), ...log]
  const allAutoOk = automatedPlatforms(post, c).every((p) => fullLog.some((l) => l.platform === p && l.ok))
  const nothingManual = manualPlatforms(post, c).length === 0
  const anyOk = log.some((l) => l.ok)
  studioActions.updatePost(post.id, {
    publishLog: fullLog,
    autoAttemptedAt: at(),
    // Published early → move it to "now" so the calendar is right and the slot frees up.
    ...(anyOk && new Date(post.scheduledAt).getTime() > Date.now() ? { scheduledAt: at() } : {}),
    ...(allAutoOk && nothingManual ? { status: 'posted' as const, postedAt: at() } : {}),
  })
  return log
}

// ── Instagram stats & sync ──────────────────────────────────────────────────

const igMediaId = (p: ScheduledPost) =>
  [...(p.publishLog ?? [])].reverse().find((l) => l.platform === 'instagram' && l.ok && l.via === 'meta' && l.ref)?.ref

/** Refresh likes/comments for every post published to Instagram via the API. */
const INSIGHTS_ERR_KEY = 'sunnybags_studio_insights_error'

/** Last reason insights couldn't be loaded (e.g. missing permission), or ''. */
export const insightsError = (): string => {
  try {
    return localStorage.getItem(INSIGHTS_ERR_KEY) ?? ''
  } catch {
    return ''
  }
}
const setInsightsError = (msg: string) => {
  try {
    if (msg) localStorage.setItem(INSIGHTS_ERR_KEY, msg)
    else localStorage.removeItem(INSIGHTS_ERR_KEY)
  } catch {
    /* ignore */
  }
}

// Richest set first; Instagram rejects the whole call if one metric isn't
// available for that media, so fall back to smaller sets.
const METRIC_SETS = [
  'views,reach,saved,shares,total_interactions,profile_visits,follows',
  'views,reach,saved,shares,total_interactions',
  'reach,saved,shares,total_interactions',
  'reach,saved',
]

type Insights = Partial<Pick<PostStats, 'views' | 'reach' | 'saved' | 'shares' | 'interactions' | 'profileVisits' | 'follows'>>

const fetchInsights = async (c: Connections, mediaId: string): Promise<Insights> => {
  let lastErr: Error | null = null
  for (const metric of METRIC_SETS) {
    try {
      const r = await graph(c, `${mediaId}/insights`, { metric }, 'GET')
      const out: Insights = {}
      for (const d of (r.data ?? []) as { name: string; values?: { value: number }[]; total_value?: { value: number } }[]) {
        const v = d.values?.[0]?.value ?? d.total_value?.value
        if (typeof v !== 'number') continue
        const key = ({ views: 'views', reach: 'reach', saved: 'saved', shares: 'shares', total_interactions: 'interactions', profile_visits: 'profileVisits', follows: 'follows' } as const)[d.name as 'views']
        if (key) out[key] = v
      }
      return out
    } catch (e) {
      lastErr = e as Error
      // Permission problems won't be fixed by asking for fewer metrics.
      if (/permission|\(#10\)|\(#200\)|instagram_manage_insights/i.test(lastErr.message)) break
    }
  }
  throw lastErr ?? new Error('No insights')
}

const HOUR = 3600000

/** How stale a post's stats may get: fresh posts change fast, old ones barely. */
const refreshEvery = (p: ScheduledPost) => {
  const age = Date.now() - new Date(p.postedAt ?? p.scheduledAt).getTime()
  return age < 3 * 24 * HOUR ? 0.5 * HOUR : age < 30 * 24 * HOUR ? 6 * HOUR : 24 * HOUR
}

/**
 * Refresh likes, comments, views, reach, saves, shares … for posts on
 * Instagram. Throttled per post by age unless `force` is set.
 */
export const refreshInstagramStats = async (c: Connections, posts: ScheduledPost[], opts: { force?: boolean } = {}) => {
  const targets = posts.filter(
    (p) =>
      p.status === 'posted' &&
      igMediaId(p) &&
      (opts.force || !p.stats?.fetchedAt || Date.now() - new Date(p.stats.fetchedAt).getTime() > refreshEvery(p)),
  )
  let updated = 0
  let insightsFailed = ''
  let insightsOk = false
  for (const p of targets) {
    const id = igMediaId(p)!
    try {
      const r = await graph(c, id, { fields: 'like_count,comments_count,permalink' }, 'GET')
      let ins: Insights = {}
      if (!insightsFailed) {
        try {
          ins = await fetchInsights(c, id)
          insightsOk = true
        } catch (e) {
          const m = (e as Error).message
          // A permission error applies to every post — stop asking this run.
          if (/permission|\(#10\)|\(#200\)/i.test(m)) insightsFailed = m
        }
      }
      const now = new Date().toISOString()
      studioActions.updatePost(p.id, {
        stats: {
          ...p.stats,
          ...ins,
          likes: r.like_count ?? 0,
          comments: r.comments_count ?? 0,
          fetchedAt: now,
          ...(Object.keys(ins).length ? { insightsAt: now } : {}),
        },
        publishLog: p.publishLog?.map((l) => (l.ref === id && !l.url ? { ...l, url: r.permalink } : l)),
      })
      updated++
    } catch {
      /* media deleted or no access — skip */
    }
  }
  if (insightsFailed) setInsightsError(insightsFailed)
  else if (insightsOk) setInsightsError('')
  return updated
}

interface IgMedia {
  id: string
  caption?: string
  permalink?: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

/**
 * Read your Instagram feed and record every post whose caption mentions
 * "Bag #123" as posted — so the scheduler knows what's already out there.
 */
const SYNC_KEY = 'sunnybags_studio_ig_sync_at'

export const lastInstagramSync = (): number => {
  try {
    return Number(localStorage.getItem(SYNC_KEY)) || 0
  } catch {
    return 0
  }
}

const DAY_MS = 86400000

/**
 * Read your Instagram feed and bring the studio in line with it:
 * - a planned post for that bag (due, or at most 2 days ahead) is checked off as posted
 * - otherwise the Instagram post is added to the history
 * - likes, comments and links are refreshed for posts already known
 * - "already posted" markers and future auto picks for those bags are cleared
 * Matches captions containing "Bag #123" or "Tasche #123".
 * Stops paging at the first page it already knows, unless `full` is set.
 */
export const syncFromInstagram = async (c: Connections, posts: ScheduledPost[], opts: { full?: boolean } = {}) => {
  const known = new Map<string, ScheduledPost>()
  posts.forEach((p) => p.publishLog?.forEach((l) => l.ref && l.platform === 'instagram' && known.set(l.ref, p)))
  const incremental = !opts.full && known.size > 0

  const media: IgMedia[] = []
  let page = await graph(c, `${c.meta.igUserId}/media`, { fields: 'id,caption,permalink,timestamp,like_count,comments_count', limit: '50' }, 'GET')
  for (let i = 0; i < 20; i++) {
    const batch: IgMedia[] = page.data ?? []
    media.push(...batch)
    const next: string | undefined = page.paging?.next
    if (!next || (incremental && batch.some((m) => known.has(m.id)))) break
    const res = await fetch(next)
    page = await res.json()
    if (page.error) throw new Error(page.error.message)
  }

  const now = new Date().toISOString()
  const added: ScheduledPost[] = []
  const patches = new Map<string, Partial<ScheduledPost>>()
  const postedBags = new Set<number>()
  const claimed = new Set<string>()
  let checkedOff = 0
  let unmatched = 0

  for (const m of media) {
    const stats = { likes: m.like_count ?? 0, comments: m.comments_count ?? 0, fetchedAt: now }
    const logEntry = { platform: 'instagram' as const, ok: true, via: 'meta' as const, at: m.timestamp, ref: m.id, url: m.permalink }

    const existing = known.get(m.id)
    if (existing) {
      patches.set(existing.id, { ...patches.get(existing.id), stats: { ...existing.stats, ...stats } })
      postedBags.add(existing.bagId)
      continue
    }

    const match = m.caption?.match(/(?:bag|tasche)\s*#\s*(\d+)/i)
    const bag = match ? getBag(Number(match[1])) : undefined
    if (!bag) {
      unmatched++
      continue
    }
    postedBags.add(bag.id)

    // Was this one of our planned posts, posted by hand? Check it off.
    const t = new Date(m.timestamp).getTime()
    const planned = posts
      .filter(
        (p) =>
          p.bagId === bag.id &&
          (p.status === 'scheduled' || p.status === 'draft') &&
          !claimed.has(p.id) &&
          new Date(p.scheduledAt).getTime() <= t + 2 * DAY_MS,
      )
      .sort((a, b) => Math.abs(new Date(a.scheduledAt).getTime() - t) - Math.abs(new Date(b.scheduledAt).getTime() - t))[0]

    if (planned) {
      claimed.add(planned.id)
      checkedOff++
      patches.set(planned.id, {
        status: 'posted',
        postedAt: m.timestamp,
        stats,
        publishLog: [...(planned.publishLog ?? []), logEntry],
      })
      continue
    }

    added.push({
      id: `ig_${m.id}`,
      bagId: bag.id,
      scheduledAt: m.timestamp,
      postedAt: m.timestamp,
      createdAt: now,
      platforms: ['instagram'],
      caption: m.caption ?? '',
      status: 'posted',
      design: { sizeId: 'insta_feed', sizeName: 'Instagram', w: 1080, h: 1350, side: 'A', bgColor: '#ffffff', isTransparent: false, bagScale: 1, format: 'image/jpeg' },
      publishLog: [logEntry],
      stats,
    })
  }

  let removedPicks = 0
  studioActions.mutatePosts((all) => [
    ...all
      .map((p) => (patches.has(p.id) ? { ...p, ...patches.get(p.id) } : p))
      .filter((p) => {
        if (!postedBags.has(p.bagId)) return true
        if (p.imported) return false // replaced by the real Instagram post
        const futureAutoPick = p.auto && p.status === 'scheduled' && new Date(p.scheduledAt).getTime() > Date.now()
        if (futureAutoPick) removedPicks++
        return !futureAutoPick
      }),
    ...added,
  ])
  try {
    localStorage.setItem(SYNC_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
  return { scanned: media.length, added: added.length, checkedOff, removedPicks, bags: postedBags.size, unmatched }
}

export const describeSync = (r: Awaited<ReturnType<typeof syncFromInstagram>>) => {
  const parts: string[] = []
  if (r.checkedOff) parts.push(`${r.checkedOff} planned post${r.checkedOff > 1 ? 's' : ''} checked off`)
  if (r.added) parts.push(`${r.added} added to history`)
  if (r.removedPicks) parts.push(`${r.removedPicks} repeat pick${r.removedPicks > 1 ? 's' : ''} removed from the queue`)
  return parts.length ? `Instagram sync: ${parts.join(', ')}` : ''
}
