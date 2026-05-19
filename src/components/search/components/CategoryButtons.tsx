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
      <span className="text-sm text-gray-400">{translations.filters}:</span>

      <Button
        onClick={() => onCategoryChange(null)}
        size="sm"
        variant={!selectedCategory ? 'default' : 'outline'}
        className={cn('rounded-full px-5', !selectedCategory ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}
      >
        Alle
      </Button>

      {serviceTypes.map((cat) => (
        <Button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          size="sm"
          variant={selectedCategory === cat.slug ? 'default' : 'outline'}
          className={cn('rounded-full px-5', selectedCategory === cat.slug ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}
        >
          {cat.name}
        </Button>
      ))}

      {hasActiveFilters && (
        <Button onClick={onClearFilters} size="sm" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
          <X className="mr-1 h-4 w-4" />
          {translations.clearFilters}
        </Button>
      )}
    </div>
  )
}
