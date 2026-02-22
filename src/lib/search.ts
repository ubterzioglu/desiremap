import type { Bordell } from '@/types'

const RATING_WEIGHT = 0.4
const REVIEW_COUNT_WEIGHT = 0.3
const VERIFICATION_WEIGHT = 0.15
const ACTIVITY_WEIGHT = 0.15
const MAX_EXPECTED_REVIEWS = 5000
const MAX_EXPECTED_VIEWS = 100000

export function calculateReviewScoreIndex(bordell: Bordell): number {
  const ratingScore = bordell.rating / 5
  const reviewScore = Math.log10(bordell.reviewCount + 1) / Math.log10(MAX_EXPECTED_REVIEWS)
  const verificationScore = bordell.verified ? 1 : 0
  const activityScore = Math.log10(bordell.views + 1) / Math.log10(MAX_EXPECTED_VIEWS)

  return (
    ratingScore * RATING_WEIGHT +
    reviewScore * REVIEW_COUNT_WEIGHT +
    verificationScore * VERIFICATION_WEIGHT +
    activityScore * ACTIVITY_WEIGHT
  )
}

function getSearchableFields(bordell: Bordell): string[] {
  return [
    bordell.name,
    bordell.city,
    bordell.location,
    bordell.type,
    ...bordell.services,
    bordell.description,
  ].filter((field): field is string => Boolean(field))
}

export function matchesSearchQuery(bordell: Bordell, query: string, city?: string): boolean {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) {
    return city ? bordell.city.toLowerCase() === city.toLowerCase() : true
  }

  const searchFields = getSearchableFields(bordell).map(field => field.toLowerCase())
  const matchesQuery = searchFields.some(field => field.includes(normalizedQuery))

  return city
    ? matchesQuery && bordell.city.toLowerCase() === city.toLowerCase()
    : matchesQuery
}

type BordellWithScore = { bordell: Bordell; score: number }

function compareByRanking(a: BordellWithScore, b: BordellWithScore): number {
  if (a.bordell.sponsored !== b.bordell.sponsored) {
    return a.bordell.sponsored ? -1 : 1
  }
  if (a.bordell.premium !== b.bordell.premium) {
    return a.bordell.premium ? -1 : 1
  }
  if (a.score !== b.score) {
    return b.score - a.score
  }
  return a.bordell.name.localeCompare(b.bordell.name)
}

export function sortBordellsByRanking(bordells: Bordell[]): Bordell[] {
  const withScores: BordellWithScore[] = bordells.map(bordell => ({
    bordell,
    score: calculateReviewScoreIndex(bordell),
  }))

  return withScores.sort(compareByRanking).map(item => item.bordell)
}

export function searchBordells(allBordells: Bordell[], query: string, city?: string): Bordell[] {
  const filtered = allBordells.filter(bordell => matchesSearchQuery(bordell, query, city))
  return sortBordellsByRanking(filtered)
}

export function getSearchSuggestions(allBordells: Bordell[], partialQuery: string, limit = 5): string[] {
  if (!partialQuery.trim()) return []
  
  const normalizedQuery = partialQuery.toLowerCase().trim()
  const suggestions = new Set<string>()

  for (const bordell of allBordells) {
    if (bordell.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(bordell.name)
    }
    if (bordell.city.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(bordell.city)
    }
    bordell.services.forEach(service => {
      if (service.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(service)
      }
    })

    if (suggestions.size >= limit * 2) break
  }

  return Array.from(suggestions).slice(0, limit)
}
