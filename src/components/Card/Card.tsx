import styled from '@emotion/styled'
import React from 'react'

const size = 175
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${size}px;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  overflow: hidden;
`
const StyledThumbnail = styled.img`
  width: ${size}px;
  height: ${size}px;
  object-fit: cover;
`
const StyledContentWrapper = styled.div`
  padding: 10px;
`
const StyledTagsContainer = styled.div`
  display: flex;
  gap: 5px;
`
const StyledTag = styled.span<{bgcolor?: string, color?: string}>`
  border-radius: 2px;
  background-color: lightgray;
  padding-inline: 5px;
  font-size: 12px;

  ${({ bgcolor }) => bgcolor && `background-color: ${bgcolor};`}
  ${({ color }) => color && `color: ${color};`}
`
const StyledName = styled.span`
  display: block;
  text-align: left;
`

export type CardProps = {
  thumbnail: string
  price: number
  discount: number
  name: string
  category: string
}
const CardRaw = ({ thumbnail, name, discount, price, category }: CardProps) => {
  return (
    <CardContainer>
      <StyledThumbnail src={thumbnail} alt="alt front img" />
      <StyledContentWrapper>
        <StyledTagsContainer>
          <StyledTag>{price - price * (discount / 100)}€</StyledTag>
          <StyledTag bgcolor='#cc0e26' color='#ffcccc'>{discount}%</StyledTag>
          <StyledTag>{category}</StyledTag>
        </StyledTagsContainer>
        <StyledName>{name}</StyledName>
      </StyledContentWrapper>
    </CardContainer>
  )
}

export const Card = React.memo(CardRaw)
