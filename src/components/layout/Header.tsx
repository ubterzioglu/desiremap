'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, Menu, User, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { useScrollHeader } from '@/components/layout/hooks/useScrollHeader'
import { getLocalizedPath } from '@/lib/navigation'
import type { Translations } from '@/types'

type HeaderProps = {
  locale: string
  onLoginClick?: (message?: string) => void
  isLoggedIn?: boolean
  onDashboardClick?: () => void
  translations: Translations['nav']
}

export function Header({ locale, onLoginClick, isLoggedIn, onDashboardClick, translations }: HeaderProps) {
  const isScrolled = useScrollHeader(50)
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const homePath = getLocalizedPath(locale, '/')
  const searchPath = getLocalizedPath(locale, '/search')
  const cityPath = getLocalizedPath(locale, '/stadt')
  const blogPath = getLocalizedPath(locale, '/blog')
  const navigationItems = [
    { href: homePath, label: translations.home, active: pathname === homePath },
    { href: searchPath, label: translations.discover, active: pathname.startsWith(searchPath) },
    { href: cityPath, label: translations.cities, active: pathname.startsWith(cityPath) },
    { href: blogPath, label: 'Blog', active: pathname.startsWith(blogPath) }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#0b1326]/92 backdrop-blur-xl transition-all duration-300',
        isScrolled ? 'shadow-[0_18px_40px_rgba(5,10,24,0.38)]' : 'shadow-none'
      )}
    >
      <div className="flex h-[72px] w-full items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href={homePath} aria-label="DesireMap - Startseite">
          <Image
            src="/desiremap_strict1_neon_flicker.webp"
            alt="DesireMap"
            width={180}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative pb-1 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors',
                item.active ? 'text-[#ffb1c6]' : 'text-[#d7ddee] hover:text-white'
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#ffb1c6] transition-opacity',
                  item.active ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} />
          </div>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDashboardClick}
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 text-[#d7ddee] hover:bg-white/8 hover:text-white sm:inline-flex"
            >
              <User className="mr-2 h-4 w-4" />
              {translations.myAccount}
            </Button>
          ) : onLoginClick ? (
            <Button
              type="button"
              size="sm"
              onClick={() => onLoginClick()}
              className="hidden h-10 rounded-full border border-[#b33b6a] bg-[#8b1a4a] px-5 text-[12px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_10px_24px_rgba(139,26,74,0.35)] hover:bg-[#a11f57] sm:inline-flex"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {translations.login}
            </Button>
          ) : null}

          <Button variant="ghost" size="icon" aria-label="Open menu" aria-expanded={mobileMenuOpen} className="text-white lg:hidden" onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        <MobileMenu
          isOpen={mobileMenuOpen}
          locale={locale}
          translations={translations}
          {...(onLoginClick === undefined ? {} : { onLoginClick })}
          onClose={() => setMobileMenuOpen(false)}
        />
      </AnimatePresence>
    </motion.header>
  )
}
