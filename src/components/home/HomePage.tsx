'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedCities } from './FeaturedCities'
import { HeroSection } from './HeroSection'
import { SEOContentSection } from './SEOContentSection'

const ListingsSection = dynamic(() => import('@/components/listings/ListingsSection').then(m => m.ListingsSection), { ssr: false })

type HomePageProps = { locale: string }

export function HomePage({ locale }: HomePageProps) {
  const hero = useTranslations('hero')
  const stats = useTranslations('stats')
  const categories = useTranslations('categories')
  const cities = useTranslations('cities')
  return (
    <>
      <HeroSection
        locale={locale}
        translations={{ title: hero('title'), subtitle: hero('subtitle'), description: hero('description'), searchPlaceholder: hero('searchPlaceholder'), selectCity: hero('selectCity'), search: hero('search'), scrollToExplore: hero('scrollToExplore') }}
        stats={{ establishments: stats('establishments'), ladies: stats('ladies'), rating: stats('rating'), verified: stats('verified') }}
      />
      <CategoriesSection locale={locale} translations={{ title: categories('title'), subtitle: categories('subtitle') }} />
      <FeaturedCities translations={{ title: cities('title'), subtitle: cities('subtitle') }} />
      <ListingsSection />
      <SEOContentSection locale={locale} />
    </>
  )
}
