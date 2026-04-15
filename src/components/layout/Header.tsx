'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, LogIn, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/layout/LanguageSelector'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', isScrolled ? 'bg-black/90 backdrop-blur-xl py-3 sm:py-4' : 'bg-transparent py-4 sm:py-6')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href={getLocalizedPath(locale, '/')} className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-wider">DESIREMAP</span>
              <span className="text-gray-500 text-xs hidden sm:inline">.de</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href={getLocalizedPath(locale, '/')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.discover}</Link>
            <Link href={`${getLocalizedPath(locale, '/')}#cities`} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.cities}</Link>
            <Link href={getLocalizedPath(locale, '/blog')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Blog</Link>
            <button onClick={() => onLoginClick ? onLoginClick('premium') : undefined} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.premium}</button>
            <button onClick={() => onLoginClick ? onLoginClick('advertise') : undefined} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.advertise}</button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={onDashboardClick} className="text-gray-300 hover:text-white"><User className="w-4 h-4 mr-2" />{translations.myAccount}</Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-gray-300 hover:text-white">
              <Link href={getLocalizedPath(locale, '/login')}><LogIn className="w-4 h-4 mr-2" />{translations.login}</Link>
            </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setMobileMenuOpen((v) => !v)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          <MobileMenu isOpen={mobileMenuOpen} locale={locale} translations={translations} onLoginClick={onLoginClick} onClose={() => setMobileMenuOpen(false)} />
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
