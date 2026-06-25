import React from 'react'
import styled from '@emotion/styled'

const StyledWindowsSection = styled.section`
  background-color: #f4f5f6;
  padding-block: 2rem;
  h2 {
    color: #121212;
    text-align: center;
    margin-bottom: 1rem;
  }
`

const StyledWindowsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  max-width: 920px;
  margin-inline: auto;
  
  > * {
    width: min(18vw, 175px);
    flex-shrink: 1;
  }
  
  div {
    img {
      width: min(18vw, 175px);
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  img {
    display: block;
    width: 100%;
    border-radius: 15px;
    object-fit: cover;
    background-color: #f0f0f0; /* fallback background */
  }
  
  @media (max-width: 768px) {
    img {
      border-radius: 5px;
    }
  }

  .square {
    aspect-ratio: 1;
  }

  .landscape {
    aspect-ratio: 3 / 2;
  }

  .portrait {
    aspect-ratio: 2 / 4;
  }

  /* nth-child selectors for direct img children only */
  > img:nth-child(1) {
    background-color: #ffb362; /* MistyRose - for first square */
  }

  
  /* nth-child selectors for images inside div containers */
  > div:nth-child(2) img:nth-child(1) {
    background-color: #fcdac3; /* LavenderBlush - for first landscape */
  }

  > div:nth-child(2) img:nth-child(2) {
    background-color: #50b8c0; /* Beige - for second square */
  }

  > img:nth-child(3) {
    background-color: #ffd95c; /* Lavender - for portrait */
  }

  > div:nth-child(4) img:nth-child(1) {
    background-color: #ff833c; /* FloralWhite - for third square */
  }

  > div:nth-child(4) img:nth-child(2) {
    background-color: #74bbf5; /* OldLace - for second landscape */
  }

  > img:nth-child(5) {
    background-color: #6fb49a; /* HoneyDew - for last square */
  }

`


export type WindowsRawProps = {
  headerText: string,
  portrait: string,
  squares: string[], // 4 of them
  landscapes: string[], // 2 of them
}
export const WindowsRawRaw = ({ headerText, portrait, squares, landscapes }: WindowsRawProps) => {
  return (
    <StyledWindowsSection>
      <h2>{headerText}</h2>
      <StyledWindowsWrapper>
        <img className="square" src={squares[0]} alt={`Square left`} />
        <div>
          <img className="landscape" src={landscapes[0]} alt={`Landscape left`} />
          <img className="square" src={squares[1]} alt={`Square middle left`} />
        </div>
        <img className="portrait" src={portrait} alt="Portrait" />
        <div>
          <img className="square" src={squares[2]} alt={`Square middle right`} />
          <img className="landscape" src={landscapes[1]} alt={`Landscape right`} />
        </div>
        <img className="square" src={squares[3]} alt={`Square right`} />
      </StyledWindowsWrapper>
    </StyledWindowsSection>
  )
}

export const Windows = React.memo(WindowsRawRaw)
