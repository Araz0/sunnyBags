import styled from '@emotion/styled'
import React from 'react'

const size = 175
const CategoryCardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${size}px;
  height: ${size + 66}px;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
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

const SoldOutBanner = styled.div`
  width: 100%;
  background-color: #cc0e26;
  color: white;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 0;
  margin-top: 5px;
  border-radius: 2px;
  text-transform: uppercase;
`

const StyledName = styled.span`
  display: block;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
`

const StyledPrice = styled.span`
  display: block;
  text-align: center;
  font-size: 13px;
  color: #444;
`

export type CategoryCardProps = {
  thumbnail: string
  discount: number
  name: string
  price?: number
  soldOut?: boolean
  onClick?: () => void
}

const CategoryCardRaw = ({
  thumbnail,
  name,
  discount,
  onClick,
  price,
  soldOut = false,
}: CategoryCardProps) => {
  return (
    <CategoryCardContainer onClick={onClick}>
      <StyledThumbnail src={thumbnail} alt={`${name} - Thumbnail`} />
      
      {/* Discount Tag stays absolute on the image */}
      {!soldOut && discount > 0 && <StyledDiscountTag>~{discount}%</StyledDiscountTag>}
      
      <StyledContentWrapper>
        <StyledName>{name}</StyledName>
        
        {/* If sold out, show the banner, otherwise show the price */}
        {soldOut ? (
          <SoldOutBanner>Sold Out</SoldOutBanner>
        ) : (
          price !== undefined && <StyledPrice>€{price}</StyledPrice>
        )}
      </StyledContentWrapper>
    </CategoryCardContainer>
  )
}

export const CategoryCard = React.memo(CategoryCardRaw)