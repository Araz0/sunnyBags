// export type Bag = {
//   id: number
//   name: string
//   category: string
//   description?: string
//   frontPhoto: string
//   backPhoto: string
//   fabric?: string
//   size?: string
//   price: number
//   discountPercent: number
//   bgColor?: string // optional if thumbnails are PNGs
// }

export type Bag = {
    id: number;
    description: string;
    fabric: string;
    price: number;
    discount: number;
    category_id: number;
    backgroundColor: string;
}