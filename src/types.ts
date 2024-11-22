export type Bag = {
  id: number
  name: string
  category: string
  description?: string
  frontPhoto: string
  backPhoto: string
  fabric?: string
  size?: string
  price: number
  discountPercent: number
  bgColor?: string // optional if thumbnails are PNGs
}
