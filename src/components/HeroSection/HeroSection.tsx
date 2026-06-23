import styled from '@emotion/styled'
import React from 'react'

const HeroWrapper = styled.section`
  background-color: #f4f5f6;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  margin-bottom: 20px;
  overflow-x: hidden; /* Fixes potential horizontal scrollbar */
  box-sizing: border-box;
  color: black;
`

const HeroContainer = styled.div`
  max-width: 1440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
  }
`

const LeftContent = styled.div`
  flex: 1;
  text-align: center;
  width: 100%;

  @media (min-width: 768px) {
    text-align: left;
  }

  h1 {
    color: #1a1a1a;
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 12px 0;
    line-height: 1.1;

    @media (min-width: 1024px) {
      font-size: 4rem;
    }
  }

  p {
    color: #4a4a4a;
    font-size: 1.2rem;
    margin: 0 0 8px 0;
  }
`

const CenterContent = styled.div`
  flex: 1.2; /* Allows more space for the bag */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    width: 90%; /* Responsive sizing */
    max-width: 650px; /* Made the bag larger as requested */
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.25));
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
          <p>Upcycled Bags by a Mom</p>
          <h3>Made to Last, Made with Love</h3>
        </LeftContent>

        <CenterContent>
          <img src={highlightedBag} alt="Featured Artisanal Bag" />
        </CenterContent>
      </HeroContainer>
    </HeroWrapper>
  )
}

export const HeroSection = React.memo(HeroSectionRaw)