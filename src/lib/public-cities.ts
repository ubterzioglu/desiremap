import { citiesData, type CityData } from '@/data/cities'
import type { PublicCity } from '@/types'

export function publicCityFromStatic(city: CityData, index: number): PublicCity {
  return {
    id: index + 1,
    cityId: index + 1,
    slug: city.slug,
    name: city.name,
    venueCount: city.count,
    image: city.image,
    latitude: city.lat,
    longitude: city.lng,
    subtitle: city.subtitles,
    description: city.descriptions,
    seoTitle: {},
    seoDescription: city.descriptions,
    isActive: true,
    sortOrder: (index + 1) * 10,
  }
}

export function getFallbackPublicStadtCities(): PublicCity[] {
  return citiesData.map(publicCityFromStatic)
}

export function getFallbackPublicStadtCity(slug: string): PublicCity | null {
  const normalized = normalizeCitySlug(slug)
  const canonicalSlug = normalized === 'munich' ? 'muenchen' : normalized
  const city = citiesData.find((item) => item.slug === canonicalSlug)

  return city ? publicCityFromStatic(city, citiesData.indexOf(city)) : null
}

export function normalizeCitySlug(slug: string) {
  return slug.trim().toLowerCase()
}

export function selectLocalizedCityText(
  values: Record<string, string | null> | null | undefined,
  locale: string,
  fallback = '',
) {
  if (!values) {
    return fallback
  }

  return values[locale] ?? values.de ?? values.en ?? fallback
}

export function getPublicCityImage(city: PublicCity) {
  return city.image ?? null
}

export function getPublicCityVenueCount(city: PublicCity) {
  return city.venueCount ?? 0
}
