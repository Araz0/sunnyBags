import React from 'react'

/**
 * Optional extra photo per bag (e.g. a lifestyle / worn shot), added as the
 * last carousel slide. Stored compressed in localStorage.
 */
const KEY = 'sunnybags_studio_extras_v1'

type Extras = Record<string, { dataUrl: string; updatedAt: string }>

const load = (): Extras => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Extras
  } catch {
    return {}
  }
}

let state = load()
const listeners = new Set<() => void>()

const commit = (next: Extras) => {
  localStorage.setItem(KEY, JSON.stringify(next)) // throws when storage is full
  state = next
  listeners.forEach((l) => l())
}

export const getExtraPhoto = (bagId: number): string | undefined => state[bagId]?.dataUrl

export const setExtraPhoto = (bagId: number, dataUrl: string) =>
  commit({ ...state, [bagId]: { dataUrl, updatedAt: new Date().toISOString() } })

export const removeExtraPhoto = (bagId: number) => {
  const next = { ...state }
  delete next[bagId]
  commit(next)
}

export const useExtraPhoto = (bagId: number | undefined) =>
  React.useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => (bagId == null ? undefined : state[bagId]?.dataUrl),
  )

/** Shrink an uploaded photo to max 1440px on the long side, JPEG ~85%. */
export const compressPhoto = (file: File, maxSide = 1440): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file is not an image'))
    }
    img.src = url
  })
