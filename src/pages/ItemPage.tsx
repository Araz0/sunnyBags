import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer, Cards } from '../components'
import { allData, categories } from '../data'
import styled from '@emotion/styled'

const BackButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0;
  transition: background-color 0.2s ease;

  &:hover {
    background: #555;
  }
`

const ItemContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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
  background-color: ${props => props.backgroundColor || 'transparent'};
  padding: 1rem;
  border-radius: 8px;
`

const MainImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    height: 400px;
  }
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
  background-color: lightgray;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
`

const ThumbnailLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0 0.5rem;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 1)
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

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
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
  const item = allData.find(bag => bag.id === Number(itemId))
  
  // Find category
  const category = categories.find(cat => cat.id === item?.category_id)
  
  // Get related items (same category, excluding current item)
  const relatedItems = allData.reverse().filter(bag =>
    bag.category_id === item?.category_id && bag.id !== item?.id
  ).slice(0, 4)

  // Generate image paths
  const getMainImagePath = (categoryId: number, itemId: number, side: 'A' | 'B') => {
    const paddedCategoryId = categoryId.toString().padStart(4, '0')
    return `/gallery/images/${paddedCategoryId}/${itemId}${side}.png`
  }

  const getThumbnailPath = (categoryId: number, itemId: number, side: 'A' | 'B') => {
    const paddedCategoryId = categoryId.toString().padStart(4, '0')
    return `/gallery/thumbnails/${paddedCategoryId}/${itemId}${side}.png`
  }

  const frontMainImage = item ? getMainImagePath(item.category_id, item.id, 'A') : ''
  const backMainImage = item ? getMainImagePath(item.category_id, item.id, 'B') : ''
  const frontThumbnail = item ? getThumbnailPath(item.category_id, item.id, 'A') : ''
  const backThumbnail = item ? getThumbnailPath(item.category_id, item.id, 'B') : ''

  React.useEffect(() => {
    if (item) {
      setSelectedImage(frontMainImage)
    }
  }, [item, frontMainImage])

  if (!item) {
    return (
      <PageContainer>
        <ItemContainer>
          <ErrorMessage>
            <h2>Item not found</h2>
            <p>The item you're looking for doesn't exist.</p>
            <BackButton onClick={() => navigate('/')}>
              Back to Home
            </BackButton>
          </ErrorMessage>
        </ItemContainer>
      </PageContainer>
    )
  }

  const finalPrice = item.price - (item.price * (item.discount / 100))
  return (
    <PageContainer>
      <ItemContainer>
        <BackButton onClick={() => navigate(-1)}>
          ← Back
        </BackButton>

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
            <ItemHeader>
              <ItemTitle>#{item.id}</ItemTitle>
              
              {category && (
                <CategoryTag onClick={() => navigate(`/category/${category.id}`)}>
                  {category.name}
                </CategoryTag>
              )}

              <PriceSection>
                <CurrentPrice>{finalPrice.toFixed(2)}€</CurrentPrice>
                {item.discount > 0 && (
                  <>
                    <OriginalPrice>{item.price.toFixed(2)}€</OriginalPrice>
                    <DiscountBadge>{item.discount}% OFF</DiscountBadge>
                  </>
                )}
              </PriceSection>
            </ItemHeader>

            <Description>
              <DescriptionTitle>About this bag</DescriptionTitle>
              <DescriptionText>
                {item.description || 'No description available.'}
              </DescriptionText>
            </Description>
          </InfoSection>
        </ItemHeader>

        {relatedItems.length > 0 && (
          <RelatedSection>
            <SectionTitle>More {category?.name}</SectionTitle>
            <Cards bags={relatedItems} />
          </RelatedSection>
        )}
      </ItemContainer>
    </PageContainer>
  )
}

export const ItemPage = React.memo(ItemPageRaw)