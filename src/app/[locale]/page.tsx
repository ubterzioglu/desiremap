'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { bordells } from '@/data/mock-data'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/components/home/HomePage'
import { CityPage } from '@/components/pages/CityPage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { DetailPage } from '@/components/pages/DetailPage'
import { LoginPage } from '@/components/pages/LoginPage'
import { AdminPanel } from '@/components/pages/AdminPanel'
import type { Bordell, View } from '@/types'

function useNavTranslations() {
  const t = useTranslations('nav')
  return { discover: t('discover'), cities: t('cities'), premium: t('premium'), advertise: t('advertise'), login: t('login'), register: t('register'), myAccount: t('myAccount') }
}

type Handlers = { onCityClick: (city: string) => void; onBordellClick: (bordell: Bordell) => void; onBackHome: () => void; onBackCity: () => void; onLogin: () => void; onAdminLogin: () => void; onLogout: () => void; onRegister: () => void }

function ViewHome(props: { locale: string; onCityClick: (city: string) => void; onBordellClick: (bordell: Bordell) => void; onLoginRequired: (message?: string) => void }) {
  return <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage {...props} /></motion.div>
}

function ViewCity(props: { city: string; handlers: Handlers }) {
  return <CityPage key="city" city={props.city} bordells={bordells} onBack={props.handlers.onBackHome} onBordellClick={props.handlers.onBordellClick} />
}

function ViewDetail(props: { bordell: Bordell; hasCity: boolean; handlers: Handlers }) {
  return <DetailPage key="detail" bordell={props.bordell} onBack={props.hasCity ? props.handlers.onBackCity : props.handlers.onBackHome} />
}

function ViewLogin(props: { loginMessage?: string; handlers: Handlers }) {
  return <LoginPage key="login" onBack={props.handlers.onBackHome} loginMessage={props.loginMessage} onAdminLogin={props.handlers.onAdminLogin} onRegister={props.handlers.onRegister} />
}

function ViewDashboard() {
  return <DashboardPage key="dashboard" />
}

function ViewAdmin() {
  return <AdminPanel key="admin" />
}

export default function Home() {
  const router = useRouter()
  const locale = useLocale()
  const [view, setView] = useState<View>('home')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBordell, setSelectedBordell] = useState<Bordell | null>(null)
  const [loginMessage, setLoginMessage] = useState<string | undefined>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navTranslations = useNavTranslations()
  const toTop = () => window.scrollTo(0, 0)
  const showLayout = view !== 'dashboard' && view !== 'admin'
  const handlers: Handlers = {
    onCityClick: (city) => { setSelectedCity(city); setView('city'); toTop() },
    onBordellClick: (bordell) => { setSelectedBordell(bordell); setView('detail'); toTop() },
    onBackHome: () => { setView('home'); setSelectedCity(null); setSelectedBordell(null); setLoginMessage(undefined); toTop() },
    onBackCity: () => { setView('city'); setSelectedBordell(null); toTop() },
    onLogin: () => { setIsLoggedIn(true); setLoginMessage(undefined); setView('dashboard'); toTop() },
    onAdminLogin: () => { setIsAdmin(true); setView('admin'); toTop() },
    onLogout: () => { setIsLoggedIn(false); setIsAdmin(false); setView('home'); toTop() },
    onRegister: () => { router.push('/de/register') }
  }
  const renderView = () => {
    const viewMap: Record<View, React.ReactNode> = {
      home: <ViewHome locale={locale} onCityClick={handlers.onCityClick} onBordellClick={handlers.onBordellClick} onLoginRequired={(msg) => { setLoginMessage(msg); setView('login'); toTop() }} />,
      city: selectedCity ? <ViewCity city={selectedCity} handlers={handlers} /> : null,
      detail: selectedBordell ? <ViewDetail bordell={selectedBordell} hasCity={!!selectedCity} handlers={handlers} /> : null,
      login: <ViewLogin loginMessage={loginMessage} handlers={handlers} />,
      dashboard: <ViewDashboard />,
      admin: <ViewAdmin />
    }
    return viewMap[view]
  }
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {showLayout && <Header locale={locale} onLoginClick={(msg) => { setLoginMessage(msg); setView('login'); toTop() }} isLoggedIn={isLoggedIn} onDashboardClick={() => setView('dashboard')} translations={navTranslations} />}
      <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      {showLayout && <Footer locale={locale} />}
    </main>
  )
}
