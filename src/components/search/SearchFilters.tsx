'use client'

import { MapPin, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { citiesData } from '@/data/cities'
import { CategoryButtons } from './CategoryButtons'

type SearchFiltersProps = {
  query: string
  selectedCity: string
  selectedCategory: string
  translations: {
    searchPlaceholder: string
    selectCity: string
    allCities: string
    filters: string
    clearFilters: string
  }
  onQueryChange: (query: string) => void
  onSearch: () => void
  onCityChange: (city: string) => void
  onCategoryChange: (category: string | null) => void
  onClearFilters: () => void
}

export function SearchFilters({
  query,
  selectedCity,
  selectedCategory,
  translations,
  onQueryChange,
  onSearch,
  onCityChange,
  onCategoryChange,
  onClearFilters
}: SearchFiltersProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  const handleCityChange = (value: string) => {
    onCityChange(value === '_all' ? '' : value)
  }

  const hasActiveFilters = !!(query || selectedCity || selectedCategory)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#b76e79]" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translations.searchPlaceholder}
            className="h-14 rounded-2xl border border-white/10 bg-white/5 pl-12 text-white backdrop-blur-xl placeholder:text-gray-500"
          />
          {query && (
            <button onClick={() => onQueryChange('')} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="relative sm:w-48">
          <MapPin className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-[#b76e79]" />
          <Select value={selectedCity || '_all'} onValueChange={handleCityChange}>
            <SelectTrigger size="xl" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 text-white backdrop-blur-xl">
              <SelectValue placeholder={translations.selectCity} />
            </SelectTrigger>
            <SelectContent className="border-[#8b1a4a]/20 bg-[#1a1a24]">
              <SelectItem value="_all" className="text-gray-300">{translations.allCities}</SelectItem>
              {citiesData.map((city) => (
                <SelectItem key={city.name} value={city.name} className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">
                  {city.name} ({city.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CategoryButtons
        selectedCategory={selectedCategory}
        hasActiveFilters={hasActiveFilters}
        translations={{ filters: translations.filters, clearFilters: translations.clearFilters }}
        onCategoryChange={onCategoryChange}
        onClearFilters={onClearFilters}
      />
    </div>
  )
}
