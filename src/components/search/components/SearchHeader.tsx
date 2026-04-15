'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SearchHeaderProps = {
  locale: string
  backToHome: string
  resultsTitle: string
  onNavigate: (url: string) => void
}

export function SearchHeader({ locale, backToHome, resultsTitle, onNavigate }: SearchHeaderProps) {
  return (
    <>
      <Button onClick={() => onNavigate(`/${locale}`)} variant="ghost" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <X className="w-5 h-5 rotate-45" />
        {backToHome}
      </Button>
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">{resultsTitle}</h1>
    </>
  )
}
