import styled from '@emotion/styled'
import React from 'react'

const HeroWrapper = styled.section`
  background-color: #f4f5f6;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 20px;
  overflow-x: hidden;
  box-sizing: border-box;
`

const HeroContainer = styled.div`
  max-width: 1440px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "text"
    "image";
  gap: 24px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1.2fr;
    grid-template-rows: 1fr;
    grid-template-areas: "text image";
    gap: 40px;
    align-items: center;
    min-height: 420px;
  }
`

const LeftContent = styled.div`
  grid-area: text;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    text-align: left;
  }

  h1 {
    color: #1a1a1a;
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 800;
    margin: 0 0 10px 0;
    line-height: 1.1;
  }

  p {
    color: #4a4a4a;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    margin: 0;
  }
`

const CenterContent = styled.div`
  grid-area: image;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    /* On mobile, cap height so it doesn't dominate the screen */
    max-height: 52vw;
    max-width: 340px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0px 16px 24px rgba(0, 0, 0, 0.2));

    @media (min-width: 768px) {
      max-height: none;
      max-width: 650px;
      width: 90%;
      filter: drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.25));
    }
  }
`

type HeroSectionProps = {
  highlightedBag: string
}

export const HeroSectionRaw = ({ highlightedBag }: HeroSectionProps) => {
  return (
    <HeroWrapper>
      <HeroContainer>
        <LeftContent>
          <h1>SunnyBags☀️</h1>
          <p>Upcycled Bags, Mom made</p>
        </LeftContent>

        <CenterContent>
          <img src={highlightedBag} alt="Featured Artisanal Bag" />
        </CenterContent>
      </HeroContainer>
    </HeroWrapper>
  )
}

export const HeroSection = React.memo(HeroSectionRaw)