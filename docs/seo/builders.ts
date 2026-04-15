/**
 * DesireMap Schema Builders
 * ─────────────────────────────────────────────────────────────────────────────
 * Her fonksiyon tek bir schema.org bloğu üretir.
 * Pure fonksiyonlar — side effect yok, test edilebilir.
 * Composer'lar bunları birleştirerek sayfa bazlı output oluşturur.
 */

import { SITE_CONFIG, CATEGORY_CONFIG } from '../utils/constants'
import type {
  VenueDetail,
  VenueSummary,
  FaqItem,
  BreadcrumbItem,
  ContactPoint,
  PostalAddress,
  GeoCoordinates,
  OpeningHoursEntry,
  AggregateRating,
  VenueCategory,
} from '../types/schema.types'

// ─── Yardımcı ─────────────────────────────────────────────────────────────────

const siteUrl = (path = ''): string => `${SITE_CONFIG.url}${path}`

// ─── 1. Organization ──────────────────────────────────────────────────────────

export function buildOrganizationSchema(contact: ContactPoint) {
  return {
    '@type': 'Organization',
    '@id': siteUrl('/#organization'),
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.organization.legalName,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: siteUrl('/images/logo.png'),
      width: 300,
      height: 60,
    },
    foundingYear: SITE_CONFIG.foundingYear,
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: contact.email ?? SITE_CONFIG.organization.email,
      telephone: contact.telephone,
      contactType: contact.contactType,
      availableLanguage: contact.availableLanguage,
      areaServed: contact.areaServed,
    },
    sameAs: [
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.instagram,
    ],
  }
}

// ─── 2. WebSite + SearchAction ────────────────────────────────────────────────
// SearchAction: Perplexity ve ChatGPT bu schema'yı okuyarak
// "DesireMap'te arama yap" entegrasyonu yapabiliyor.

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': siteUrl('/#website'),
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description:
      'Deutschlands führendes Verzeichnis für verifizierte Erwachsenenclubs, FKK-Anlagen und diskrete Locations – mit direkter Reservierung.',
    publisher: { '@id': siteUrl('/#organization') },
    inLanguage: SITE_CONFIG.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: siteUrl('/suche?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── 3. WebPage ───────────────────────────────────────────────────────────────

export function buildWebPageSchema(params: {
  url: string
  name: string
  description: string
  breadcrumbId: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
}) {
  return {
    '@type': 'WebPage',
    '@id': `${params.url}#webpage`,
    url: params.url,
    name: params.name,
    description: params.description,
    isPartOf: { '@id': siteUrl('/#website') },
    inLanguage: SITE_CONFIG.language,
    breadcrumb: { '@id': params.breadcrumbId },
    ...(params.imageUrl && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: params.imageUrl,
      },
    }),
    ...(params.datePublished && { datePublished: params.datePublished }),
    ...(params.dateModified && { dateModified: params.dateModified }),
  }
}

// ─── 4. BreadcrumbList ────────────────────────────────────────────────────────

export function buildBreadcrumbSchema(items: BreadcrumbItem[], pageUrl: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  }
}

// ─── 5. LocalBusiness / EntertainmentBusiness (Venue) ────────────────────────
// KRITIK: Google'ın GEO eşleştirmesi için geo koordinatlar zorunlu.
// adult: true yerine amenityFeature + ageRestriction kullanıyoruz.

export function buildVenueSchema(venue: VenueDetail) {
  const categoryConfig = CATEGORY_CONFIG[venue.category]
  const pageUrl = siteUrl(`/location/${venue.slug}`)

  return {
    '@type': categoryConfig.schemaType,
    '@id': `${pageUrl}#venue`,
    name: venue.name,
    url: pageUrl,
    description: venue.description,
    image: venue.images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url,
      width: img.width,
      height: img.height,
      ...(img.caption && { caption: img.caption }),
    })),
    address: buildPostalAddressSchema(venue.address),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.latitude,
      longitude: venue.geo.longitude,
    },
    ...(venue.telephone && { telephone: venue.telephone }),
    ...(venue.email && { email: venue.email }),
    openingHoursSpecification: buildOpeningHoursSchema(venue.openingHours),
    amenityFeature: venue.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    ...(venue.aggregateRating && {
      aggregateRating: buildAggregateRatingSchema(venue.aggregateRating),
    }),
    ...(venue.priceRange && { priceRange: venue.priceRange }),
    // Adult content signal — pornografi değil, yetişkin mekan bildirimi
    audience: {
      '@type': 'Audience',
      audienceType: 'Adult',
      requiredMinAge: 18,
    },
    isPartOf: { '@id': siteUrl('/#organization') },
    ...(venue.foundingYear && { foundingDate: String(venue.foundingYear) }),
    ...(venue.maximumCapacity && { maximumAttendeeCapacity: venue.maximumCapacity }),
  }
}

// ─── 6. ItemList (kategori ve şehir sayfaları için) ──────────────────────────

export function buildItemListSchema(venues: VenueSummary[], listName: string) {
  return {
    '@type': 'ItemList',
    name: listName,
    numberOfItems: venues.length,
    itemListElement: venues.map((venue, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': CATEGORY_CONFIG[venue.category].schemaType,
        '@id': siteUrl(`/location/${venue.slug}#venue`),
        name: venue.name,
        url: siteUrl(`/location/${venue.slug}`),
        ...(venue.thumbnailUrl && {
          image: { '@type': 'ImageObject', url: venue.thumbnailUrl },
        }),
        ...(venue.ratingValue &&
          venue.reviewCount && {
            aggregateRating: buildAggregateRatingSchema({
              ratingValue: venue.ratingValue,
              reviewCount: venue.reviewCount,
            }),
          }),
      },
    })),
  }
}

// ─── 7. FAQPage ───────────────────────────────────────────────────────────────
// GEO için en kritik schema — AI sistemleri bu içeriği doğrudan alıntılar.
// Her soru en az 40 kelime cevap içermeli.

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─── 8. Article / Guide ───────────────────────────────────────────────────────

export function buildArticleSchema(params: {
  url: string
  title: string
  description: string
  authorName: string
  authorUrl: string
  publishedAt: string
  lastModified: string
  wordCount: number
  imageUrl?: string
}) {
  return {
    '@type': 'Article',
    '@id': `${params.url}#article`,
    headline: params.title,
    description: params.description,
    url: params.url,
    author: {
      '@type': 'Person',
      name: params.authorName,
      url: params.authorUrl,
    },
    publisher: { '@id': siteUrl('/#organization') },
    datePublished: params.publishedAt,
    dateModified: params.lastModified,
    wordCount: params.wordCount,
    inLanguage: SITE_CONFIG.language,
    ...(params.imageUrl && {
      image: { '@type': 'ImageObject', url: params.imageUrl },
    }),
    isPartOf: { '@id': siteUrl('/#website') },
  }
}

// ─── Yardımcı builder'lar ─────────────────────────────────────────────────────

function buildPostalAddressSchema(address: PostalAddress) {
  return {
    '@type': 'PostalAddress',
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    postalCode: address.postalCode,
    ...(address.addressRegion && { addressRegion: address.addressRegion }),
    addressCountry: address.addressCountry,
  }
}

function buildOpeningHoursSchema(hours: OpeningHoursEntry[]) {
  return hours.map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: entry.dayOfWeek.map(
      (day) => `https://schema.org/${day}`
    ),
    opens: entry.opens,
    closes: entry.closes,
  }))
}

function buildAggregateRatingSchema(rating: AggregateRating) {
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: rating.bestRating ?? 5,
    worstRating: rating.worstRating ?? 1,
  }
}
