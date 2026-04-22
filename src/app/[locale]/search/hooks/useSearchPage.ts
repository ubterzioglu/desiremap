import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSearchPath, getVenuePath } from '@/lib/navigation'
import { usePublicEstablishments } from '@/hooks/useQueries'
import type { Bordell, BordellType, PublicEstablishment } from '@/types'

function toSearchBordell(e: PublicEstablishment): Bordell {
  return {
    id: e.slug,
    name: e.name,
    type: e.type as BordellType,
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange: e.priceMin != null ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}` : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    maxPrice: e.priceMax ?? undefined,
    ladiesCount: 0,
    services: e.tags,
    isOpen: e.isActive ?? false,
    openHours: '',
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: '',
    description: e.description ?? '',
    coverImage: e.images?.[0],
    images: e.images,
    createdAt: '',
    updatedAt: '',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }
}

export function useSearchPage(locale: string, initialQuery: string, initialCity: string, initialCategory: string) {
  const router = useRouter()

  const [query, setQuery] = useState(initialQuery)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const updateUrl = useCallback((newQuery: string, newCity: string, newCategory: string) => {
    router.push(getSearchPath(locale, {
      q: newQuery || undefined,
      city: newCity || undefined,
      category: newCategory || undefined
    }), { scroll: false })
  }, [locale, router])

  const handleSearch = useCallback(() => {
    updateUrl(query, selectedCity, selectedCategory)
  }, [query, selectedCity, selectedCategory, updateUrl])

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
    updateUrl(query, city, selectedCategory)
  }, [query, selectedCategory, updateUrl])

  const handleCategoryChange = useCallback((category: string | null) => {
    const cat = category || ''
    setSelectedCategory(cat)
    updateUrl(query, selectedCity, cat)
  }, [query, selectedCity, updateUrl])

  const clearFilters = useCallback(() => {
    setQuery('')
    setSelectedCity('')
    setSelectedCategory('')
    router.push(getSearchPath(locale))
  }, [locale, router])

  const handleBordellClick = useCallback((bordell: { id: string }) => {
    router.push(getVenuePath(locale, bordell.id))
  }, [locale, router])

  const { data: result, isLoading } = usePublicEstablishments({
    q: initialQuery || undefined,
    city: initialCity || undefined,
    type: initialCategory || undefined,
    limit: 50,
  })

  const searchResults = useMemo(() => (result?.items ?? []).map(toSearchBordell), [result])
  const sponsoredResults = useMemo(() => searchResults.filter(b => b.sponsored), [searchResults])
  const regularResults = useMemo(() => searchResults.filter(b => !b.sponsored), [searchResults])

  return {
    query,
    selectedCity,
    selectedCategory,
    setQuery,
    handleSearch,
    handleCityChange,
    handleCategoryChange,
    clearFilters,
    handleBordellClick,
    searchResults,
    sponsoredResults,
    regularResults,
    isLoading,
  }
}
