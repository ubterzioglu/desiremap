'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
        <Link href={`/${locale}#cities`} onClick={onClose} className="text-gray-300 hover:text-white transition-colors py-2">
          {translations.cities}
        </Link>
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
