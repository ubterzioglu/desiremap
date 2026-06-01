'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/components/home/HomePage'
import { getLocalizedPath } from '@/lib/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildHomeGraph, absoluteUrl, homeUrl } from '@/lib/seo/schema'
import { getHomeSeoMetadata, getHomeSeoExperience } from '@/lib/seo/home'

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

  const homeMeta = getHomeSeoMetadata(locale)
  const homeExperience = getHomeSeoExperience(locale)
  const homeGraph = buildHomeGraph({
    locale,
    url: homeUrl(locale),
    name: homeMeta.title,
    description: homeMeta.description,
    primaryImage: absoluteUrl('/hero-bg.jpg'),
    faq: homeExperience.faq,
    categories: homeExperience.clusters.map((cluster) => ({
      name: cluster.label,
      url: absoluteUrl(cluster.href),
    })),
    cities: homeExperience.cityLinks.map((city) => ({
      name: city.name,
      url: absoluteUrl(city.href),
    })),
  })

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <JsonLd schemas={[homeGraph]} />
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
