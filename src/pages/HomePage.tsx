import React from 'react'
import { Article, HeroSection, PageContainer, Cards } from '../components'
import { bags } from '../dumpData'

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
      <Cards bags={bags.slice(0, 2)} />
    </PageContainer>
  )
}

export const HomePage = React.memo(HomePageRaw)
