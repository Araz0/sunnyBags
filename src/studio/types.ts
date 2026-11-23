import { ImageFormat } from '../types/studio'

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'pinterest'
export type PostStatus = 'draft' | 'scheduled' | 'posted' | 'skipped'
export type CaptionTone = 'friendly' | 'minimal' | 'story' | 'sale'
/** Caption language. 'both' = German first, then English. */
export type CaptionLanguage = 'en' | 'de' | 'both'
export type PostSide = 'A' | 'B' | 'both'

export interface PostDesign {
  sizeId: string
  sizeName: string
  w: number
  h: number
  side: PostSide
  bgColor: string
  isTransparent: boolean
  bagScale: number
  format: ImageFormat
  /** Add the bag's extra photo (set in the bag studio) as the last slide. Default: yes. */
  includeExtra?: boolean
}

export interface ScheduledPost {
  id: string
  bagId: number
  scheduledAt: string // ISO
  platforms: Platform[]
  caption: string
  status: PostStatus
  design: PostDesign
  notes?: string
  createdAt: string
  postedAt?: string
  /** Created by the auto scheduler — may be reshuffled. Manual edits clear it. */
  auto?: boolean
  /** "Already posted" marker added from the library (no real post data). */
  imported?: boolean
  autoAttemptedAt?: string
  publishLog?: PublishLogEntry[]
  stats?: PostStats
  language?: CaptionLanguage
  /** Mention the fabric/material in the caption. */
  includeFabric?: boolean
}

export interface PublishLogEntry {
  platform: Platform
  ok: boolean
  via: 'meta' | 'webhook'
  at: string
  ref?: string
  /** Public link to the live post */
  url?: string
  error?: string
}

export interface PostStats {
  likes: number
  comments: number
  fetchedAt: string
  /** From Instagram insights (needs instagram_manage_insights) */
  views?: number
  reach?: number
  saved?: number
  shares?: number
  interactions?: number
  profileVisits?: number
  follows?: number
  insightsAt?: string
}

export interface StudioSettings {
  postingDays: number[] // 0 = Sunday
  postingTime: string // HH:MM
  weeklyGoal: number
  defaultPlatforms: Platform[]
  captionTone: CaptionTone
  hashtags: string
  signature: string
  notifications: boolean
  captionLanguage: CaptionLanguage
  /** Mention fabrics/materials in captions (off: the data isn't reliable). */
  includeFabric: boolean
  signatureDe: string
  hashtagsDe: string
  /** Keep the queue filled this many weeks ahead automatically (0 = off). */
  autoFillWeeks: number
  /** Allow the scheduler to pick bags that were already posted. */
  includePosted: boolean
}

export interface StudioData {
  version: 1
  posts: ScheduledPost[]
  settings: StudioSettings
}
