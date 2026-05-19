'use client'

import { MapPin, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePublicCities } from '@/hooks/useQueries'
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
  const { data: cities = [] } = usePublicCities()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  const handleCityChange = (value: string) => {
    onCityChange(value === '_all' ? '' : value)
  }

  const hasActiveFilters = !!(query || selectedCity || selectedCategory)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-3xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#d4af37]" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translations.searchPlaceholder}
            className="h-14 rounded-lg border border-white/15 bg-white/10 pl-12 text-[#dae2fd] backdrop-blur-[20px] transition-colors placeholder:text-[#a48a90] focus:border-[#8b1a4a] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a48a90] transition-colors hover:text-[#dae2fd]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="relative sm:w-48">
          <MapPin className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-[#d4af37]" />
          <Select value={selectedCity || '_all'} onValueChange={handleCityChange}>
            <SelectTrigger
              size="xl"
              className="w-full rounded-lg border border-white/15 bg-white/10 pl-12 text-[#dae2fd] backdrop-blur-[20px] transition-colors focus:border-[#8b1a4a]"
            >
              <SelectValue placeholder={translations.selectCity} />
            </SelectTrigger>
            <SelectContent className="border-[#2d3449] bg-[#171f33] shadow-xl">
              <SelectItem value="_all" className="text-[#dae2fd]">
                {translations.allCities}
              </SelectItem>
              {cities.map((city) => (
                <SelectItem
                  key={city.slug}
                  value={city.name}
                  className="text-[#dae2fd] focus:bg-[#8b1a4a]/30 focus:text-[#dae2fd]"
                >
                  {city.name}
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
