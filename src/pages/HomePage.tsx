import React from 'react'
import { CategoryCard, PageContainer } from '../components'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data'

const StyledIntroText = styled.p`
  text-align: center;
  line-height: 1.6;
  color: lightgray;
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
`

const StyledFeaturedCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const Logo = styled.img`
  display: block;
  margin: 2rem auto 3rem;
  height: 120px;
  width: auto;
  background: lightgray;
  border-radius: 2px;

  @media (min-width: 768px) {
    height: 160px;
    margin: 3rem auto 4rem;
  }
`

const ExploreCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 175px;
  height: 221px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`

const ExploreText = styled.span`
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`

const HomePageRaw = () => {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryName: string) => {
    // Convert category name to URL-friendly slug
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
    navigate(`/category/${categorySlug}`)
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageContainer>
      <Logo src="/logo.png" alt="SunnyBags Logo" />
      <StyledIntroText>
        We're thrilled to showcase our unique collection of handmade bags
        crafted with love from recycled materials. Each bag tells a story of
        sustainability and creativity, transforming discarded materials into
        beautiful, functional accessories. Scroll down to explore our diverse
        range of eco-friendly bags that combine style with environmental
        consciousness.
      </StyledIntroText>
      <StyledFeaturedCards>
        {categories.map((item) => (
          <CategoryCard
            key={item.id}
            thumbnail={item.thumbnail}
            // discount={item.discount}
            name={item.name}
            onClick={() => handleCategoryClick(item.name)}
            price={item.price}
          />
        ))}
        <ExploreCard onClick={() => navigate('/explore')}>
          <ExploreText>
            Explore All
            <br />
            Bags
          </ExploreText>
        </ExploreCard>
      </StyledFeaturedCards>
    </PageContainer>
  )
}

export const HomePage = React.memo(HomePageRaw)
