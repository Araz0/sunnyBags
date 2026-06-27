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


const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    padding: 0;
  }
`

const ImageSection = styled.div<{ backgroundColor?: string }>`
  flex: 1;
  max-width: 500px;
  background-color: ${(props) => props.backgroundColor || 'transparent'};
  padding: 1rem;
  border-radius: 8px;
`

const MainImage = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  justify-items: center;
`

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100px;
`

const ThumbnailImage = styled.img`
  width: 100%;
  background-color: #5e5e5e62;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
`

const ThumbnailLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0 0.5rem;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
`

const InfoSection = styled.div`
  flex: 1;
`

const ItemTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
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
  box-shadow: 0 6px 18px rgba(204, 14, 38, 0.2);
`


const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-wrap: wrap;
`

const CurrentPrice = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
`

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  text-decoration: line-through;
`

const DiscountBadge = styled.span`
  background: #cc0e26;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
`

const Description = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0;
  }
`

const DescriptionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`

const DescriptionText = styled.p`
  line-height: 1.5;
  font-size: 0.95rem;
`

const CategoryTag = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #333;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }
`

const RelatedSection = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
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

const ItemPageRaw = () => {
  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = React.useState<string>('')

  // Find the item
  const item: ExtendedBag | null = React.useMemo(
    () =>
      itemId ? allBags.all.find((bag) => bag.id === Number(itemId)) : null,
    [itemId],
  )

  // Get related items (same category, excluding current item)
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

  // Generate image paths
  const { frontMainImage, backMainImage, frontThumbnail, backThumbnail } =
    React.useMemo(() => {
      const getMainImagePath = (
        categoryId: number,
        itemId: number,
        side: 'A' | 'B',
      ) => {
        const paddedCategoryId = categoryId.toString().padStart(4, '0')
        return `/gallery/images/${paddedCategoryId}/${itemId}${side}.png`
      }

      const getThumbnailPath = (
        categoryId: number,
        itemId: number,
        side: 'A' | 'B',
      ) => {
        const paddedCategoryId = categoryId.toString().padStart(4, '0')
        return `/gallery/thumbnails/${paddedCategoryId}/${itemId}${side}.png`
      }

      return {
        frontMainImage: item
          ? getMainImagePath(item.category_id, item.id, 'A')
          : '',
        backMainImage: item
          ? getMainImagePath(item.category_id, item.id, 'B')
          : '',
        frontThumbnail: item
          ? getThumbnailPath(item.category_id, item.id, 'A')
          : '',
        backThumbnail: item
          ? getThumbnailPath(item.category_id, item.id, 'B')
          : '',
      }
    }, [item])

  React.useEffect(() => {
    if (item && frontMainImage) {
      setSelectedImage(frontMainImage)
    }
  }, [item, frontMainImage])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

// Custom hook for triple click detection
const useTripleClick = (callback: ()=> void, delay = 1000) => {
  const countRef = React.useRef(0);
  const timerRef = React.useRef(null);

  return React.useCallback(() => {
    countRef.current += 1;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
      timerRef.current = null;
    }, delay);
    
    if (countRef.current >= 3) {
      countRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      callback();
    }
  }, [callback, delay]);
};

// Usage in your component
const handleAdminClick = useTripleClick(() => {
  if (item) {
    navigate(`/item/${item.id}/studio`);
  }
}, 1000);

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

  return (
    <PageContainer>
        <BackButton onClick={() => navigate(-1)}>← {item.category}</BackButton>

        <ItemHeader>
          <ImageSection backgroundColor={item.backgroundColor}>
            <MainImage
              src={selectedImage || frontMainImage}
              alt={item.id.toString() + ' - Main Image'}
            />
            <ImageGrid>
              <ThumbnailContainer>
                <ThumbnailImage
                  src={frontThumbnail}
                  alt={`${item.id} - Front`}
                  onClick={() => setSelectedImage(frontMainImage)}
                />
                <ThumbnailLabel>Front</ThumbnailLabel>
              </ThumbnailContainer>

              <ThumbnailContainer>
                <ThumbnailImage
                  src={backThumbnail}
                  alt={`${item.id} - Back`}
                  onClick={() => setSelectedImage(backMainImage)}
                />
                <ThumbnailLabel>Back</ThumbnailLabel>
              </ThumbnailContainer>
            </ImageGrid>
          </ImageSection>

          <InfoSection>
            {/* {!isAvailable && <AvailabilityBanner>Sold out</AvailabilityBanner>} */}
            <ItemHeader>
              <ItemTitle>#{item.id}</ItemTitle>

              {item.category && (
                <CategoryTag
                  onClick={() => navigate(`/category/${item.category_id}`)}
                >
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
            </ItemHeader>

            <Description>
              <DescriptionTitle>About this bag (AI Generated)</DescriptionTitle>
              <DescriptionText>
                {item.description || 'No description available.'}
              </DescriptionText>
            </Description>
          </InfoSection>
        </ItemHeader>

        {relatedItems.length > 0 && (
          <RelatedSection>
            <SectionTitle>More {item.category}</SectionTitle>
            <Cards bags={relatedItems} />
          </RelatedSection>
        )}
    </PageContainer>
  )
}

export const ItemPage = React.memo(ItemPageRaw)
