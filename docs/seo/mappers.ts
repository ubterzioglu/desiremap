/**
 * DesireMap Schema Mappers
 * ─────────────────────────────────────────────────────────────────────────────
 * NestJS API response'larını schema data contract'larına dönüştürür.
 * Anti-corruption layer: backend değişirse sadece bu dosya güncellenir.
 *
 * NOT: Bu dosyadaki tip isimleri (ApiVenueDetailResponse vb.) sizin
 * NestJS DTO'larınızın gerçek field adlarına göre güncellenmelidir.
 * Örnek olarak generic isimler kullanıldı.
 */

import type {
  VenueDetail,
  VenueSummary,
  PostalAddress,
  GeoCoordinates,
  OpeningHoursEntry,
  VenueCategory,
  DayOfWeek,
  HomePageSchemaData,
  ListingPageSchemaData,
  CityPageSchemaData,
  CategoryPageSchemaData,
  BreadcrumbItem,
  FaqItem,
} from '../types/schema.types'
import { SITE_CONFIG, CATEGORY_CONFIG } from '../utils/constants'

// ─── API response tipleri (NestJS DTO'larınıza göre güncelleyin) ──────────────

// Bu interface'leri backend DTO'larınızla eşleştirin.
// Field adları farklıysa sadece mapper fonksiyonundaki mapping'i düzenleyin.

export interface ApiVenueSummaryResponse {
  id: string
  slug: string
  name: string
  category: string
  city: string
  postal_code: string
  tagline?: string
  thumbnail_url?: string
  rating_value?: number
  review_count?: number
  is_verified: boolean
  has_reservation: boolean
  price_range?: string
}

export interface ApiVenueDetailResponse extends ApiVenueSummaryResponse {
  street_address: string
  address_region?: string
  latitude: number
  longitude: number
  telephone?: string
  email?: string
  website?: string
  description: string
  long_description?: string
  images: Array<{
    url: string
    width: number
    height: number
    caption?: string
  }>
  opening_hours: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  amenities: string[]
  founding_year?: number
  maximum_capacity?: number
}

export interface ApiHomePageResponse {
  featured_venues: ApiVenueSummaryResponse[]
  total_venue_count: number
  total_city_count: number
  faqs: Array<{ question: string; answer: string }>
}

export interface ApiCityPageResponse {
  city: string
  city_slug: string
  federal_state: string
  latitude: number
  longitude: number
  venues: ApiVenueSummaryResponse[]
  total_count: number
  category_breakdown: Array<{ category: string; count: number }>
  faqs: Array<{ question: string; answer: string }>
}

// ─── Mapper fonksiyonları ─────────────────────────────────────────────────────

export function mapVenueSummary(api: ApiVenueSummaryResponse): VenueSummary {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    category: api.category as VenueCategory,
    city: api.city,
    postalCode: api.postal_code,
    tagline: api.tagline,
    thumbnailUrl: api.thumbnail_url,
    ratingValue: api.rating_value,
    reviewCount: api.review_count,
    isVerified: api.is_verified,
    hasReservation: api.has_reservation,
    priceRange: api.price_range as VenueSummary['priceRange'],
  }
}

export function mapVenueDetail(api: ApiVenueDetailResponse): VenueDetail {
  return {
    ...mapVenueSummary(api),
    address: {
      streetAddress: api.street_address,
      addressLocality: api.city,
      postalCode: api.postal_code,
      addressRegion: api.address_region,
      addressCountry: 'DE',
    },
    geo: {
      latitude: api.latitude,
      longitude: api.longitude,
    },
    telephone: api.telephone,
    email: api.email,
    website: api.website,
    description: api.description,
    longDescription: api.long_description,
    images: api.images,
    openingHours: api.opening_hours.map((h) => ({
      dayOfWeek: h.days as DayOfWeek[],
      opens: h.opens,
      closes: h.closes,
    })),
    amenities: api.amenities,
    foundingYear: api.founding_year,
    maximumCapacity: api.maximum_capacity,
  }
}

