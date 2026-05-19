'use client'

import { ArrowLeft } from 'lucide-react'
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
      <Button onClick={() => onNavigate(`/${locale}`)} variant="ghost" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft className="h-5 w-5" />
        {backToHome}
      </Button>
      <h1 className="mb-8 text-4xl font-bold text-white sm:text-5xl">{resultsTitle}</h1>
    </>
  )
}
