import React from 'react'
import {
  CategoryCard,
  HeroSection,
  PageContainer,
  Windows,
} from '../components'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data'

const StyledIntroWrapper = styled.p`
  text-align: center;
  line-height: 1.6;
  color: #121212;
  padding: 2rem;
  margin: 0;
  p {
    max-width: 800px;
    margin: 0 auto;
  }
`

const StyledCategoriesHeader = styled.h2`
  text-align: center;
  margin: 2rem 0;
  color: #121212;
`

const StyledFeaturedCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const ExploreCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 175px;
  height: 241px;
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
      <div style={{ backgroundColor: '#f4f5f6' }}>
        <HeroSection highlightedBag="/gallery/images/0008/85B.png" />
        {/* <Logo src="/logo.png" alt="SunnyBags Logo" /> */}
        <StyledIntroWrapper>
          <p>
            We're thrilled to showcase our unique collection of handmade bags
            crafted with love from recycled materials. Each bag tells a story of
            sustainability and creativity, transforming discarded materials into
            beautiful, functional accessories. Scroll down to explore our
            diverse range of eco-friendly bags that combine style with
            environmental consciousness.
          </p>
        </StyledIntroWrapper>
        <Windows
          headerText="Crafted with Love, Worn with Purpose"
          portrait={'/gallery/images/0008/85B.png'}
          squares={[
            '/gallery/images/0012/7A.png',
            '/gallery/images/0007/88A.png',
            '/gallery/images/0010/51A.png',
            '/gallery/images/0005/109A.png',
          ]}
          landscapes={[
            '/gallery/images/0004/115A.png',
            '/gallery/images/0003/126A.png',
          ]}
        />
        <StyledCategoriesHeader>Our Categories</StyledCategoriesHeader>
        <StyledFeaturedCards>
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              thumbnail={item.thumbnail}
              name={item.name}
              onClick={() => handleCategoryClick(item.id.toString())}
              price={item.price}
              soldOut={item.soldOut}
            />
          ))}
          <ExploreCard onClick={() => navigate('/explore')}>
            <ExploreText>
              Explore All
            </ExploreText>
          </ExploreCard>
        </StyledFeaturedCards>
        <br />
        <br />
      </div>
    </PageContainer>
  )
}

export const HomePage = React.memo(HomePageRaw)
