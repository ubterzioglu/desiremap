import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { bordells } from '@/data/mock-data'
import { getSearchPath, getVenuePath } from '@/lib/navigation'
import { searchBordells } from '@/lib/search'

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

  const searchResults = useMemo(() => {
    let results = searchBordells(bordells, initialQuery, initialCity || undefined)
    if (initialCategory) {
      results = results.filter(item => item.type === initialCategory)
    }
    return results
  }, [initialQuery, initialCity, initialCategory])

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
    regularResults
  }
}
