import React from 'react'
import { Platform } from './types'

/**
 * API credentials live in their own localStorage key so they are never part of
 * the regular backup file and never committed to the repo.
 */
export interface Connections {
  meta: {
    pageId: string
    igUserId: string
    pageToken: string
    graphVersion: string
  }
  cloudinary: {
    cloudName: string
    uploadPreset: string
  }
  webhook: {
    url: string
    secret: string
    platforms: Platform[]
  }
  /** Publish due posts automatically while the studio is open. */
  autoPublish: boolean
}

export const DEFAULT_CONNECTIONS: Connections = {
  meta: { pageId: '', igUserId: '', pageToken: '', graphVersion: 'v27.0' },
  cloudinary: { cloudName: '', uploadPreset: '' },
  webhook: { url: '', secret: '', platforms: ['tiktok', 'pinterest'] },
  autoPublish: false,
}

const KEY = 'sunnybags_studio_connections_v1'

const load = (): Connections => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<Connections>
      return {
        meta: {
          ...DEFAULT_CONNECTIONS.meta,
          ...p.meta,
          // Upgrade the old default; keep any version the user typed themselves.
          ...(!p.meta?.graphVersion || p.meta.graphVersion === 'v23.0' ? { graphVersion: DEFAULT_CONNECTIONS.meta.graphVersion } : {}),
        },
        cloudinary: { ...DEFAULT_CONNECTIONS.cloudinary, ...p.cloudinary },
        webhook: { ...DEFAULT_CONNECTIONS.webhook, ...p.webhook },
        autoPublish: !!p.autoPublish,
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_CONNECTIONS
}

let state = load()
const listeners = new Set<() => void>()

export const getConnections = () => state

export const setConnections = (patch: Partial<Connections>) => {
  state = { ...state, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export const clearConnections = () => {
  localStorage.removeItem(KEY)
  state = DEFAULT_CONNECTIONS
  listeners.forEach((l) => l())
}

export const useConnections = () =>
  React.useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )

// ── Routing ─────────────────────────────────────────────────────────────────

export type Route = 'meta' | 'webhook' | 'manual'

export const metaFacebookReady = (c: Connections) => !!(c.meta.pageId && c.meta.pageToken)
export const cloudinaryReady = (c: Connections) => !!(c.cloudinary.cloudName && c.cloudinary.uploadPreset)

/** Instagram needs a public image URL: Cloudinary, or a temporary hidden photo on the Facebook Page. */
export const metaInstagramReady = (c: Connections) =>
  !!(c.meta.igUserId && c.meta.pageToken && (cloudinaryReady(c) || c.meta.pageId))

/** What's still missing before a platform can publish automatically. */
export const missingFor = (platform: Platform, c: Connections): string[] => {
  const m: string[] = []
  if (platform === 'instagram' || platform === 'facebook') {
    if (!c.meta.pageToken) m.push('Page access token')
    if (!c.meta.pageId) m.push('Facebook Page ID')
    if (platform === 'instagram' && !c.meta.igUserId) m.push('Instagram user ID (click “Test connection”)')
  } else if (!c.webhook.url || !c.webhook.platforms.includes(platform)) {
    m.push('a webhook (TikTok/Pinterest only work through Make, Zapier or n8n)')
  }
  return m
}

/** How a platform gets published: Meta API first, then webhook, else by hand. */
export const routeFor = (platform: Platform, c: Connections): Route => {
  if (platform === 'facebook' && metaFacebookReady(c)) return 'meta'
  if (platform === 'instagram' && metaInstagramReady(c)) return 'meta'
  if (c.webhook.url && c.webhook.platforms.includes(platform)) return 'webhook'
  return 'manual'
}
