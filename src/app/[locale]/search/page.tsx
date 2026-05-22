import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SearchPageContent } from './SearchPageContent'
import { getSearchPath } from '@/lib/navigation'
import {
  getSearchCategoryLabel,
  getSearchCityDisplayName,
  normalizeIncomingSearchParams,
} from '@/lib/search-routing'

const siteUrl = 'https://desiremap.de'

const localeTitles: Record<string, string> = {
  de: 'Bordelle, FKK Clubs & Laufhäuser suchen – DesireMap',
  en: 'Search FKK Clubs, Brothels & Laufhaus in Germany – DesireMap',
  tr: "Almanya'da FKK Kulübü & Laufhaus Arayın – DesireMap",
  ar: 'ابحث عن نوادي FKK ومنشآت Laufhaus في ألمانيا – DesireMap'
}

const localeDescriptions: Record<string, string> = {
  de: 'Durchsuchen Sie FKK Clubs, Bordelle und Laufhäuser in ganz Deutschland.',
  en: 'Search FKK clubs, brothels and laufhaus across Germany.',
  tr: 'Almanya genelinde FKK kulüpleri, genelevler ve laufhaus arayın.',
  ar: 'ابحث عن أندية FKK وبيوت الدعارة في جميع أنحاء ألمانيا.'
}

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; city?: string; category?: string }>
}): Promise<Metadata> {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const normalizedSearchParams = normalizeIncomingSearchParams({
    ...resolvedSearchParams,
  })
  const { q, city, category } = normalizedSearchParams
  
  const baseTitle = localeTitles[locale] || localeTitles.de
  const description = localeDescriptions[locale] || localeDescriptions.de
  
  const displayCity = getSearchCityDisplayName(city)
  const queryPart = q ? ` - "${q}"` : ''
  const cityPart = displayCity ? ` in ${displayCity}` : ''
  const title = `${baseTitle}${queryPart}${cityPart}`
  
  const canonicalUrl = `${siteUrl}${getSearchPath(locale, {
    ...(q ? { q } : {}),
    ...(city ? { city } : {}),
    ...(category ? { category } : {}),
  })}`

  return {
    title,
    description,
    alternates: {
        canonical: canonicalUrl,
        languages: {
        de: `/search`,
        en: `/en/search`,
        tr: `/tr/search`,
        ar: `/ar/search`
      }
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'DesireMap',
      images: [{ url: 'https://desiremap.de/hero-bg.jpg', width: 1200, height: 630 }],
    },
    robots: {
      index: false,
      follow: true
    }
  }
}

function getSearchSchema(locale: string, query?: string, city?: string, category?: string, resultCount?: number) {
  const searchUrl = `${siteUrl}${getSearchPath(locale)}`
  const locationPhrase = city ? ` in ${getSearchCityDisplayName(city)}` : ''
  const categoryLabel = getSearchCategoryLabel(category)
  const categoryPhrase = categoryLabel ? ` for ${categoryLabel}` : ''
  const resultPhrase = typeof resultCount === 'number' ? ` with ${resultCount} results` : ''
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${searchUrl}/#webpage`,
        url: searchUrl,
        name: query ? `Search results for "${query}"` : 'Search',
        description: `Search FKK clubs, brothels and laufhaus${locationPhrase}${categoryPhrase} in Germany${resultPhrase}`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        inLanguage: locale
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${searchUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: locale === 'de' ? siteUrl : `${siteUrl}/${locale}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Search'
          }
        ]
      }
    ]
  }
}

export default async function SearchPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; city?: string; category?: string }>
}) {
  const [{ locale }, rawSearchParams] = await Promise.all([params, searchParams])
  const { q, city, category } = rawSearchParams
  const normalizedSearchParams = normalizeIncomingSearchParams({
    ...rawSearchParams,
  })

  if (
    q !== normalizedSearchParams.q
    || city !== normalizedSearchParams.city
    || category !== normalizedSearchParams.category
  ) {
    redirect(getSearchPath(locale, normalizedSearchParams))
  }
  
  const structuredData = getSearchSchema(locale, normalizedSearchParams.q, normalizedSearchParams.city, normalizedSearchParams.category)

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SearchPageContent 
        locale={locale}
        initialQuery={normalizedSearchParams.q || ''}
        initialCity={normalizedSearchParams.city || ''}
        initialCategory={normalizedSearchParams.category || ''}
      />
    </>
  )
}
