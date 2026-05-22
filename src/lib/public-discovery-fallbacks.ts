import type { PublicCity, PublicEstablishment, PublicServiceType } from '@/types'
import { categoriesData } from '@/data/categories'
import { citiesData } from '@/data/cities'
import { publicCityFromStatic } from '@/lib/public-cities'

export function getFallbackPublicCities(): PublicCity[] {
  return citiesData.map(publicCityFromStatic)
}

export function getFallbackPublicServiceTypes(): PublicServiceType[] {
  return categoriesData.map((category, index) => ({
    id: index + 1,
    slug: category.slug,
    name: category.name.de ?? category.slug,
  }))
}

export function getFallbackPublicEstablishments(params?: {
  city?: string
  type?: string
  q?: string
  limit?: number
  offset?: number
}): { items: PublicEstablishment[]; total: number } {
  const limit = Math.max(params?.limit ?? 0, 0)
  const offset = Math.max(params?.offset ?? 0, 0)

  return {
    items: [],
    total: 0,
    ...(limit > 0 || offset > 0 ? {} : {}),
  }
}
