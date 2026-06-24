import { allBags, ExtendedBag } from '../data/index'

// Track previously suggested items to avoid repetition
let suggestionHistory: number[] = []
let sessionCounter = 0

// Weight scores for different factors
const SCORES = {
  CATEGORY_VARIETY: 15,
  PRICE_RANGE: 10,
  FABRIC_UNIQUENESS: 8,
  DISCOUNT: 12,
  CATEGORY_POPULARITY: 5,
  SESSION_ROTATION: 20,
  RECENCY_PENALTY: -3,
  DESCRIPTION_LENGTH: 2,
  COLOR_VARIETY: 7,
}

// Get all unsold bags
const getUnsoldBags = (): ExtendedBag[] => {
  return allBags.all.filter((bag) => bag.available !== false)
}

// Extract colors from description for variety
const extractColors = (description: string): string[] => {
  const colorWords = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'pink',
    'orange',
    'black',
    'white',
    'brown',
    'gray',
    'gold',
    'silver',
    'teal',
    'navy',
    'indigo',
    'emerald',
    'crimson',
    'amber',
    'ochre',
    'lavender',
    'mint',
    'olive',
    'burgundy',
  ]
  return colorWords.filter((color) => description.toLowerCase().includes(color))
}

// Score a bag based on multiple factors
const scoreBag = (
  bag: ExtendedBag,
  usedCategories: Set<number>,
  usedPrices: Set<number>,
): number => {
  let score = 0

  // 1. Category variety - prefer categories not recently suggested
  if (!usedCategories.has(bag.category_id)) {
    score += SCORES.CATEGORY_VARIETY
  }

  // 2. Price variety - prefer different price points
  const priceRange = Math.floor(bag.finalPrice / 5) * 5 // Group by $5 increments
  if (!usedPrices.has(priceRange)) {
    score += SCORES.PRICE_RANGE
  }

  // 3. Discount bonus - items on discount are more interesting
  if (bag.discount > 0) {
    score += SCORES.DISCOUNT + bag.discount / 10
  }

  // 4. Fabric uniqueness - prefer varied materials
  const fabrics =
    bag.fabric?.split(/[,& ]/).filter((f) => f.trim().length > 0) || []
  if (fabrics.length > 1) {
    score += SCORES.FABRIC_UNIQUENESS
  }

  // 5. Category popularity - prefer categories with more items (more options)
  const categoryItems = allBags.all.filter(
    (b) => b.category_id === bag.category_id,
  )
  if (categoryItems.length > 5) {
    score += SCORES.CATEGORY_POPULARITY
  }

  // 6. Description richness - longer descriptions often have more detail
  const descLength = bag.description?.length || 0
  if (descLength > 150) {
    score += SCORES.DESCRIPTION_LENGTH
  }

  // 7. Color variety - prefer bags with multiple colors in description
  const colors = extractColors(bag.description || '')
  if (colors.length > 2) {
    score += SCORES.COLOR_VARIETY
  }

  // 8. Session rotation - occasionally force new items
  if (suggestionHistory.length > 5) {
    const recentSuggestions = suggestionHistory.slice(-5)
    if (!recentSuggestions.includes(bag.id)) {
      score += SCORES.SESSION_ROTATION
    } else {
      // Penalty for recently suggested items
      const recentIndex = recentSuggestions.lastIndexOf(bag.id)
      if (recentIndex !== -1) {
        score += SCORES.RECENCY_PENALTY * (5 - recentIndex)
      }
    }
  }

  return score
}

// Get category distribution to understand variety
// const getCategoryDistribution = (): Map<number, number> => {
//   const distribution = new Map<number, number>()
//   const unsold = getUnsoldBags()
//   unsold.forEach((bag) => {
//     const count = distribution.get(bag.category_id) || 0
//     distribution.set(bag.category_id, count + 1)
//   })
//   return distribution
// }

// Main recommendation function
export function suggestBag(): ExtendedBag | null {
  const unsoldBags = getUnsoldBags()

  if (unsoldBags.length === 0) {
    return null
  }

  // Track categories and prices used in recent suggestions
  const usedCategories = new Set<number>()
  const usedPrices = new Set<number>()

  // Get last 5 suggestions to create variety
  const recentSuggestions = suggestionHistory.slice(-5)
  recentSuggestions.forEach((id) => {
    const bag = unsoldBags.find((b) => b.id === id)
    if (bag) {
      usedCategories.add(bag.category_id)
      const priceRange = Math.floor(bag.finalPrice / 5) * 5
      usedPrices.add(priceRange)
    }
  })

  // Score each unsold bag
  const scoredBags = unsoldBags.map((bag) => ({
    bag,
    score: scoreBag(bag, usedCategories, usedPrices),
  }))

  // Sort by score descending
  scoredBags.sort((a, b) => b.score - a.score)

  // Get top 5 candidates
  const topCandidates = scoredBags.slice(0, Math.min(5, scoredBags.length))

  // Add some randomness - pick from top candidates with weighted probability
  const totalWeight = topCandidates.reduce((sum, item) => sum + item.score, 0)
  let random = Math.random() * totalWeight

  let selectedBag: ExtendedBag | null = null
  for (const candidate of topCandidates) {
    random -= candidate.score
    if (random <= 0) {
      selectedBag = candidate.bag
      break
    }
  }

  // Fallback to highest scored if random selection fails
  if (!selectedBag && topCandidates.length > 0) {
    selectedBag = topCandidates[0].bag
  }

  if (selectedBag) {
    // Add to history
    suggestionHistory.push(selectedBag.id)

    // Keep history manageable
    if (suggestionHistory.length > 50) {
      suggestionHistory = suggestionHistory.slice(-50)
    }

    sessionCounter++
  }

  return selectedBag
}

// Reset the suggestion history (useful for new sessions)
export function resetSuggestionHistory(): void {
  suggestionHistory = []
  sessionCounter = 0
}

// Get suggestion statistics
export function getSuggestionStats(): {
  totalSuggestions: number
  uniqueCategoriesSuggested: number
  mostSuggestedCategory: number | null
  averagePrice: number
} {
  const suggested = allBags.all.filter((bag) =>
    suggestionHistory.includes(bag.id),
  )
  const categoriesSuggested = new Set(suggested.map((b) => b.category_id))

  // Find most suggested category
  const categoryCount = new Map<number, number>()
  suggested.forEach((bag) => {
    const count = categoryCount.get(bag.category_id) || 0
    categoryCount.set(bag.category_id, count + 1)
  })

  let mostSuggested = null
  let maxCount = 0
  categoryCount.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count
      mostSuggested = category
    }
  })

  const avgPrice =
    suggested.length > 0
      ? suggested.reduce((sum, bag) => sum + bag.finalPrice, 0) /
        suggested.length
      : 0

  return {
    totalSuggestions: suggestionHistory.length,
    uniqueCategoriesSuggested: categoriesSuggested.size,
    mostSuggestedCategory: mostSuggested,
    averagePrice: avgPrice,
  }
}
