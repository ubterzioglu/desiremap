'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
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
            className={`cursor-pointer text-gray-300 hover:text-white hover:bg-[#8b1a4a]/20 ${locale === lang.code ? 'bg-[#8b1a4a]/20 text-white' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
