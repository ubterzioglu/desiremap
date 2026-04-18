'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { citiesData } from '@/data/cities'
import { getCityPath, getLocalizedPath } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type MobileMenuProps = {
  isOpen: boolean
  locale: string
  translations: {
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

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mt-6 pb-4"
    >
      <nav className="flex flex-col gap-4">
        <Link href={`/${locale}`} onClick={onClose} className="text-gray-300 hover:text-white transition-colors py-2">
          {translations.discover}
        </Link>
        <div>
          <div className="flex items-center justify-between py-2">
            <Link href={getLocalizedPath(locale, '/stadt')} onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
              {translations.cities}
            </Link>
            <button onClick={() => setCitiesExpanded((v) => !v)} className="text-gray-400 hover:text-white p-1">
              <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', citiesExpanded && 'rotate-180')} />
            </button>
          </div>
          <AnimatePresence>
            {citiesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-3 pb-2 flex flex-col gap-1 border-l border-white/10 ml-1">
                  {citiesData.map((city) => (
                    <Link
                      key={city.slug}
                      href={getCityPath(locale, city.slug)}
                      onClick={onClose}
                      className="text-sm text-gray-400 hover:text-white transition-colors py-1"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={() => { onClose(); onLoginClick?.('premium') }} className="text-left text-gray-300 hover:text-white transition-colors py-2">
          {translations.premium}
        </button>
        <button onClick={() => { onClose(); onLoginClick?.('advertise') }} className="text-left text-gray-300 hover:text-white transition-colors py-2">
          {translations.advertise}
        </button>
      </nav>
    </motion.div>
  )
}
