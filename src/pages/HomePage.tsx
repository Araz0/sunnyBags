import { memo } from 'react'
import { Article, HeroSection, PageContainer } from '../components'

const HomePageRaw = () => {
  return (
    <PageContainer>
      <HeroSection src="/hero.jpg" />
      <section>
        <Article
          title="Post Title 1"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing"
          imgSrc="/front_150.jpg"
        />
        <Article
          title="Post Title 2"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing"
          imgSrc="/front_150.jpg"
          flipped
        />
      </section>
      <randomBags />
    </PageContainer>
  )
}

export const HomePage = memo(HomePageRaw)
