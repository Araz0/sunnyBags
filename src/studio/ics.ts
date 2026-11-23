import { getBag, platformMeta } from './helpers'
import { ScheduledPost } from './types'

const stamp = (d: Date) =>
  d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

/** Build an .ics calendar so the phone reminds you when a post is due. */
export const buildIcs = (posts: ScheduledPost[], baseUrl: string) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SunnyBags//Content Studio//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:SunnyBags posting plan',
  ]
  posts.forEach((p) => {
    const start = new Date(p.scheduledAt)
    const end = new Date(start.getTime() + 15 * 60000)
    const bag = getBag(p.bagId)
    const where = p.platforms.map((x) => platformMeta(x).label).join(', ')
    const link = `${baseUrl}/studio/queue?post=${p.id}`
    lines.push(
      'BEGIN:VEVENT',
      `UID:${p.id}@sunnybags-studio`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${esc(`📸 Post Bag #${p.bagId} on ${where}`)}`,
      `DESCRIPTION:${esc(`${bag?.description ?? ''}\n\nOpen the publish assistant: ${link}\n\n---\n${p.caption}`)}`,
      `URL:${link}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Time to post!',
      'TRIGGER:-PT10M',
      'END:VALARM',
      'END:VEVENT',
    )
  })
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export const downloadBlob = (content: string, filename: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
