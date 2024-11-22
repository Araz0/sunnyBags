import styled from '@emotion/styled'
import { memo } from 'react'
import { Card, PageContainer } from '../components'
import { bags } from '../dumpData'

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px;
`

const ExplorePageRaw = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        {bags.map((bag) => (
          <Card
            key={bag.id}
            thumbnail={bag.frontPhoto}
            price={bag.price}
            discount={bag.discountPercent}
            name={bag.name}
            category={bag.category}
          />
        ))}
      </ContentWrapper>
    </PageContainer>
  )
}

export const ExplorePage = memo(ExplorePageRaw)
