import styled from '@emotion/styled'
import React from 'react'

const size = 175
const CategoryCardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${size}px;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`
const StyledThumbnail = styled.img`
  width: ${size}px;
  height: ${size}px;
  object-fit: cover;
`
const StyledContentWrapper = styled.div`
  padding: 10px;
`
const StyledDiscountTag = styled.span`
  position: absolute;
  top: 10px;
  left: 0px;
  color: #ffcccc;
  background-color: #cc0e26;
  border-radius: 2px;
  padding: 5px;

  font-size: 12px;
`
const StyledName = styled.span`
  display: block;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
`

export type CategoryCardProps = {
  thumbnail: string
  discount: number
  name: string
  onClick?: () => void
}
const CategoryCardRaw = ({ thumbnail, name, discount, onClick }: CategoryCardProps) => {
  return (
    <CategoryCardContainer onClick={onClick}>
      <StyledThumbnail src={thumbnail} alt={`${name} - Thumbnail`} />
      {discount > 0 && <StyledDiscountTag>~{discount}%</StyledDiscountTag>}
      <StyledContentWrapper>
        <StyledName>{name}</StyledName>
      </StyledContentWrapper>
    </CategoryCardContainer>
  )
}

export const CategoryCard = React.memo(CategoryCardRaw)
