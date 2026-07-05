import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer, Cards } from '../components'
import { allBags, ExtendedBag } from '../data'
import styled from '@emotion/styled'

const BackButton = styled.button`
  color: #333333;
  background-color: transparent;
  border: none;
  padding-inline: 1.5rem;
  margin-block: 0.5rem;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #000000;
  }
`

/* ---- Layout ---- */
const PageInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem);
  padding-top: 0;
`

const ItemLayout = styled.div`
  display: flex;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: stretch;

  @media (max-width: 899px) {
    flex-direction: column;
  }
`

/* ---- Hero: flat background color + blurred blob mesh behind the bag ---- */
const HeroSection = styled.div<{ bg?: string }>`
  flex: 1.15;
  min-width: 300px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background-color: ${(props) => props.bg || '#e8e8e8'};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: clamp(2rem, 5vw, 3.5rem);

  @media (min-width: 900px) {
    min-height: 600px;
    max-width: 620px;
  }

  /* Full-bleed edge-to-edge on mobile, regardless of any parent padding */
  @media (max-width: 899px) {
    width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%);
    max-width: 100vw;
  }
`

const BlobField = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`

const Blob = styled.div<{
  size: string
  top: string
  left: string
  color: string
  blur: string
  opacity: number
}>`
  position: absolute;
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  border-radius: 50%;
  background: ${(p) => p.color};
  filter: blur(${(p) => p.blur});
  opacity: ${(p) => p.opacity};
  transform: translate(-50%, -50%);
`

const ImageStage = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.25rem);
`

const BagImage = styled.img`
  width: 100%;
  max-width: 320px;
  object-fit: contain;
  filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.18));
  transition: opacity 0.25s ease;

  @media (min-width: 900px) {
    max-width: 400px;
  }
`

const SideToggle = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
`

const ToggleButton = styled.button<{ active?: boolean }>`
  border: none;
  cursor: pointer;
  padding: 0.5rem 1.3rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 0.2s ease, color 0.2s ease;
  background: ${(props) => (props.active ? '#ffffff' : 'transparent')};
  color: ${(props) => (props.active ? '#111111' : '#2b2b2b')};

  &:hover {
    background: ${(props) => (props.active ? '#ffffff' : 'rgba(255,255,255,0.2)')};
  }
`

/* ---- Info ---- */
const InfoSection = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
`

const ItemTitle = styled.h1`
  font-size: clamp(1.6rem, 2.5vw, 2.1rem);
  margin: 0;
`

const AvailabilityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #cc0e26;
  color: #fff;
  padding: 0.35rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: auto;
  flex-wrap: wrap;
`

const CurrentPrice = styled.span`
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: bold;
  cursor: pointer;
`

const OriginalPrice = styled.span`
  font-size: 1.15rem;
  text-decoration: line-through;
  opacity: 0.6;
`

const DiscountBadge = styled.span`
  background: #cc0e26;
  color: white;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
`

const CategoryTag = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #333;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }
`

const Description = styled.div`
  max-width: 46ch;
`

const DescriptionTitle = styled.h3`
  font-size: 1.05rem;
  margin: 0 0 0.5rem;
`

const DescriptionText = styled.p`
  line-height: 1.65;
  font-size: 0.98rem;
  margin: 0;
  color: #444;
`

/* ---- Related: back to the page's normal background ---- */
const RelatedSection = styled.div`
  margin-top: clamp(3rem, 6vw, 5rem);
  padding-top: 2rem;
  border-top: 1px solid #eee;
  background: transparent;
`

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
`

/* Precomputed blob layout (position/size vary, color/opacity derived from item bg at render time) */
const BLOB_LAYOUT = [
  { size: '55%', top: '15%', left: '20%', blur: '70px', opacity: 0.9, mix: 'white 45%' },
  { size: '65%', top: '80%', left: '85%', blur: '90px', opacity: 0.8, mix: 'black 15%' },
  { size: '40%', top: '85%', left: '15%', blur: '60px', opacity: 0.75, mix: 'white 25%' },
  { size: '50%', top: '10%', left: '85%', blur: '80px', opacity: 0.7, mix: 'black 10%' },
  { size: '35%', top: '50%', left: '50%', blur: '100px', opacity: 0.6, mix: 'white 60%' },
  { size: '30%', top: '35%', left: '75%', blur: '75px', opacity: 0.5, mix: 'white 70%' },
]

