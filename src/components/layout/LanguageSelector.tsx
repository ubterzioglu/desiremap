'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export function LanguageSelector() {
  const localeFromHook = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const defaultLanguage = languages[0]
  if (!defaultLanguage) {
    throw new Error('Language selector options missing')
  }

  const segments = pathname.split('/').filter(Boolean)
  const localeFromPath = segments[0]
  const validLocales = ['de', 'en', 'ar', 'tr']
  const hasLocaleInPath = localeFromPath !== undefined && validLocales.includes(localeFromPath)
  const currentLocale = hasLocaleInPath ? localeFromPath : localeFromHook

  const currentLang = languages.find((lang) => lang.code === currentLocale) ?? defaultLanguage

  const changeLocale = (newLocale: string) => {
    const firstSegment = segments[0]
    const firstSegmentIsLocale = firstSegment !== undefined && validLocales.includes(firstSegment)

    if (newLocale === 'de') {
      const remaining = firstSegmentIsLocale ? segments.slice(1) : segments
      router.push('/' + remaining.join('/'))
      return
    }
    if (segments.length > 0 && firstSegmentIsLocale) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    router.push('/' + segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-white/10 bg-[#1a1a24]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLocale(lang.code)}
            className={`cursor-pointer text-gray-300 hover:bg-[#8b1a4a]/20 hover:text-white ${currentLocale === lang.code ? 'bg-[#8b1a4a]/20 text-white' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
