import styled from '@emotion/styled'
import React from 'react'

const StyledHeroSection = styled.section<{ imgSrc: string }>`
  background-image: url(${({ imgSrc }) => imgSrc});
  background-size: cover;
  background-position: center;
  height: 30vh;
  width: 100%;
  position: relative;

  h1 {
    color: white;
    font-size: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

type HeroSectionProps = {
  src: string
}
export const HeroSectionRaw = ({ src }: HeroSectionProps) => {
  return (
    <StyledHeroSection imgSrc={src}>
      <h1>Hand Made Bags</h1>
    </StyledHeroSection>
  )
}

export const HeroSection = React.memo(HeroSectionRaw)
