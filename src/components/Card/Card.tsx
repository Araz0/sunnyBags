import styled from '@emotion/styled'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const SIZE = 180
const IMG_SIZE = 180
const CARD_HEIGHT = 260

const CardContainer = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${CARD_HEIGHT}px;
  flex-shrink: 0;
  background: var(--surface-2, #fff);
  border: 0.5px solid var(--border, #e5e5e5);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: var(--border-strong, #ccc);
    transform: translateY(-2px);
  }
`

const Thumbnail = styled.img`
  width: ${IMG_SIZE}px;
  height: ${IMG_SIZE}px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
`

const Body = styled.div`
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`

const IdRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 6px;
`

const Category = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted, #999);
`

const Sep = styled.span`
  font-size: 11px;
  color: var(--border-strong, #ccc);
`

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #111);
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

const Price = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #111);
`

const Original = styled.span`
  font-size: 12px;
  color: var(--text-muted, #999);
  text-decoration: line-through;
`

const DiscountBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-success, #3b6d11);
  background: var(--bg-success, #eaf3de);
  border-radius: 4px;
  padding: 1px 5px;
`

const SoldOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 3;
`

const SoldLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
`

const SoldSub = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.04em;
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

const CardRaw = ({ id, thumbnail, name, discount, price, category, available = true }: CardProps) => {
  const navigate = useNavigate()
  const finalPrice = price - price * (discount / 100)

  const handleClick = () => {
    navigate(`/item/${id}`)
    window.scrollTo(0, 0)
  }

  return (
    <CardContainer onClick={handleClick}>
      {!available && (
        <SoldOverlay aria-label="Sold — no longer available">
          <SoldLabel>Sold</SoldLabel>
          <SoldSub>No longer available</SoldSub>
        </SoldOverlay>
      )}
      <Thumbnail src={thumbnail} alt={name} />
      <Body>
        <IdRow>
          {category && <><Category>{category}</Category><Sep>·</Sep></>}
          <Name>{name}</Name>
        </IdRow>
        {available && (
          <PriceRow>
            <Price>€{finalPrice.toFixed(2)}</Price>
            {discount > 0 && (
              <>
                <Original>€{price.toFixed(2)}</Original>
                <DiscountBadge>–{discount}%</DiscountBadge>
              </>
            )}
          </PriceRow>
        )}
      </Body>
    </CardContainer>
  )
}

export const Card = React.memo(CardRaw)