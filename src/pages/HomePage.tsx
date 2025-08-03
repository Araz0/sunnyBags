import React from 'react'
import { CategoryCard, HeroSection, PageContainer } from '../components'
import { getFeaturedEach } from '../utils/getFeaturedEach'
import styled from '@emotion/styled'
import { categories } from '../data'

const featuredItems = getFeaturedEach();

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

const HomePageRaw = () => {


  return (
    <PageContainer>
      <HeroSection src="/hero.jpg" />
      <StyledIntroText>
        We're thrilled to showcase our unique collection of handmade bags crafted with love from recycled materials. 
        Each bag tells a story of sustainability and creativity, transforming discarded materials into beautiful, 
        functional accessories. Scroll down to explore our diverse range of eco-friendly bags that combine style 
        with environmental consciousness.
      </StyledIntroText>
      <StyledFeaturedCards>
        {categories.map((item) => (
          <CategoryCard
            key={item.id}
            thumbnail={item.thumbnail}
            // discount={item.discount}
            name={item.name}
            onClick={() => alert(`Clicked on ${item.name}`)}
          />
        ))}
      </StyledFeaturedCards>
    </PageContainer>
  )
}

export const HomePage = React.memo(HomePageRaw)