import styled from '@emotion/styled'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const size = 175
const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${size}px;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
const StyledTagsContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
`
const StyledLeftTags = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`
const StyledRightTags = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`
const StyledAvailabilityBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 999px;
  background: #cc0e26;
  color: #fff;
  padding: 0.35rem 0.7rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 6px 18px rgba(204, 14, 38, 0.25);
  z-index: 2;
  pointer-events: none;
`
const StyledTag = styled.span<{ bgcolor?: string; color?: string }>`
  border-radius: 2px;
  background-color: lightgray;
  padding-inline: 5px;
  font-size: 12px;

  ${({ bgcolor }) => bgcolor && `background-color: ${bgcolor};`}
  ${({ color }) => color && `color: ${color};`}
`

export type CardProps = {
  id: number
  thumbnail: string
  price: number
  discount: number
  name: string
  category?: string
  available?: boolean
}

const CardRaw = ({
  id,
  thumbnail,
  name,
  discount,
  price,
  category,
  available = true,
}: CardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/item/${id}`)
    window.scrollTo(0, 0)
  }

  return (
    <CardContainer onClick={handleClick}>
      {!available && <StyledAvailabilityBadge>Sold</StyledAvailabilityBadge>}
      <StyledThumbnail src={thumbnail} alt={`${name} - Thumbnail`} />
      <StyledContentWrapper>
        <StyledTagsContainer>
          <StyledLeftTags>
            <StyledTag>
              {category ? category : ''}
              {name}
            </StyledTag>
          </StyledLeftTags>
          {available && (
            <StyledRightTags>
              <StyledTag>€{price - price * (discount / 100)}</StyledTag>
              {discount > 0 && (
                <StyledTag bgcolor="#cc0e26" color="#ffcccc">
                  {discount}%
                </StyledTag>
              )}
            </StyledRightTags>
          )}
        </StyledTagsContainer>
      </StyledContentWrapper>
    </CardContainer>
  )
}

export const Card = React.memo(CardRaw)
