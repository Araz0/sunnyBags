import React from 'react'
import { Cards, PageContainer } from '../components'
import { bags } from '../dumpData'

const ExplorePageRaw = () => {
  return (
    <PageContainer>
      <Cards bags={bags} />
    </PageContainer>
  )
}

export const ExplorePage = React.memo(ExplorePageRaw)