const ItemPageRaw = () => {
  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()
  const [side, setSide] = React.useState<'front' | 'back'>('front')

  const item: ExtendedBag | null = React.useMemo(
    () =>
      itemId ? allBags.all.find((bag) => bag.id === Number(itemId)) : null,
    [itemId],
  )

  const relatedItems = React.useMemo(
    () =>
      allBags.all
        .reverse()
        .filter(
          (bag) => bag.category_id === item?.category_id && bag.id !== item?.id,
        )
        .slice(0, 4),
    [item?.category_id, item?.id],
  )

  const { frontMainImage, backMainImage } = React.useMemo(() => {
    const getMainImagePath = (
      categoryId: number,
      itemId: number,
      sideCode: 'A' | 'B',
    ) => {
      const paddedCategoryId = categoryId.toString().padStart(4, '0')
      return `/gallery/images/${paddedCategoryId}/${itemId}${sideCode}.png`
    }

    return {
      frontMainImage: item ? getMainImagePath(item.category_id, item.id, 'A') : '',
      backMainImage: item ? getMainImagePath(item.category_id, item.id, 'B') : '',
    }
  }, [item])

  React.useEffect(() => {
    setSide('front')
  }, [item?.id])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const useTripleClick = (callback: () => void, delay = 1000) => {
    const countRef = React.useRef(0)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    return React.useCallback(() => {
      countRef.current += 1

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        countRef.current = 0
        timerRef.current = null
      }, delay)

      if (countRef.current >= 3) {
        countRef.current = 0
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        callback()
      }
    }, [callback, delay])
  }

  const handleAdminClick = useTripleClick(() => {
    if (item) {
      navigate(`/item/${item.id}/studio`)
    }
  }, 1000)

  if (!item) {
    return (
      <PageContainer>
        <ErrorMessage>
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
          <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        </ErrorMessage>
      </PageContainer>
    )
  }

  const bg = item.backgroundColor || '#e8e8e8'

  return (
    <PageContainer>
      <PageInner>
        <ItemLayout>
          <HeroSection bg={bg}>
            <BlobField>
              {BLOB_LAYOUT.map((b, i) => (
                <Blob
                  key={i}
                  size={b.size}
                  top={b.top}
                  left={b.left}
                  blur={b.blur}
                  opacity={b.opacity}
                  color={`color-mix(in srgb, ${bg} 70%, ${b.mix})`}
                />
              ))}
            </BlobField>

            <ImageStage>
              <BagImage
                src={side === 'front' ? frontMainImage : backMainImage}
                alt={`${item.id} - ${side}`}
              />
              <SideToggle>
                <ToggleButton
                  active={side === 'front'}
                  onClick={() => setSide('front')}
                >
                  Front
                </ToggleButton>
                <ToggleButton
                  active={side === 'back'}
                  onClick={() => setSide('back')}
                >
                  Back
                </ToggleButton>
              </SideToggle>
            </ImageStage>
          </HeroSection>

          <InfoSection>
            <InfoHeader>
              <ItemTitle>#{item.id}</ItemTitle>

              {item.category && (
                <CategoryTag onClick={() => navigate(`/category/${item.category_id}`)}>
                  {item.category}
                </CategoryTag>
              )}

              <PriceSection>
                {item.available ? (
                  <CurrentPrice onClick={handleAdminClick}>
                    {item.finalPrice}€
                  </CurrentPrice>
                ) : (
                  <AvailabilityBadge>Sold out</AvailabilityBadge>
                )}

                {item.discount > 0 && (
                  <>
                    <OriginalPrice>{item.price}€</OriginalPrice>
                    <DiscountBadge>{item.discount}% OFF</DiscountBadge>
                  </>
                )}
              </PriceSection>
            </InfoHeader>

            <Description>
              <DescriptionTitle>About this bag (AI Generated)</DescriptionTitle>
              <DescriptionText>
                {item.description || 'No description available.'}
              </DescriptionText>
            </Description>
          </InfoSection>
        </ItemLayout>

        {relatedItems.length > 0 && (
          <RelatedSection>
            <SectionTitle>More {item.category}</SectionTitle>
            <Cards bags={relatedItems} />
          </RelatedSection>
        )}
      </PageInner>
    </PageContainer>
  )
}

export const ItemPage = React.memo(ItemPageRaw)