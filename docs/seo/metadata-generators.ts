/**
 * DesireMap Metadata Generators
 * ─────────────────────────────────────────────────────────────────────────────
 * Next.js App Router generateMetadata() fonksiyonlarında kullanılacak
 * yardımcılar. Her sayfa tipine özel Metadata objesi üretir.
 *
 * JMStV uyumu için adult content meta tag'leri burada yönetilir.
 */

import type { Metadata } from 'next'
import { SITE_CONFIG, CATEGORY_CONFIG } from '../utils/constants'
import type {
  HomePageSchemaData,
  CategoryPageSchemaData,
  CityPageSchemaData,
  ListingPageSchemaData,
  GuidePageSchemaData,
  VenueCategory,
} from '../types/schema.types'

// ─── Adult content meta tag'leri (JMStV + Google) ────────────────────────────
// Bu tag'ler olmadan Google adult mekan sitelerini düzensiz kategorize eder.

const ADULT_META_TAGS = {
  // JMStV (Jugendmedienschutz-Staatsvertrag) uyumu
  rating: 'adult',
  // RTA (Restricted to Adults) — en yaygın tanınan adult content label
  // Hem Google hem de adult content filter sistemleri bu label'ı okur.
  'RATING': 'RTA-5042-1996-1400-1577-RTA',
  // Önce SafeSearch'ten hariç tut, ama mature content olarak işaretle
  'revisit-after': '7 days',
}

// ─── Base metadata (tüm sayfalarda ortak) ────────────────────────────────────

function buildBaseMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    robots: {
      // SafeSearch filtresi KAPALI — adult mekan olarak indeksle
      // "nosnippet" değil — Google snippet'larını istiyoruz
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,        // Tüm snippet uzunluğuna izin ver
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    other: ADULT_META_TAGS,
    ...overrides,
  }
}

// ─── 1. Ana Sayfa Metadata ────────────────────────────────────────────────────

export function generateHomeMetadata(data: HomePageSchemaData): Metadata {
  const title = `${SITE_CONFIG.name} – Deutschlands Erwachsenenclub-Verzeichnis`
  const description = data.description

  return buildBaseMetadata({
    title,
    description,
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: { 'de-DE': SITE_CONFIG.url },
    },
    openGraph: {
      type: 'website',
      url: SITE_CONFIG.url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@desiremapde',
    },
  })
}

// ─── 2. Kategori Sayfası Metadata ─────────────────────────────────────────────

export function generateCategoryMetadata(
  data: CategoryPageSchemaData
): Metadata {
  const config = CATEGORY_CONFIG[data.category]
  const pageUrl = `${SITE_CONFIG.url}/${config.slug}`

  return buildBaseMetadata({
    title: config.metaTitle,
    description: config.metaDesc,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: config.metaTitle,
      description: config.metaDesc,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
    },
  })
}

// ─── 3. Şehir Sayfası Metadata ────────────────────────────────────────────────

export function generateCityMetadata(data: CityPageSchemaData): Metadata {
  const pageUrl = `${SITE_CONFIG.url}/stadt/${data.citySlug}`
  const title = `Clubs & Locations in ${data.city} – Verifiziert | ${SITE_CONFIG.name}`
  const description = `Alle verifizierten Erwachsenenclubs in ${data.city}: FKK, Bordelle, Saunaclubs und mehr. Diskret, geprüft und direkt buchbar auf DesireMap.`

  return buildBaseMetadata({
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
    },
  })
}

// ─── 4. Listing / Mekan Sayfası Metadata ─────────────────────────────────────

export function generateListingMetadata(data: ListingPageSchemaData): Metadata {
  const { venue } = data
  const pageUrl = `${SITE_CONFIG.url}/location/${venue.slug}`
  const categoryConfig = CATEGORY_CONFIG[venue.category]

  const title = `${venue.name} – ${categoryConfig.label} in ${venue.city} | ${SITE_CONFIG.name}`
  const description = venue.description.slice(0, 155) + '…'

  return buildBaseMetadata({
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
      images: venue.images[0]
        ? [
            {
              url: venue.images[0].url,
              width: venue.images[0].width,
              height: venue.images[0].height,
              alt: `${venue.name} – ${venue.city}`,
            },
          ]
        : [],
    },
  })
}

// ─── 5. Guide Sayfası Metadata ────────────────────────────────────────────────

export function generateGuideMetadata(data: GuidePageSchemaData): Metadata {
  const pageUrl = `${SITE_CONFIG.url}/guide/${data.slug}`

  return buildBaseMetadata({
    title: `${data.title} | ${SITE_CONFIG.name}`,
    description: data.description,
    alternates: { canonical: pageUrl },
    authors: [{ name: data.authorName, url: data.authorUrl }],
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: data.title,
      description: data.description,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
      publishedTime: data.publishedAt,
      modifiedTime: data.lastModified,
      authors: [data.authorUrl],
    },
  })
}
