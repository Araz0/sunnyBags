import React from 'react'
import { Cards, PageContainer } from '../components'
import { allData } from "../data";

const ExplorePageRaw = () => {
  return (
    <PageContainer>
      <Cards bags={allData} />
    </PageContainer>
  )
}

export const ExplorePage = React.memo(ExplorePageRaw)
