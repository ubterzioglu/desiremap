/**
 * DesireMap Schema Composers
 * ─────────────────────────────────────────────────────────────────────────────
 * Her composer, bir sayfa tipinin TÜM schema bloklarını bir array olarak döner.
 * Next.js generateMetadata() veya <JsonLd> component'i bunu alır.
 *
 * Kullanım:
 *   const schemas = composeHomePageSchemas(data)
 *   // → [Organization, WebSite, WebPage, BreadcrumbList, ItemList, FAQPage]
 */

import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildWebPageSchema,
  buildBreadcrumbSchema,
  buildVenueSchema,
  buildItemListSchema,
  buildFaqSchema,
  buildArticleSchema,
} from '../schemas/builders'
import { SITE_CONFIG, CATEGORY_CONFIG } from '../utils/constants'
import type {
  HomePageSchemaData,
  CategoryPageSchemaData,
  CityPageSchemaData,
  ListingPageSchemaData,
  GuidePageSchemaData,
} from '../types/schema.types'

// ─── 1. Ana Sayfa ─────────────────────────────────────────────────────────────

export function composeHomePageSchemas(data: HomePageSchemaData): object[] {
  const pageUrl = data.siteUrl

  const breadcrumbs = [
    { position: 1, name: 'DesireMap', item: pageUrl },
  ]

  return [
    buildOrganizationSchema(data.contact),
    buildWebSiteSchema(),
    buildWebPageSchema({
      url: pageUrl,
      name: `${SITE_CONFIG.name} – Deutschlands Erwachsenenclub-Verzeichnis`,
      description: data.description,
    }),
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
    buildItemListSchema(
      data.featuredVenues,
      'Empfohlene Clubs und Locations auf DesireMap'
    ),
    buildFaqSchema(data.faqs),
  ]
}

// ─── 2. Kategori Sayfası ──────────────────────────────────────────────────────

export function composeCategoryPageSchemas(data: CategoryPageSchemaData): object[] {
  const config = CATEGORY_CONFIG[data.category]
  const pageUrl = `${data.siteUrl}/${config.slug}`

  return [
    buildWebPageSchema({
      url: pageUrl,
      name: config.metaTitle,
      description: data.description,
      breadcrumbId: `${pageUrl}#breadcrumb`,
    }),
    buildBreadcrumbSchema(data.breadcrumbs, pageUrl),
    buildItemListSchema(
      data.venues,
      `Alle ${config.plural} in Deutschland auf DesireMap`
    ),
    buildFaqSchema(data.faqs),
  ]
}

// ─── 3. Şehir Sayfası ─────────────────────────────────────────────────────────

export function composeCityPageSchemas(data: CityPageSchemaData): object[] {
  const pageUrl = `${data.siteUrl}/stadt/${data.citySlug}`

  // Şehir için özel LocalBusiness schema — GEO pin için kritik
  const cityDirectorySchema = {
    '@type': 'LocalBusiness',
    '@id': `${pageUrl}#directory`,
    name: `DesireMap ${data.city}`,
    description: data.description,
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.city,
      addressRegion: data.federalState,
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: data.city,
    },
    isPartOf: { '@id': `${SITE_CONFIG.url}/#organization` },
  }

  return [
    buildWebPageSchema({
      url: pageUrl,
      name: `Clubs & Locations in ${data.city} – DesireMap`,
      description: data.description,
      breadcrumbId: `${pageUrl}#breadcrumb`,
    }),
    buildBreadcrumbSchema(data.breadcrumbs, pageUrl),
    cityDirectorySchema,
    buildItemListSchema(
      data.venues,
      `Verifizierte Clubs und Locations in ${data.city}`
    ),
    buildFaqSchema(data.faqs),
  ]
}

// ─── 4. Listing / Mekan Sayfası ───────────────────────────────────────────────

export function composeListingPageSchemas(data: ListingPageSchemaData): object[] {
  const pageUrl = `${data.siteUrl}/location/${data.venue.slug}`

  return [
    buildWebPageSchema({
      url: pageUrl,
      name: `${data.venue.name} – ${data.venue.city} | DesireMap`,
      description: data.venue.description.slice(0, 160),
      breadcrumbId: `${pageUrl}#breadcrumb`,
      imageUrl: data.venue.images[0]?.url,
      datePublished: data.publishedAt,
      dateModified: data.lastModified,
    }),
    buildBreadcrumbSchema(data.breadcrumbs, pageUrl),
    buildVenueSchema(data.venue),
    ...(data.faqs.length > 0 ? [buildFaqSchema(data.faqs)] : []),
    ...(data.relatedVenues.length > 0
      ? [
          buildItemListSchema(
            data.relatedVenues,
            `Ähnliche Locations in der Nähe von ${data.venue.city}`
          ),
        ]
      : []),
  ]
}

// ─── 5. Guide / Ratgeber Sayfası ──────────────────────────────────────────────

export function composeGuidePageSchemas(data: GuidePageSchemaData): object[] {
  const pageUrl = `${data.siteUrl}/guide/${data.slug}`

  return [
    buildArticleSchema({
      url: pageUrl,
      title: data.title,
      description: data.description,
      authorName: data.authorName,
      authorUrl: data.authorUrl,
      publishedAt: data.publishedAt,
      lastModified: data.lastModified,
      wordCount: data.wordCount,
    }),
    buildWebPageSchema({
      url: pageUrl,
      name: data.title,
      description: data.description,
      breadcrumbId: `${pageUrl}#breadcrumb`,
      datePublished: data.publishedAt,
      dateModified: data.lastModified,
    }),
    buildBreadcrumbSchema(data.breadcrumbs, pageUrl),
    buildFaqSchema(data.faqs),
    ...(data.relatedVenues && data.relatedVenues.length > 0
      ? [buildItemListSchema(data.relatedVenues, `Empfohlene Locations zum Thema ${data.title}`)]
      : []),
  ]
}
