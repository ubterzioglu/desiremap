'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/components/home/HomePage'
import { getLocalizedPath } from '@/lib/navigation'

function useNavTranslations() {
  const t = useTranslations('nav')
  return {
    home: t('home'),
    discover: t('discover'),
    cities: t('cities'),
    premium: t('premium'),
    advertise: t('advertise'),
    login: t('login'),
    register: t('register'),
    myAccount: t('myAccount'),
  }
}

export default function Home() {
  const router = useRouter()
  const locale = useLocale()
  const navTranslations = useNavTranslations()

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Header
        locale={locale}
        translations={navTranslations}
        onLoginClick={() => {
          router.push(getLocalizedPath(locale, '/login'))
        }}
        isLoggedIn={false}
      />
      <HomePage locale={locale} />
      <Footer locale={locale} />
    </main>
  )
}
