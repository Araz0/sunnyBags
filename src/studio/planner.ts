import { allBags, ExtendedBag } from '../data'
import { defaultDesign } from './constants'
import { generateCaption, startOfDay, sameDay, withTime } from './helpers'
import { studioActions } from './store'
import { ScheduledPost, StudioSettings } from './types'

const DAY = 86400000

type NewPost = Omit<ScheduledPost, 'id' | 'createdAt'>

/** Next free posting slots according to settings (one post per day max). */
export const nextFreeSlots = (
  settings: StudioSettings,
  posts: ScheduledPost[],
  count: number,
  from = new Date(),
  horizonDays = 120,
): Date[] => {
  const taken = posts
    .filter((p) => p.status !== 'skipped' && !p.imported)
    .map((p) => new Date(p.scheduledAt))
  const days = settings.postingDays.length ? settings.postingDays : [0, 1, 2, 3, 4, 5, 6]
  const out: Date[] = []
  const cursor = startOfDay(from)
  for (let i = 0; i < horizonDays && out.length < count; i++) {
    const d = new Date(cursor.getTime() + i * DAY)
    if (!days.includes(d.getDay())) continue
    const slot = withTime(d, settings.postingTime)
    if (slot.getTime() <= from.getTime()) continue
    if (taken.some((t) => sameDay(t, slot))) continue
    out.push(slot)
  }
  return out
}

export const postedBagIds = (posts: ScheduledPost[]) =>
  new Set(posts.filter((p) => p.status === 'posted').map((p) => p.bagId))

interface PickOptions {
  includePosted?: boolean
  /** Prefer not to pick these (used when reshuffling). */
  avoid?: Set<number>
}

/**
 * Pick bags for upcoming slots: unsold, not already queued, least recently
 * posted first, rotating categories so the feed stays varied.
 */
export const pickBags = (posts: ScheduledPost[], count: number, opts: PickOptions = {}): ExtendedBag[] => {
  const queued = new Set(
    posts.filter((p) => p.status === 'scheduled' || p.status === 'draft').map((p) => p.bagId),
  )
  const posted = postedBagIds(posts)
  const lastPosted = new Map<number, number>()
  posts
    .filter((p) => p.status === 'posted')
    .forEach((p) => {
      const t = new Date(p.postedAt ?? p.scheduledAt).getTime()
      lastPosted.set(p.bagId, Math.max(lastPosted.get(p.bagId) ?? 0, t))
    })

  const pool = allBags.all
    .filter((b) => b.available !== false && !queued.has(b.id))
    .filter((b) => opts.includePosted || !posted.has(b.id))
    .map((b) => ({
      bag: b,
      avoid: opts.avoid?.has(b.id) ? 1 : 0,
      last: lastPosted.get(b.id) ?? 0, // never posted → 0
      jitter: Math.random(),
      bonus: b.discount > 0 ? 1 : 0,
    }))
    .sort((a, b) => a.avoid - b.avoid || a.last - b.last || b.bonus - a.bonus || a.jitter - b.jitter)

  const result: ExtendedBag[] = []
  const recentCats: number[] = []
  while (result.length < count && pool.length) {
    let idx = pool.findIndex((c) => !c.avoid && !recentCats.includes(c.bag.category_id))
    if (idx === -1) idx = pool.findIndex((c) => !recentCats.includes(c.bag.category_id))
    if (idx === -1) idx = 0
    const [chosen] = pool.splice(idx, 1)
    result.push(chosen.bag)
    recentCats.push(chosen.bag.category_id)
    if (recentCats.length > 3) recentCats.shift()
  }
  return result
}

const toPost = (bag: ExtendedBag, slot: Date, settings: StudioSettings): NewPost => ({
  bagId: bag.id,
  scheduledAt: slot.toISOString(),
  platforms: [...settings.defaultPlatforms],
  caption: generateCaption(bag, settings.captionTone, settings),
  language: settings.captionLanguage,
  status: 'scheduled',
  design: defaultDesign(bag.backgroundColor || '#ffffff'),
  auto: true,
})

