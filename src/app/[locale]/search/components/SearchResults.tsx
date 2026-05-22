'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListingCard } from '@/components/listings/ListingCard'
import { getVenuePath } from '@/lib/navigation'
import type { Bordell } from '@/types'

type SearchResultsProps = {
  sponsoredResults: Bordell[]
  regularResults: Bordell[]
  totalCount: number
  isLoading: boolean
  translations: {
    found: string
    sponsored: string
    premium: string
    noResults: string
    noResultsHint: string
    clearFilters: string
  }
  locale: string
  onClearFiltersAction: () => void
}

export function SearchResults({
  sponsoredResults,
  regularResults,
  totalCount,
  isLoading,
  translations,
  locale,
  onClearFiltersAction
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 py-10" data-testid="search-results-loading" aria-busy="true">
        <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {['search-skeleton-1', 'search-skeleton-2', 'search-skeleton-3'].map((key) => (
            <div key={key} className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      </div>
    )
  }

  if (totalCount === 0) {
    return (
      <div className="py-24 text-center">
        <Search className="mx-auto mb-6 size-16 text-[#a48a90]" />
        <p className="mb-3 text-xl font-semibold text-[#dae2fd]">{translations.noResults}</p>
        <p className="mb-8 text-[#a48a90]">{translations.noResultsHint}</p>
        <Button onClick={onClearFiltersAction} variant="outline" className="border border-[#8b1a4a] bg-transparent text-[#dae2fd] transition-colors hover:bg-[#8b1a4a]/10">
          {translations.clearFilters}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <p className="text-[#a48a90]" style={{fontSize: '16px', lineHeight: '24px'}}>{totalCount} {translations.found}</p>

      {sponsoredResults.length > 0 && (
        <div>
          <div className="mb-8 flex items-center gap-3">
            <Badge className="border-0 bg-[#d4af37] px-3 py-1 font-semibold text-[#0b1326]">
              {translations.sponsored}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sponsoredResults.map((item, index) => (
              <ListingCard
                key={item.id}
                bordell={item}
                detailHref={getVenuePath(locale, item.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {regularResults.length > 0 && (
        <div>
          {sponsoredResults.length > 0 && regularResults.some(b => b.premium) && (
            <div className="mb-8 flex items-center gap-3">
              <Badge className="border-0 bg-[#8b1a4a] px-3 py-1 font-semibold text-[#dae2fd]">
                {translations.premium}
              </Badge>
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularResults.map((item, index) => (
              <ListingCard
                key={item.id}
                bordell={item}
                detailHref={getVenuePath(locale, item.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
