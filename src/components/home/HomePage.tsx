'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedCities } from './FeaturedCities'
import { HeroSection } from './HeroSection'
import { SEOContentSection } from './SEOContentSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHomeSeoMetadata } from '@/lib/seo/home'
import { getStructuredData } from '@/lib/structuredData'

const ListingsSection = dynamic(() => import('@/components/listings/ListingsSection').then(m => m.ListingsSection), { ssr: false })

type HomePageProps = { locale: string }

export function HomePage({ locale }: HomePageProps) {
  const hero = useTranslations('hero')
  const stats = useTranslations('stats')
  const categories = useTranslations('categories')
  const cities = useTranslations('cities')
  const meta = getHomeSeoMetadata(locale)
  const structuredData = getStructuredData(locale, meta.title, meta.description, ['de', 'en', 'tr', 'ar'])
  const schemas = (structuredData['@graph'] || []) as object[]

  return (
    <>
      <JsonLd schemas={schemas} />
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
