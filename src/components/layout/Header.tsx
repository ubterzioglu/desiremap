'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, LogIn, Menu, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/layout/LanguageSelector'
import type { Translations } from '@/types'

type HeaderProps = {
  onLoginClick: (message?: string) => void
  isLoggedIn: boolean
  onDashboardClick: () => void
  translations: Translations['nav']
}

export function Header({ onLoginClick, isLoggedIn, onDashboardClick, translations }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', isScrolled ? 'bg-black/90 backdrop-blur-xl py-3 sm:py-4' : 'bg-transparent py-4 sm:py-6')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 sm:gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center"><Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div><div><span className="text-lg sm:text-xl font-bold text-white tracking-wider">DESIREMAP</span><span className="text-gray-500 text-xs hidden sm:inline">.de</span></div></a>
          <nav className="hidden md:flex items-center gap-8"><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.discover}</a><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.cities}</a><button onClick={() => onLoginClick('premium')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.premium}</button><button onClick={() => onLoginClick('advertise')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{translations.advertise}</button></nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            {isLoggedIn ? <><Button variant="ghost" size="sm" onClick={onDashboardClick} className="text-gray-300 hover:text-white"><User className="w-4 h-4 mr-2" />{translations.myAccount}</Button><Button size="sm" onClick={() => onLoginClick('register')} className="bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-full px-5">{translations.register}</Button></> : <><Button variant="ghost" size="sm" onClick={() => onLoginClick()} className="hidden sm:flex text-gray-300 hover:text-white"><LogIn className="w-4 h-4 mr-2" />{translations.login}</Button><Button size="sm" onClick={() => onLoginClick('register')} className="bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-full px-5">{translations.register}</Button></>}
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setMobileMenuOpen((value) => !value)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</Button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-6 pb-4"><nav className="flex flex-col gap-4"><a href="#" className="text-gray-300 hover:text-white transition-colors py-2">{translations.discover}</a><a href="#" className="text-gray-300 hover:text-white transition-colors py-2">{translations.cities}</a><button onClick={() => { setMobileMenuOpen(false); onLoginClick('premium') }} className="text-left text-gray-300 hover:text-white transition-colors py-2">{translations.premium}</button><button onClick={() => { setMobileMenuOpen(false); onLoginClick('advertise') }} className="text-left text-gray-300 hover:text-white transition-colors py-2">{translations.advertise}</button></nav></motion.div>}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
