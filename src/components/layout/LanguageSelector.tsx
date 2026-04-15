'use client'

import { useState, useEffect } from 'react'
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
  const [mounted, setMounted] = useState(false)
  const localeFromHook = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const segments = pathname.split('/').filter(Boolean)
  const localeFromPath = segments[0]
  const validLocales = ['de', 'en', 'ar', 'tr']
  const currentLocale = validLocales.includes(localeFromPath) ? localeFromPath : localeFromHook

  const currentLang = languages.find((lang) => lang.code === currentLocale) ?? languages[0]

  const changeLocale = (newLocale: string) => {
    if (newLocale === 'de') {
      const remaining = validLocales.includes(segments[0]) ? segments.slice(1) : segments
      router.push('/' + remaining.join('/'))
      return
    }
    if (segments.length > 0 && validLocales.includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    router.push('/' + segments.join('/'))
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLocale(lang.code)}
            className={`cursor-pointer text-gray-300 hover:text-white hover:bg-[#8b1a4a]/20 ${currentLocale === lang.code ? 'bg-[#8b1a4a]/20 text-white' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
