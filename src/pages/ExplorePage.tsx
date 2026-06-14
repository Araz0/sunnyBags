import React from 'react'
import { Cards, PageContainer } from '../components'
import { allBags } from '../data'

const ExplorePageRaw = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageContainer>
      <Cards bags={allBags.all} />
    </PageContainer>
  )
}

export const ExplorePage = React.memo(ExplorePageRaw)
