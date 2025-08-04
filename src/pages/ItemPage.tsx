import React from 'react'
import { Cards, PageContainer } from '../components'
import { allData } from "../data";

const ItemPageRaw = () => {
  return (
    <PageContainer>
      <Cards bags={allData} />
    </PageContainer>
  )
}

export const ItemPage = React.memo(ItemPageRaw)
