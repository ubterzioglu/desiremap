import type { PublicCity, PublicEstablishment, PublicServiceType } from '@/types'
import { categoriesData } from '@/data/categories'
import { citiesData } from '@/data/cities'
import { bordells } from '@/data/mock-data'
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
  const query = params?.q?.trim().toLocaleLowerCase() || ''

  const filtered = bordells
    .filter((bordell) => {
      if (params?.city && bordell.city !== params.city) {
        return false
      }

      if (params?.type && bordell.type !== params.type) {
        return false
      }

      if (!query) {
        return true
      }

      const haystack = [
        bordell.name,
        bordell.city,
        bordell.description,
        ...bordell.services,
      ]
        .join(' ')
        .toLocaleLowerCase()

      return haystack.includes(query)
    })
    .map((bordell): PublicEstablishment => ({
      slug: bordell.id,
      name: bordell.name,
      city: bordell.city,
      type: bordell.type,
      description: bordell.description,
      detailContent: null,
      lat: null,
      lng: null,
      phone: bordell.phone,
      ...(bordell.email === undefined ? {} : { email: bordell.email }),
      ...(bordell.website === undefined ? {} : { website: bordell.website }),
      images: bordell.coverImage ? [bordell.coverImage] : [],
      rating: bordell.rating,
      reviewCount: bordell.reviewCount,
      priceMin: bordell.minPrice,
      priceMax: bordell.maxPrice ?? null,
      tags: bordell.services,
      openingHours: {},
      verified: bordell.verified,
      isActive: bordell.status === 'active',
    }))

  const offset = Math.max(params?.offset ?? 0, 0)
  const limit = params?.limit ?? filtered.length

  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
  }
}
