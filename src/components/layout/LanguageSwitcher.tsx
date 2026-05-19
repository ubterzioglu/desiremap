'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getLocalizedPath } from '@/lib/navigation'

const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ar', label: 'عربي' },
] as const

function getBasePath(pathname: string, locale: string): string {
  if (locale === 'de') return pathname
  const prefix = `/${locale}`
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length) || '/'
  }
  return pathname
}

type LanguageSwitcherProps = {
  locale: string
  variant?: 'desktop' | 'mobile'
}

export function LanguageSwitcher({ locale, variant = 'desktop' }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const basePath = getBasePath(pathname, locale)
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 py-2">
        {LANGUAGES.map((lang) => (
          <Link
            key={lang.code}
            href={getLocalizedPath(lang.code, basePath)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors',
              lang.code === locale
                ? 'border-[#b33b6a] bg-[#8b1a4a]/30 text-[#ffb1c6]'
                : 'border-white/10 bg-white/5 text-[#a0aabf] hover:border-white/20 hover:text-[#d7ddee]'
            )}
          >
            {lang.code.toUpperCase()}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#d7ddee] transition-colors hover:bg-white/8 hover:text-white"
      >
        <Globe className="h-4 w-4 text-[#f0b0c0]" />
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 top-full mt-2 min-w-[148px] overflow-hidden rounded-xl border border-white/10 bg-[#0e1628] shadow-xl shadow-black/40"
          >
            {LANGUAGES.map((lang) => (
              <Link
                key={lang.code}
                href={getLocalizedPath(lang.code, basePath)}
                onClick={() => setOpen(false)}
                role="option"
                aria-selected={lang.code === locale}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium transition-colors hover:bg-white/6',
                  lang.code === locale ? 'text-[#ffb1c6]' : 'text-[#d7ddee]'
                )}
              >
                <span className="w-7 text-[10px] font-bold uppercase tracking-wider text-[#a0aabf]">
                  {lang.code.toUpperCase()}
                </span>
                <span>{lang.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
