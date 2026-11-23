import React from 'react'
import { DEFAULT_SETTINGS } from './constants'
import { ScheduledPost, StudioData, StudioSettings } from './types'

const KEY = 'sunnybags_studio_v1'

const load = (): StudioData => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudioData>
      let posts = Array.isArray(parsed.posts) ? parsed.posts : []
      // One-time upgrade: upcoming front-only posts become front + back carousels.
      const FLAG = 'sunnybags_studio_carousel_v1'
      if (!localStorage.getItem(FLAG)) {
        posts = posts.map((p) =>
          (p.status === 'scheduled' || p.status === 'draft') && p.design?.side === 'A'
            ? { ...p, design: { ...p.design, side: 'both' as const } }
            : p,
        )
        const data: StudioData = { version: 1, posts, settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) } }
        localStorage.setItem(KEY, JSON.stringify(data))
        localStorage.setItem(FLAG, '1')
      }
      return {
        version: 1,
        posts,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return { version: 1, posts: [], settings: DEFAULT_SETTINGS }
}

let state: StudioData = load()
const listeners = new Set<() => void>()

const commit = (next: StudioData) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full / blocked — keep in memory */
  }
  listeners.forEach((l) => l())
}

// Keep multiple tabs in sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load()
      listeners.forEach((l) => l())
    }
  })
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export const studioActions = {
  addPost(post: Omit<ScheduledPost, 'id' | 'createdAt'>): ScheduledPost {
    const full: ScheduledPost = {
      ...post,
      id: uid(),
      createdAt: new Date().toISOString(),
    }
    commit({ ...state, posts: [...state.posts, full] })
    return full
  },
  addPosts(posts: Omit<ScheduledPost, 'id' | 'createdAt'>[]) {
    const now = new Date().toISOString()
    commit({
      ...state,
      posts: [
        ...state.posts,
        ...posts.map((p) => ({ ...p, id: uid(), createdAt: now })),
      ],
    })
  },
  updatePost(id: string, patch: Partial<ScheduledPost>) {
    commit({
      ...state,
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })
  },
  /** Apply several post changes as one save. */
  mutatePosts(fn: (posts: ScheduledPost[]) => ScheduledPost[]) {
    commit({ ...state, posts: fn(state.posts) })
  },
  deletePost(id: string) {
    commit({ ...state, posts: state.posts.filter((p) => p.id !== id) })
  },
  markPosted(id: string) {
    studioActions.updatePost(id, {
      status: 'posted',
      postedAt: new Date().toISOString(),
    })
  },
  updateSettings(patch: Partial<StudioSettings>) {
    commit({ ...state, settings: { ...state.settings, ...patch } })
  },
  importData(data: StudioData) {
    commit({
      version: 1,
      posts: Array.isArray(data.posts) ? data.posts : [],
      settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
    })
  },
  exportData(): StudioData {
    return state
  },
}

export const useStudioData = (): StudioData =>
  React.useSyncExternalStore(subscribe, () => state)

/** Re-render every `ms` so "due now" states stay current. */
export const useNow = (ms = 30_000) => {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}
