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
  onBordellClickAction: (bordell: { id: string }) => void
  onClearFiltersAction: () => void
}

export function SearchResults({
  sponsoredResults,
  regularResults,
  totalCount,
  translations,
  onBordellClickAction,
  onClearFiltersAction
}: SearchResultsProps) {
  if (totalCount === 0) {
    return (
      <div className="py-20 text-center">
        <Search className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <p className="mb-2 text-xl text-gray-400">{translations.noResults}</p>
        <p className="text-gray-500">{translations.noResultsHint}</p>
        <Button onClick={onClearFiltersAction} variant="outline" className="mt-6 border-white/10 text-white hover:bg-white/5">
          {translations.clearFilters}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-gray-400">{totalCount} {translations.found}</p>

      {sponsoredResults.length > 0 && (
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Badge className="border-0 bg-linear-to-r from-amber-500 to-orange-500 text-white">
              {translations.sponsored}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sponsoredResults.map((item, index) => (
              <ListingCard key={item.id} bordell={item} index={index} onDetailClickAction={onBordellClickAction} />
            ))}
          </div>
        </div>
      )}

      {regularResults.length > 0 && (
        <div>
          {sponsoredResults.length > 0 && regularResults.some(b => b.premium) && (
            <div className="mb-6 flex items-center gap-2">
              <Badge className="border-0 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white">
                {translations.premium}
              </Badge>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularResults.map((item, index) => (
              <ListingCard key={item.id} bordell={item} index={index} onDetailClickAction={onBordellClickAction} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
