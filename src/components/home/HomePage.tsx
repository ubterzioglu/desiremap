'use client'

import { useTranslations } from 'next-intl'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedCities } from './FeaturedCities'
import { HeroSection } from './HeroSection'
import { ListingsSection } from '@/components/listings/ListingsSection'
import { PromoSections } from './PromoSections'
import { SEOContentSection } from './SEOContentSection'
import { bordells } from '@/data/mock-data'
import type { Bordell } from '@/types'

type HomePageProps = {
  locale: string
  onCityClick: (city: string) => void
  onBordellClick: (bordell: Bordell) => void
  onLoginRequired: (message?: string) => void
}

export function HomePage({ locale, onCityClick, onBordellClick, onLoginRequired }: HomePageProps) {
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
      <FeaturedCities onCityClick={onCityClick} translations={{ title: cities('title'), subtitle: cities('subtitle') }} />
      <ListingsSection bordells={bordells} onBordellClick={onBordellClick} />
      <PromoSections onLoginRequired={onLoginRequired} />
      <SEOContentSection locale={locale} />
    </>
  )
}
