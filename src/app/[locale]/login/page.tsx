'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LoginPage } from '@/components/pages/LoginPage'

function useNavTranslations() {
  const t = useTranslations('nav')
  return { home: t('home'), discover: t('discover'), cities: t('cities'), premium: t('premium'), advertise: t('advertise'), login: t('login'), register: t('register'), myAccount: t('myAccount') }
}

export default function LoginRoute() {
  const locale = useLocale()
  const navTranslations = useNavTranslations()

  return (
    <main className="flex min-h-screen flex-col" style={{ background: '#0b1326' }}>
      <Header locale={locale} translations={navTranslations} isLoggedIn={false} />
      <LoginPage />
      <Footer locale={locale} />
    </main>
  )
}
