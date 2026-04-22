import type { PublicCity, PublicServiceType } from '@/types'
import { categoriesData } from '@/data/categories'
import { citiesData } from '@/data/cities'

export function getFallbackPublicCities(): PublicCity[] {
  return citiesData.map((city, index) => ({
    id: index + 1,
    slug: city.slug,
    name: city.name,
  }))
}

export function getFallbackPublicServiceTypes(): PublicServiceType[] {
  return categoriesData.map((category, index) => ({
    id: index + 1,
    slug: category.slug,
    name: category.name.de,
  }))
}
