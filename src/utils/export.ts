import { ImageFormat, ResolutionEntry, SideState } from '../types/studio'

interface RenderOptions {
  item: { id: number; category_id: number }
  side: 'A' | 'B'
  w: number
  h: number
  bgColor: string
  isTransparent: boolean
  bagScale: number
  format: ImageFormat
}

interface ExportOptions {
  item: { id: number; category_id: number }
  bgColor: string
  isTransparent: boolean
  bagScale: number
  format: ImageFormat
  sides: SideState
  targets: ResolutionEntry[]
}

export const extFor = (format: ImageFormat) =>
  format === 'image/jpeg' ? 'jpg' : format.split('/')[1]

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Could not load ${src}`))
    img.src = src
  })

/** Render one bag photo onto a canvas and return it as a data URL. */
export const renderBagImage = async (opts: RenderOptions): Promise<string> => {
  const { item, side, w, h, bgColor, isTransparent, bagScale, format } = opts
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  if (!isTransparent || format === 'image/jpeg') {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)
  }

  const padded = item.category_id.toString().padStart(4, '0')
  const img = await loadImage(`/gallery/images/${padded}/${item.id}${side}.png`)

  const ratio = Math.min((w * bagScale) / img.width, (h * bagScale) / img.height)
  const dw = img.width * ratio
  const dh = img.height * ratio
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)

  return canvas.toDataURL(format, 0.95)
}

/** Render a regular photo filling the frame (cropped to fit, like Instagram does). */
export const renderPhoto = async (opts: { src: string; w: number; h: number; bgColor: string; format: ImageFormat }) => {
  const { src, w, h, bgColor, format } = opts
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, w, h)
  const img = await loadImage(src)
  const ratio = Math.max(w / img.width, h / img.height)
  const dw = img.width * ratio
  const dh = img.height * ratio
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  return canvas.toDataURL(format, 0.92)
}

export const exportAssets = async (opts: ExportOptions): Promise<void> => {
  const { item, bgColor, isTransparent, bagScale, format, sides, targets } = opts
  const sidesToProcess: ('A' | 'B')[] = []
  if (sides.front) sidesToProcess.push('A')
  if (sides.back) sidesToProcess.push('B')
  const ext = extFor(format)

  for (const target of targets) {
    for (const side of sidesToProcess) {
      const url = await renderBagImage({
        item,
        side,
        w: target.w,
        h: target.h,
        bgColor,
        isTransparent,
        bagScale,
        format,
      })
      const sideName = side === 'A' ? 'front' : 'back'
      const transpLabel = isTransparent ? 'transparent_' : ''
      downloadDataUrl(url, `${item.id}_${sideName}_${transpLabel}${target.id}.${ext}`)
    }
  }
}
