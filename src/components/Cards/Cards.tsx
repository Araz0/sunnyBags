import styled from '@emotion/styled'
import React from 'react'
import { Bag } from '../../types'
import { Card } from '../Card/'

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1rem;
`

type CardsProps = {
  bags: Bag[]
}
const CardsRaw = ({ bags }: CardsProps) => {
  return (
    <ContentWrapper>
      {bags.map((bag) => (
        <Card
          key={bag.id}
          thumbnail={`/gallery/thumbnails/${bag.category_id.toString().padStart(4, '0')}/${bag.id}A.png`}
          price={bag.price}
          discount={bag.discount}
          name={'#' + bag.id}
          id={bag.id}
          category={bag.category_id.toString().padStart(4, '0')}
          available={bag.available}
        />
      ))}
    </ContentWrapper>
  )
}

export const Cards = React.memo(CardsRaw)
