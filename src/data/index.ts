import data0000 from '../data/0000.json'
import data0001 from '../data/0001.json'
import data0002 from '../data/0002.json'
import data0003 from '../data/0003.json'
import data0004 from '../data/0004.json'
import data0005 from '../data/0005.json'
import data0006 from '../data/0006.json'
import data0007 from '../data/0007.json'
import data0008 from '../data/0008.json'
import data0009 from '../data/0009.json'
import data0010 from '../data/0010.json'
import data0011 from '../data/0011.json'
import data0012 from '../data/0012.json'
import data0013 from '../data/0013.json'
import categories from '../data/categories.json'
import { Bag } from '../types'

const soldItems: number[] = [
  147, 135, 118, 119, 120, 124, 126, 131, 107, 90, 87, 81, 82, 83, 47, 49, 52,
  56, 62, 63, 64, 67, 75, 79, 16, 17, 23, 27, 32, 34, 37, 43, 44, 45, 6, 9, 1,
  12,
]

const getCategoryPrice = (categoryId: number) => {
  const category = categories.find((cat) => cat.id === categoryId)
  return category ? category.price : null
}

export type ExtendedBag = Bag & { category: string | null; finalPrice: number }

const overrideBagData = (bag: Bag): ExtendedBag => {
  const categoryPrice = getCategoryPrice(bag.category_id)
  const isSold = soldItems.includes(bag.id)
  const finalPrice = bag.price - bag.price * (bag.discount / 100)
  return {
    ...bag,
    price: categoryPrice !== null ? categoryPrice : bag.price,
    available: !isSold, // available is false if id is in soldItems
    category:
      categories.find((cat) => cat.id === bag.category_id)?.name || null,
    finalPrice,
  }
}

export function processData(data: Bag[]) {
  return data.map(overrideBagData)
}

const proccessedBags = {
  '0': processData(data0000),
  '1': processData(data0001),
  '2': processData(data0002),
  '3': processData(data0003),
  '4': processData(data0004),
  '5': processData(data0005),
  '6': processData(data0006),
  '7': processData(data0007),
  '8': processData(data0008),
  '9': processData(data0009),
  '10': processData(data0010),
  '11': processData(data0011),
  '12': processData(data0012),
  '13': processData(data0013),
}
export const allBags = {
  ...proccessedBags,
  all: Object.values(proccessedBags).flat(),
}

export type AllBags = keyof typeof allBags

export { categories }
