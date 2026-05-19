'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { citiesData } from '@/data/cities'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { getCityPath, getLocalizedPath } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type MobileMenuProps = {
  isOpen: boolean
  locale: string
  translations: {
    home: string
    discover: string
    cities: string
    premium: string
    advertise: string
  }
  onLoginClick?: (message: string) => void
  onClose: () => void
}

export function MobileMenu({ isOpen, locale, translations, onLoginClick, onClose }: MobileMenuProps) {
  const [citiesExpanded, setCitiesExpanded] = useState(false)
  const cityPanelId = 'mobile-menu-cities-panel'

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 pb-4 md:hidden"
    >
      <nav className="flex flex-col gap-4">
        <Link href={getLocalizedPath(locale, '/')} onClick={onClose} className="py-2 text-gray-300 transition-colors hover:text-white">
          {translations.home}
        </Link>
        <Link href={getLocalizedPath(locale, '/search')} onClick={onClose} className="py-2 text-gray-300 transition-colors hover:text-white">
          {translations.discover}
        </Link>
        <div>
          <div className="flex items-center justify-between py-2">
            <Link href={getLocalizedPath(locale, '/stadt')} onClick={onClose} className="text-gray-300 transition-colors hover:text-white">
              {translations.cities}
            </Link>
            <button
              type="button"
              aria-label={translations.cities}
              aria-expanded={citiesExpanded}
              aria-controls={cityPanelId}
              onClick={() => setCitiesExpanded((v) => !v)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', citiesExpanded && 'rotate-180')} />
            </button>
          </div>
          <AnimatePresence>
            {citiesExpanded && (
              <motion.div
                id={cityPanelId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="ml-1 flex flex-col gap-1 border-l border-white/10 pb-2 pl-3">
                  {citiesData.map((city) => (
                    <Link
                      key={city.slug}
                      href={getCityPath(locale, city.slug)}
                      onClick={onClose}
                      className="py-1 text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={() => { onClose(); onLoginClick?.('premium') }} className="py-2 text-left text-gray-300 transition-colors hover:text-white">
          {translations.premium}
        </button>
        <button onClick={() => { onClose(); onLoginClick?.('advertise') }} className="py-2 text-left text-gray-300 transition-colors hover:text-white">
          {translations.advertise}
        </button>

        <div className="border-t border-white/8 pt-4">
          <LanguageSwitcher locale={locale} variant="mobile" />
        </div>
      </nav>
    </motion.div>
  )
}
