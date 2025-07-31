import styled from '@emotion/styled'
import React from 'react'

const StyledArticle = styled.article<{ flipped: boolean }>`
  display: flex;
  flex-direction: ${({ flipped }) => (flipped ? 'row-reverse' : 'row')};
  background-color: #f5f5f5;
  color: #333;

  h2 {
    font-size: 1rem;
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin-left: auto;
  }

  .article-content {
    padding: 0rem 1rem;
  }
`

type ArticleProps = {
  title: string
  content: string
  imgSrc: string
  flipped?: boolean
}
export const ArticleRaw = ({
  title,
  content,
  imgSrc,
  flipped,
}: ArticleProps) => {
  return (
    <StyledArticle flipped={!!flipped}>
      <div className="article-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <img src={imgSrc} alt={title} />
    </StyledArticle>
  )
}

export const Article = React.memo(ArticleRaw)
