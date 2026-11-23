import { allBags, categories, ExtendedBag } from '../data'
import { DEFAULT_SETTINGS, PLATFORMS } from './constants'
import { CaptionTone, Platform, ScheduledPost, StudioSettings } from './types'

// ── Bags ────────────────────────────────────────────────────────────────────

export const getBag = (id: number): ExtendedBag | undefined =>
  allBags.all.find((b) => b.id === id)

const pad = (n: number) => n.toString().padStart(4, '0')

export const bagThumb = (bag: { id: number; category_id: number }) =>
  `/gallery/thumbnails/${pad(bag.category_id)}/${bag.id}A.png`

export const bagImage = (
  bag: { id: number; category_id: number },
  side: 'A' | 'B' = 'A',
) => `/gallery/images/${pad(bag.category_id)}/${bag.id}${side}.png`

export const categoryName = (id: number) =>
  categories.find((c) => c.id === id)?.name ?? 'Bag'

export const formatPrice = (bag: ExtendedBag) => {
  const final = bag.price - bag.price * (bag.discount / 100)
  return `€${Number.isInteger(final) ? final : final.toFixed(2)}`
}

// ── Dates ───────────────────────────────────────────────────────────────────

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const startOfWeek = (d: Date) => {
  const s = startOfDay(d)
  const day = (s.getDay() + 6) % 7 // Monday-based
  s.setDate(s.getDate() - day)
  return s
}

export const withTime = (d: Date, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  const n = new Date(d)
  n.setHours(h || 0, m || 0, 0, 0)
  return n
}

/** Value for <input type="datetime-local"> */
export const toLocalInput = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const fmtRelative = (iso: string, now = Date.now()) => {
  const diff = new Date(iso).getTime() - now
  const abs = Math.abs(diff)
  const mins = Math.round(abs / 60000)
  const hours = Math.round(abs / 3600000)
  const days = Math.round(abs / 86400000)
  const v =
    mins < 60 ? `${mins}m` : hours < 36 ? `${hours}h` : `${days}d`
  return diff >= 0 ? `in ${v}` : `${v} ago`
}

// ── Post state ──────────────────────────────────────────────────────────────

export const isDue = (p: ScheduledPost, now = Date.now()) =>
  p.status === 'scheduled' && new Date(p.scheduledAt).getTime() <= now

export const platformMeta = (id: Platform) =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]

/** Consecutive weeks (ending this or last week) that hit the weekly goal. */
export const postingStreak = (posts: ScheduledPost[], goal: number) => {
  const counts = new Map<number, number>()
  posts
    .filter((p) => p.status === 'posted' && !p.imported && p.postedAt)
    .forEach((p) => {
      const k = startOfWeek(new Date(p.postedAt!)).getTime()
      counts.set(k, (counts.get(k) ?? 0) + 1)
    })
  let streak = 0
  const cursor = startOfWeek(new Date())
  // Current week counts only if goal is already met; otherwise start from last week.
  if ((counts.get(cursor.getTime()) ?? 0) < goal) cursor.setDate(cursor.getDate() - 7)
  while ((counts.get(cursor.getTime()) ?? 0) >= Math.max(goal, 1)) {
    streak++
    cursor.setDate(cursor.getDate() - 7)
  }
  return streak
}

// ── Captions ────────────────────────────────────────────────────────────────

const cleanDesc = (d?: string) => (d ?? '').trim().replace(/\.+$/, '')

const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Plain captions: no prices, no labels, no emoji. */
export const generateCaption = (
  bag: ExtendedBag,
  tone: CaptionTone,
  settings: Pick<StudioSettings, 'hashtags' | 'signature'> = DEFAULT_SETTINGS,
): string => {
  const desc = cleanDesc(bag.description)
  const fabric = bag.fabric?.trim() ? capitalize(bag.fabric.trim()) : ''
  const sig = settings.signature?.trim()
  const tags = settings.hashtags?.trim()

  let lines: string[]
  switch (tone) {
    case 'minimal':
      lines = [`Bag #${bag.id}`, `${desc}.`]
      break
    case 'story':
      lines = [
        `Bag #${bag.id}`,
        `${desc}.`,
        `Cut, pieced and stitched by hand${fabric ? ` from ${fabric.toLowerCase()}` : ''}. There is only one.`,
      ]
      break
    case 'sale':
      lines = [`Bag #${bag.id} is available.`, `${desc}.`, [fabric, 'One of a kind.'].filter(Boolean).join('. ')]
      break
    case 'friendly':
    default:
      lines = [`Bag #${bag.id}`, `${desc}.`, [fabric, 'Handmade, one of a kind.'].filter(Boolean).join('. ')]
  }

  return [...lines, sig, tags].filter(Boolean).join('\n\n')
}

export const copyText = (text: string) => navigator.clipboard.writeText(text)