export function mapHomePageData(
  api: ApiHomePageResponse,
  faqs: FaqItem[]
): HomePageSchemaData {
  return {
    pageType: 'homepage',
    siteUrl: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'de-DE',
    tagline: 'Deutschlands führendes Verzeichnis für verifizierte Erwachsenenclubs',
    description:
      'DesireMap ist Deutschlands führendes Verzeichnis für verifizierte Erwachsenenclubs, FKK-Anlagen und diskrete Locations – ohne explizite Inhalte, mit direkter Reservierungsmöglichkeit.',
    longDescription:
      'DesireMap bündelt verifizierte Informationen zu Bordellen, FKK-Clubs, Swingerclubs und Escortservices in ganz Deutschland. Alle aufgeführten Locations werden manuell geprüft, arbeiten legal und verfügen über transparente Öffnungszeiten sowie direkte Buchungsmöglichkeit.',
    totalVenueCount: api.total_venue_count,
    totalCityCount: api.total_city_count,
    featuredVenues: api.featured_venues.map(mapVenueSummary),
    faqs,
    contact: {
      email: SITE_CONFIG.organization.email,
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
      areaServed: ['DE'],
    },
    foundingYear: SITE_CONFIG.foundingYear,
    sameAs: [SITE_CONFIG.social.twitter, SITE_CONFIG.social.instagram],
  }
}

export function mapCityPageData(api: ApiCityPageResponse): CityPageSchemaData {
  const categorySlug = CATEGORY_CONFIG

  const breadcrumbs: BreadcrumbItem[] = [
    { position: 1, name: 'DesireMap', item: SITE_CONFIG.url },
    {
      position: 2,
      name: `Clubs in ${api.city}`,
      item: `${SITE_CONFIG.url}/stadt/${api.city_slug}`,
    },
  ]

  return {
    pageType: 'city',
    siteUrl: SITE_CONFIG.url,
    locale: 'de-DE',
    city: api.city,
    citySlug: api.city_slug,
    federalState: api.federal_state,
    geo: { latitude: api.latitude, longitude: api.longitude },
    description: `Alle verifizierten Clubs und Locations in ${api.city} auf DesireMap. ${api.total_count} geprüfte Adressen mit Öffnungszeiten und direkter Reservierung.`,
    longDescription: `In ${api.city} finden Sie auf DesireMap eine kuratierte Auswahl an verifizierten Erwachsenenlocations. Ob FKK-Club, Sauna-Club oder Bordell – alle aufgeführten Betriebe arbeiten legal, verfügen über transparente Öffnungszeiten und bieten diskrete Buchungsmöglichkeiten. DesireMap verzichtet bewusst auf explizite Inhalte und legt den Fokus auf sachliche, geprüfte Informationen.`,
    totalCount: api.total_count,
    categoryBreakdown: api.category_breakdown.map((c) => ({
      category: c.category as VenueCategory,
      count: c.count,
    })),
    venues: api.venues.map(mapVenueSummary),
    faqs: api.faqs,
    breadcrumbs,
  }
}

export function mapListingPageData(
  api: ApiVenueDetailResponse,
  related: ApiVenueSummaryResponse[],
  faqs: FaqItem[],
  publishedAt: string,
  lastModified: string
): ListingPageSchemaData {
  const venue = mapVenueDetail(api)
  const config = CATEGORY_CONFIG[venue.category]

  const breadcrumbs: BreadcrumbItem[] = [
    { position: 1, name: 'DesireMap', item: SITE_CONFIG.url },
    {
      position: 2,
      name: config.plural,
      item: `${SITE_CONFIG.url}/${config.slug}`,
    },
    {
      position: 3,
      name: venue.city,
      item: `${SITE_CONFIG.url}/stadt/${venue.city.toLowerCase()}`,
    },
    {
      position: 4,
      name: venue.name,
      item: `${SITE_CONFIG.url}/location/${venue.slug}`,
    },
  ]

  return {
    pageType: 'listing',
    siteUrl: SITE_CONFIG.url,
    locale: 'de-DE',
    venue,
    relatedVenues: related.map(mapVenueSummary),
    faqs,
    breadcrumbs,
    publishedAt,
    lastModified,
  }
}
