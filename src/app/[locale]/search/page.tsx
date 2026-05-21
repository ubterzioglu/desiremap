import type { Metadata } from 'next'
import { SearchPageContent } from './SearchPageContent'
import { getSearchPath } from '@/lib/navigation'

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
  searchParams: Promise<{ q?: string; city?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { q, city } = await searchParams
  
  const baseTitle = localeTitles[locale] || localeTitles.de
  const description = localeDescriptions[locale] || localeDescriptions.de
  
  const queryPart = q ? ` - "${q}"` : ''
  const cityPart = city ? ` in ${city}` : ''
  const title = `${baseTitle}${queryPart}${cityPart}`
  
  const canonicalUrl = `${siteUrl}${getSearchPath(locale, {
    ...(q ? { q } : {}),
    ...(city ? { city } : {}),
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

function getSearchSchema(locale: string, query?: string, city?: string, resultCount?: number) {
  const searchUrl = `${siteUrl}${getSearchPath(locale)}`
  const locationPhrase = city ? ` in ${city}` : ''
  const resultPhrase = typeof resultCount === 'number' ? ` with ${resultCount} results` : ''
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${searchUrl}/#webpage`,
        url: searchUrl,
        name: query ? `Search results for "${query}"` : 'Search',
        description: `Search FKK clubs, brothels and laufhaus${locationPhrase} in Germany${resultPhrase}`,
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
  const { locale } = await params
  const { q, city, category } = await searchParams
  
  const structuredData = getSearchSchema(locale, q, city)

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SearchPageContent 
        locale={locale}
        initialQuery={q || ''}
        initialCity={city || ''}
        initialCategory={category || ''}
      />
    </>
  )
}
