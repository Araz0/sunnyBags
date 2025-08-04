import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Cards, PageContainer } from '../components'
import { allData, categories } from "../data"
import styled from '@emotion/styled'

const CategoryHeader = styled.div`
  text-align: center;
  margin: 2rem 0;
`

const CategoryTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  padding-inline: 10px;
`

const CategoryDescription = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`

const BackButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0;
  transition: background-color 0.2s ease;

  &:hover {
    background: #555;
  }
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
`

const CategoryPageRaw = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const navigate = useNavigate()

  // Convert slug back to category name
  const categoryName = categorySlug?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  // Find the category data
  const category = categories.find(cat => 
    cat.name.toLowerCase() === categoryName?.toLowerCase()
  )

  // Filter bags by category
  const categoryBags = allData.filter(bag => 
    bag.category_id === category?.id
  )


  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!category || !categoryName) {
    return (
      <PageContainer>
        <ErrorMessage>
          <h2>Category not found</h2>
          <p>The category you're looking for doesn't exist.</p>
          <BackButton onClick={() => navigate('/')}>
            Back to Home
          </BackButton>
        </ErrorMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}>
        ← Back to Home
      </BackButton>
      
      <CategoryHeader>
        <CategoryTitle>{category.name}</CategoryTitle>
        <CategoryDescription>
          Discover our collection of {category.name.toLowerCase()} bags, 
          each crafted with care from recycled materials.
        </CategoryDescription>
      </CategoryHeader>

      {categoryBags.length > 0 ? (
        <Cards bags={categoryBags} />
      ) : (
        <ErrorMessage>
          <p>No bags found in this category yet.</p>
          <p>Check back soon for new additions!</p>
        </ErrorMessage>
      )}
    </PageContainer>
  )
}

export const CategoryPage = React.memo(CategoryPageRaw)
