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
import { DetailPage } from '@/components/pages/DetailPage'
import { getLocalizedPath, getVenuePath } from '@/lib/navigation'
import type { Bordell, View } from '@/types'

function useNavTranslations() {
  const t = useTranslations('nav')
  return { home: t('home'), discover: t('discover'), cities: t('cities'), premium: t('premium'), advertise: t('advertise'), login: t('login'), register: t('register'), myAccount: t('myAccount') }
}

type Handlers = { onCityClick: (city: string) => void; onBordellClick: (bordell: Bordell) => void; onBackHome: () => void; onBackCity: () => void }

function ViewHome(props: { locale: string }) {
  return <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage {...props} /></motion.div>
}

function ViewCity(props: { city: string; handlers: Handlers }) {
  return <CityPage key="city" city={props.city} bordells={bordells} onBackAction={props.handlers.onBackHome} />
}

function ViewDetail(props: { bordell: Bordell; hasCity: boolean; handlers: Handlers }) {
  return <DetailPage key="detail" bordell={props.bordell} onBack={props.hasCity ? props.handlers.onBackCity : props.handlers.onBackHome} />
}

export default function Home() {
  const router = useRouter()
  const locale = useLocale()
  const [view, setView] = useState<View>('home')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBordell, setSelectedBordell] = useState<Bordell | null>(null)
  const navTranslations = useNavTranslations()
  const toTop = () => window.scrollTo(0, 0)
  const handlers: Handlers = {
    onCityClick: (city) => { setSelectedCity(city); setView('city'); toTop() },
    onBordellClick: (bordell) => { router.push(getVenuePath(locale, bordell.id)); toTop() },
    onBackHome: () => { setView('home'); setSelectedCity(null); setSelectedBordell(null); toTop() },
    onBackCity: () => { setView('city'); setSelectedBordell(null); toTop() },
  }
  const renderView = () => {
    const viewMap: Record<View, React.ReactNode> = {
      home: <ViewHome locale={locale} />,
      city: selectedCity ? <ViewCity city={selectedCity} handlers={handlers} /> : null,
      detail: selectedBordell ? <ViewDetail bordell={selectedBordell} hasCity={!!selectedCity} handlers={handlers} /> : null,
    }
    return viewMap[view]
  }
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Header locale={locale} translations={navTranslations} onLoginClick={() => { router.push(getLocalizedPath(locale, '/login')) }} isLoggedIn={false} />
      <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      <Footer locale={locale} />
    </main>
  )
}
