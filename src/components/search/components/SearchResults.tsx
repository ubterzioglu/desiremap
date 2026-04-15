'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Bordell } from '@/types'

type SearchResultsProps = {
  sponsoredResults: Bordell[]
  regularResults: Bordell[]
  totalCount: number
  translations: {
    found: string
    sponsored: string
    premium: string
    noResults: string
    noResultsHint: string
    clearFilters: string
  }
  onBordellClick: (bordell: { id: string }) => void
  onClearFilters: () => void
}

export function SearchResults({
  sponsoredResults,
  regularResults,
  totalCount,
  translations,
  onBordellClick,
  onClearFilters
}: SearchResultsProps) {
  if (totalCount === 0) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-xl mb-2">{translations.noResults}</p>
        <p className="text-gray-500">{translations.noResultsHint}</p>
        <Button onClick={onClearFilters} variant="outline" className="mt-6 border-white/10 text-white hover:bg-white/5">
          {translations.clearFilters}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-400 mb-6">{totalCount} {translations.found}</p>

      {sponsoredResults.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0">
              {translations.sponsored}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsoredResults.map((item, index) => (
              <ListingCard key={item.id} bordell={item} index={index} onDetailClick={onBordellClick} />
            ))}
          </div>
        </div>
      )}

      {regularResults.length > 0 && (
        <div>
          {sponsoredResults.length > 0 && regularResults.some(b => b.premium) && (
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0">
                {translations.premium}
              </Badge>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResults.map((item, index) => (
              <ListingCard key={item.id} bordell={item} index={index} onDetailClick={onBordellClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
