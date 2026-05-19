'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePublicServiceTypes } from '@/hooks/useQueries'

type CategoryButtonsProps = {
  selectedCategory: string
  hasActiveFilters: boolean
  translations: { filters: string; clearFilters: string }
  onCategoryChange: (category: string | null) => void
  onClearFilters: () => void
}

export function CategoryButtons({
  selectedCategory,
  hasActiveFilters,
  translations,
  onCategoryChange,
  onClearFilters
}: CategoryButtonsProps) {
  const { data: serviceTypes = [] } = usePublicServiceTypes()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className="text-sm font-medium text-[#a48a90]"
        style={{ letterSpacing: '0.05em' }}
      >
        {translations.filters}:
      </span>

      <Button
        onClick={() => onCategoryChange(null)}
        size="sm"
        className={cn(
          'rounded-full px-5 py-2 transition-all',
          !selectedCategory
            ? 'bg-[#8b1a4a] text-[#dae2fd] border-0 hover:bg-[#a7315f]'
            : 'border border-[#564146] text-[#dae2fd] bg-transparent hover:bg-[#8b1a4a]/10'
        )}
      >
        Alle
      </Button>

      {serviceTypes.map((cat) => (
        <Button
          key={cat.slug}
          onClick={() => onCategoryChange(cat.slug)}
          size="sm"
          className={cn(
            'rounded-full px-5 py-2 transition-all',
            selectedCategory === cat.slug
              ? 'bg-[#8b1a4a] text-[#dae2fd] border-0 hover:bg-[#a7315f]'
              : 'border border-[#564146] text-[#dae2fd] bg-transparent hover:bg-[#8b1a4a]/10'
          )}
        >
          {cat.name}
        </Button>
      ))}

      {hasActiveFilters && (
        <Button
          onClick={onClearFilters}
          size="sm"
          className="rounded-full bg-transparent text-[#a48a90] transition-colors hover:text-[#dae2fd]"
        >
          <X className="mr-1 h-4 w-4" />
          {translations.clearFilters}
        </Button>
      )}
    </div>
  )
}
