'use client'

import { useTranslations } from 'next-intl'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedCities } from './FeaturedCities'
import { HeroSection } from './HeroSection'
import { ListingsSection } from '@/components/listings/ListingsSection'
import { SEOContentSection } from './SEOContentSection'

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
