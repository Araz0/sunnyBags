import styled from '@emotion/styled'
import React from 'react'

const StyledHeroSection = styled.section<{ imgSrc: string }>`
  background-image: url(${({ imgSrc }) => imgSrc});
  background-size: cover;
  background-position: center;
  height: 30vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    color: white;
    font-size: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  button {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    color: black;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }
  }
`

type HeroSectionProps = {
  src: string
}
export const HeroSectionRaw = ({ src }: HeroSectionProps) => {
  return (
    <StyledHeroSection imgSrc={src}>
      <h1>Hand Made Bags</h1>
      <button>Explore all</button>
    </StyledHeroSection>
  )
}

export const HeroSection = React.memo(HeroSectionRaw)
