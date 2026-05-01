import type { Metadata } from 'next'
import { SearchPageContent } from './SearchPageContent'

const siteUrl = 'https://desiremap.de'

const localeTitles: Record<string, string> = {
  de: 'Suchergebnisse | DesireMap',
  en: 'Search Results | DesireMap',
  tr: 'Arama Sonuçları | DesireMap',
  ar: 'نتائج البحث | DesireMap'
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
  
  const canonicalUrl = `${siteUrl}/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ''}${city ? `${q ? '&' : '?'}city=${encodeURIComponent(city)}` : ''}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: `/de/search`,
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
      siteName: 'DesireMap'
    },
    robots: {
      index: false,
      follow: true
    }
  }
}

function getSearchSchema(locale: string, query?: string, city?: string, resultCount?: number) {
  const searchUrl = `${siteUrl}/${locale}/search`
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
            item: `${siteUrl}/${locale}`
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
