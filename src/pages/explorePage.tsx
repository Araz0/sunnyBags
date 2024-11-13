import styled from '@emotion/styled'
import { memo } from 'react'
import { Card } from '../components'
import { Bag } from '../types'

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px;
`

const bags: Bag[] = [
  {
    id: 1,
    name: 'Vintage Tote',
    category: 'Tote Bags',
    description: 'A spacious, stylish tote bag perfect for daily use.',
    frontPhoto: './front.jpg',
    backPhoto: './back.jpg',
    fabric: 'Canvas',
    size: '15x15 inches',
    price: 40,
    discountPercent: 10,
    bgColor: '#f0e68c',
  },
  {
    id: 2,
    name: 'Minimalist Clutch',
    category: 'Clutches',
    description: 'A sleek and elegant clutch for evenings.',
    frontPhoto: './front.jpg',
    backPhoto: './back.jpg',
    fabric: 'Leather',
    size: '8x5 inches',
    price: 25,
    discountPercent: 5,
    bgColor: '#dcdcdc',
  },
  {
    id: 3,
    name: 'Eco-Friendly Shopper',
    category: 'Shopping Bags',
    description: 'An eco-conscious bag made from recycled materials.',
    frontPhoto: './front.jpg',
    backPhoto: './back.jpg',
    fabric: 'Recycled Polyester',
    size: '18x16 inches',
    price: 30,
    discountPercent: 15,
    bgColor: '#a9dfbf',
  },
]

const ExplorePageRaw = () => {
  return (
    <ContentWrapper>
      {bags.map((bag) => (
        <Card
          key={bag.id}
          thumbnail={bag.frontPhoto}
          price={bag.price}
          discount={bag.discountPercent}
          name={bag.name}
          category={bag.category}
        />
      ))}
    </ContentWrapper>
  )
}

export const ExplorePage = memo(ExplorePageRaw)
