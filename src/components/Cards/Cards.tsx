import styled from '@emotion/styled'
import React from 'react'
import { Bag } from '../../types'
import { Card } from '../Card/'

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
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

export const Cards = React.memo(CardsRaw)
