import { ImageFormat, ResolutionEntry, SideState } from '../types/studio'

interface ExportOptions {
  item: { id: number; category_id: number }
  bgColor: string
  isTransparent: boolean
  bagScale: number
  format: ImageFormat
  sides: SideState
  targets: ResolutionEntry[]
}

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export const exportAssets = async (opts: ExportOptions): Promise<void> => {
  const { item, bgColor, isTransparent, bagScale, format, sides, targets } =
    opts

  const sidesToProcess: ('A' | 'B')[] = []
  if (sides.front) sidesToProcess.push('A')
  if (sides.back) sidesToProcess.push('B')

  const paddedCategoryId = item.category_id.toString().padStart(4, '0')
  const ext = format === 'image/jpeg' ? 'jpg' : format.split('/')[1]

  for (const target of targets) {
    for (const side of sidesToProcess) {
      const canvas = document.createElement('canvas')
      canvas.width = target.w
      canvas.height = target.h
      const ctx = canvas.getContext('2d')
      if (!ctx) continue

      if (!isTransparent) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = `/gallery/images/${paddedCategoryId}/${item.id}${side}.png`
      await new Promise<void>((res) => {
        img.onload = () => res()
      })

      const maxW = canvas.width * bagScale
      const maxH = canvas.height * bagScale
      const ratio = Math.min(maxW / img.width, maxH / img.height)
      const dw = img.width * ratio
      const dh = img.height * ratio

      ctx.drawImage(
        img,
        (canvas.width - dw) / 2,
        (canvas.height - dh) / 2,
        dw,
        dh,
      )

      const sideName = side === 'A' ? 'front' : 'back'
      const transpLabel = isTransparent ? 'transparent_' : ''
      downloadDataUrl(
        canvas.toDataURL(format, 0.95),
        `${item.id}_${sideName}_${transpLabel}${target.id}.${ext}`,
      )
    }
  }
}

export const copyPostText = (itemId: number, description: string): void => {
  const text = `Bag #${itemId}\n\n${description}.\n\n#Bag #SunnyBags #DenimArt #Stitch #Thread #VintageStyle #Upcycled #Handmade\n`
  navigator.clipboard.writeText(text).then(
    () => alert('Post text copied!'),
    () => alert('Copy failed — please copy manually.'),
  )
}
