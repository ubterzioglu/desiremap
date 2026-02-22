'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { bordells, mockUser } from '@/data/mock-data'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FeaturedCities } from '@/components/home/FeaturedCities'
import { HeroSection } from '@/components/home/HeroSection'
import { ListingsSection } from '@/components/listings/ListingsSection'
import { PromoSections } from '@/components/home/PromoSections'
import { AdminPanel } from '@/components/pages/AdminPanel'
import { CityPage } from '@/components/pages/CityPage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { DetailPage } from '@/components/pages/DetailPage'
import { LoginPage } from '@/components/pages/LoginPage'
import type { Bordell, View } from '@/types'

export default function Home() {
  const [view, setView] = useState<View>('home')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBordell, setSelectedBordell] = useState<Bordell | null>(null)
  const [loginMessage, setLoginMessage] = useState<string | undefined>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const nav = useTranslations('nav')
  const hero = useTranslations('hero')
  const stats = useTranslations('stats')
  const categories = useTranslations('categories')
  const cities = useTranslations('cities')
  const navTranslations = { discover: nav('discover'), cities: nav('cities'), premium: nav('premium'), advertise: nav('advertise'), login: nav('login'), register: nav('register'), myAccount: nav('myAccount') }
  const heroTranslations = { title: hero('title'), subtitle: hero('subtitle'), description: hero('description'), searchPlaceholder: hero('searchPlaceholder'), selectCity: hero('selectCity'), search: hero('search'), scrollToExplore: hero('scrollToExplore') }
  const statsTranslations = { establishments: stats('establishments'), ladies: stats('ladies'), rating: stats('rating'), verified: stats('verified') }
  const categoriesTranslations = { title: categories('title'), subtitle: categories('subtitle') }
  const citiesTranslations = { title: cities('title'), subtitle: cities('subtitle') }

  const toTop = () => window.scrollTo(0, 0)
  const handleCityClick = (city: string) => { setSelectedCity(city); setView('city'); toTop() }
  const handleBordellClick = (bordell: Bordell) => { setSelectedBordell(bordell); setView('detail'); toTop() }
  const handleBackToHome = () => { setView('home'); setSelectedCity(null); setSelectedBordell(null); setLoginMessage(undefined); toTop() }
  const handleBackToCity = () => { setView('city'); setSelectedBordell(null); toTop() }
  const handleLoginRequired = (message?: string) => { setLoginMessage(message); setView('login'); toTop() }
  const handleLogin = () => { setIsLoggedIn(true); setLoginMessage(undefined); setView('dashboard'); toTop() }
  const handleAdminLogin = () => { setIsAdmin(true); setView('admin'); toTop() }
  const handleLogout = () => { setIsLoggedIn(false); setIsAdmin(false); setView('home'); toTop() }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {view !== 'dashboard' && view !== 'admin' && <Header onLoginClick={handleLoginRequired} isLoggedIn={isLoggedIn} onDashboardClick={() => setView('dashboard')} translations={navTranslations} />}
      <AnimatePresence mode="wait">
        {view === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HeroSection translations={heroTranslations} stats={statsTranslations} /><CategoriesSection translations={categoriesTranslations} /><FeaturedCities onCityClick={handleCityClick} translations={citiesTranslations} /><ListingsSection bordells={bordells} onBordellClick={handleBordellClick} /><PromoSections onLoginRequired={handleLoginRequired} /></motion.div>}
        {view === 'city' && selectedCity && <CityPage key="city" city={selectedCity} bordells={bordells} onBack={handleBackToHome} onBordellClick={handleBordellClick} />}
        {view === 'detail' && selectedBordell && <DetailPage key="detail" bordell={selectedBordell} onBack={selectedCity ? handleBackToCity : handleBackToHome} />}
        {view === 'login' && <LoginPage key="login" onBack={handleBackToHome} loginMessage={loginMessage} onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
        {view === 'dashboard' && isLoggedIn && <DashboardPage key="dashboard" user={mockUser} onLogout={handleLogout} />}
        {view === 'admin' && isAdmin && <AdminPanel key="admin" onLogout={handleLogout} />}
      </AnimatePresence>
      {view !== 'dashboard' && view !== 'admin' && <Footer />}
    </main>
  )
}
