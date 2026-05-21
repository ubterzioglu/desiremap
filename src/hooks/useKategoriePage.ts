'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePublicEstablishments } from '@/hooks/useQueries'
import { getCategoryPath, getVenuePath } from '@/lib/navigation'
import type { PublicEstablishment } from '@/types'
import type { Bordell, BordellType } from '@/types'

function toListingCardBordell(e: PublicEstablishment): Bordell {
  const coverImage = e.images[0]
  return {
    id: e.slug,
    name: e.name,
    type: e.type as BordellType,
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange:
      e.priceMin != null
        ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}`
        : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    ...(e.priceMax == null ? {} : { maxPrice: e.priceMax }),
    ladiesCount: 0,
    services: e.tags,
    isOpen: e.isActive ?? false,
    openHours: '',
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: '',
    description: e.description ?? '',
    ...(coverImage === undefined ? {} : { coverImage }),
    images: e.images,
    createdAt: '',
    updatedAt: '',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }
}

export function useKategoriePage(
  locale: string,
  slug: string,
  initialQuery: string,
  initialCity: string,
) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [selectedCity, setSelectedCity] = useState(initialCity)

  const updateUrl = useCallback(
    (newQuery: string, newCity: string) => {
      const base = getCategoryPath(locale, slug)
      const params = new URLSearchParams()
      if (newQuery) params.set('q', newQuery)
      if (newCity) params.set('city', newCity)
      const qs = params.toString()
      router.push(qs ? `${base}?${qs}` : base, { scroll: false })
    },
    [locale, slug, router],
  )

  const handleSearch = useCallback(() => {
    updateUrl(query, selectedCity)
  }, [query, selectedCity, updateUrl])

  const handleCityChange = useCallback(
    (city: string) => {
      setSelectedCity(city)
      updateUrl(query, city)
    },
    [query, updateUrl],
  )

  const clearFilters = useCallback(() => {
    setQuery('')
    setSelectedCity('')
    router.push(getCategoryPath(locale, slug), { scroll: false })
  }, [locale, slug, router])

  const handleVenueClick = useCallback(
    (venue: { id: string }) => {
      router.push(getVenuePath(locale, venue.id))
    },
    [locale, router],
  )

  const { data: result, isLoading } = usePublicEstablishments({
    type: slug,
    ...(initialQuery ? { q: initialQuery } : {}),
    ...(initialCity ? { city: initialCity } : {}),
    limit: 50,
  })

  const allResults = (result?.items ?? []).map(toListingCardBordell)

  return {
    query,
    selectedCity,
    setQuery,
    handleSearch,
    handleCityChange,
    clearFilters,
    handleVenueClick,
    sponsoredResults: allResults.filter((b) => b.sponsored),
    regularResults: allResults.filter((b) => !b.sponsored),
    totalCount: allResults.length,
    isLoading,
  }
}
