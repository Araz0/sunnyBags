import React from 'react'
import { Article, HeroSection, PageContainer } from '../components'
import { getFeaturedEach } from '../utils/getFeaturedEach'

const HomePageRaw = () => {
  const featuredItems = getFeaturedEach();

  return (
    <PageContainer>
      <HeroSection src="/hero.jpg" />
      <section>
        {featuredItems.map(item => (
          <Article
            key={item.id}
            title={'#'+item.id.toString().padStart(4, '0')}
            content={item.description}
            imgSrc={`/gallery/thumbnails/${item.category_id.toString().padStart(4, '0')}/${item.id}A.png`}
          />
        ))}
      </section>
    </PageContainer>
  )
}

export const HomePage = React.memo(HomePageRaw)