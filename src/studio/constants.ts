import { CaptionLanguage, CaptionTone, Platform, PostDesign, StudioSettings } from './types'

export const PRESET_SIZES = [
  { id: 'insta_feed', w: 1080, h: 1350, name: 'Instagram Feed (4:5)' },
  { id: 'insta_story', w: 1080, h: 1920, name: 'Story / Reel (9:16)' },
  { id: 'square_post', w: 1080, h: 1080, name: 'Square Grid (1:1)' },
  { id: 'pin', w: 1000, h: 1500, name: 'Pinterest Pin (2:3)' },
  { id: 'hq_print', w: 2160, h: 2700, name: 'Ultra High-Res (4:5)' },
]

export const PLATFORMS: { id: Platform; label: string; url: string; color: string }[] = [
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/', color: '#d6249f' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/', color: '#1877f2' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/upload', color: '#111111' },
  { id: 'pinterest', label: 'Pinterest', url: 'https://www.pinterest.com/pin-builder/', color: '#e60023' },
]

export const TONES: { id: CaptionTone; label: string }[] = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'story', label: 'Story' },
  { id: 'sale', label: 'Available' },
  { id: 'minimal', label: 'Minimal' },
]

export const LANGUAGES: { id: CaptionLanguage; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'de', label: 'Deutsch' },
  { id: 'both', label: 'DE + EN' },
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const DEFAULT_SETTINGS: StudioSettings = {
  postingDays: [1, 3, 5],
  postingTime: '18:00',
  weeklyGoal: 3,
  defaultPlatforms: ['instagram'],
  captionTone: 'friendly',
  hashtags:
    '#SunnyBags #Handmade #Upcycled #DenimArt #Stitch #Thread #VintageStyle #SlowFashion',
  signature: 'DM us to make it yours.',
  notifications: false,
  captionLanguage: 'en',
  signatureDe: 'Schreib uns eine DM, wenn du sie haben möchtest.',
  hashtagsDe: '#SunnyBags #Handgemacht #Upcycling #Nachhaltig #Unikat #Taschenliebe #DenimArt #SlowFashion',
  autoFillWeeks: 0,
  includePosted: false,
}

export const defaultDesign = (bgColor = '#ffffff'): PostDesign => ({
  sizeId: PRESET_SIZES[0].id,
  sizeName: PRESET_SIZES[0].name,
  w: PRESET_SIZES[0].w,
  h: PRESET_SIZES[0].h,
  side: 'both',
  bgColor,
  isTransparent: false,
  bagScale: 1,
  format: 'image/jpeg',
})
