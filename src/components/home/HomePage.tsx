'use client'

import { useTranslations } from 'next-intl'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedCities } from './FeaturedCities'
import { HeroSection } from './HeroSection'
import { SEOContentSection } from './SEOContentSection'
import { ListingsSection } from '@/components/listings/ListingsSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHomeSeoMetadata } from '@/lib/seo/home'
import { getStructuredData } from '@/lib/structuredData'

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
        translations={{
          eyebrow: hero('eyebrow'),
          titleLine1Start: hero('titleLine1Start'),
          titleLine1Accent: hero('titleLine1Accent'),
          titleLine1End: hero('titleLine1End'),
          titleLine2Start: hero('titleLine2Start'),
          titleLine2Accent: hero('titleLine2Accent'),
          description: hero('description'),
          selectCity: hero('selectCity'),
          selectCategory: hero('selectCategory'),
          search: hero('search'),
          slideLabel: hero('slideLabel'),
          sliderControls: hero('sliderControls'),
          pauseSlider: hero('pauseSlider'),
          playSlider: hero('playSlider')
        }}
        stats={{ establishments: stats('establishments'), ladies: stats('ladies'), rating: stats('rating'), verified: stats('verified') }}
      />
      <CategoriesSection locale={locale} translations={{ title: categories('title'), subtitle: categories('subtitle') }} />
      <FeaturedCities translations={{ title: cities('title'), subtitle: cities('subtitle') }} />
      <ListingsSection />
      <SEOContentSection locale={locale} />
    </>
  )
}