/** Plan `weeks` ahead, or every remaining bag with 'all'. */
export const buildAutoPlan = (
  settings: StudioSettings,
  posts: ScheduledPost[],
  weeks: number | 'all',
): NewPost[] => {
  const opts = { includePosted: settings.includePosted }
  if (weeks === 'all') {
    const bags = pickBags(posts, 10_000, opts)
    const perWeek = Math.max(1, settings.postingDays.length || 7)
    const horizon = Math.ceil(bags.length / perWeek) * 7 + 21
    const slots = nextFreeSlots(settings, posts, bags.length, new Date(), horizon)
    return slots.map((s, i) => toPost(bags[i], s, settings))
  }
  const until = Date.now() + weeks * 7 * DAY
  const slots = nextFreeSlots(settings, posts, 200).filter((s) => s.getTime() <= until)
  const bags = pickBags(posts, slots.length, opts)
  return bags.map((bag, i) => toPost(bag, slots[i], settings))
}

/** Swap one post's bag for another suggestion. Returns the new bag or null. */
export const reshuffleOne = (post: ScheduledPost, settings: StudioSettings, posts: ScheduledPost[]) => {
  const others = posts.filter((p) => p.id !== post.id)
  const [bag] = pickBags(others, 1, { includePosted: settings.includePosted, avoid: new Set([post.bagId]) })
  if (!bag || bag.id === post.bagId) return null
  studioActions.updatePost(post.id, {
    bagId: bag.id,
    caption: generateCaption(bag, settings.captionTone, settings, post.language ?? settings.captionLanguage),
    design: { ...post.design, bgColor: bag.backgroundColor || post.design.bgColor },
    auto: true,
  })
  return bag
}

export const isReshufflable = (p: ScheduledPost, now = Date.now()) =>
  p.status === 'scheduled' && !!p.auto && new Date(p.scheduledAt).getTime() > now

/** Re-pick bags for every upcoming auto-planned post. Returns how many changed. */
export const reshuffleAll = (settings: StudioSettings, posts: ScheduledPost[]) => {
  const targets = posts.filter((p) => isReshufflable(p)).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  if (!targets.length) return 0
  const others = posts.filter((p) => !targets.includes(p))
  const bags = pickBags(others, targets.length, {
    includePosted: settings.includePosted,
    avoid: new Set(targets.map((t) => t.bagId)),
  })
  const byId = new Map(targets.map((t, i) => [t.id, bags[i]]))
  studioActions.mutatePosts((all) =>
    all
      .map((p) => {
        if (!byId.has(p.id)) return p
        const bag = byId.get(p.id)
        if (!bag) return null // fewer bags than slots → free the slot
        return {
          ...p,
          bagId: bag.id,
          caption: generateCaption(bag, settings.captionTone, settings, p.language ?? settings.captionLanguage),
          design: { ...p.design, bgColor: bag.backgroundColor || p.design.bgColor },
        }
      })
      .filter((p): p is ScheduledPost => p !== null),
  )
  return targets.length
}

/** Mark bags as already posted (before the studio existed) or undo that. */
export const setAlreadyPosted = (bagIds: number[], posted: boolean, posts: ScheduledPost[]) => {
  const ids = new Set(bagIds)
  const now = new Date().toISOString()
  if (posted) {
    const alreadyPosted = postedBagIds(posts)
    const add: ScheduledPost[] = bagIds
      .filter((id) => !alreadyPosted.has(id))
      .map((id) => ({
        id: `imp_${id}_${Date.now().toString(36)}`,
        bagId: id,
        scheduledAt: now,
        postedAt: now,
        createdAt: now,
        platforms: [],
        caption: '',
        status: 'posted',
        imported: true,
        design: defaultDesign(),
      }))
    // Drop upcoming auto-planned posts for those bags — they'd be repeats.
    studioActions.mutatePosts((all) => [
      ...all.filter((p) => !(ids.has(p.bagId) && isReshufflable(p))),
      ...add,
    ])
  } else {
    studioActions.mutatePosts((all) => all.filter((p) => !(ids.has(p.bagId) && p.imported)))
  }
}
