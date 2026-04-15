/**
 * DesireMap Schema Type System
 * ─────────────────────────────────────────────────────────────────────────────
 * Domain-driven type definitions for all 5 page types.
 * NestJS DTO'larınızdan bu tiplere map edin — sıkı ayrım kasıtlı.
 *
 * Page types:
 *   1. Homepage      → HomePageSchemaData
 *   2. Category      → CategoryPageSchemaData
 *   3. City          → CityPageSchemaData
 *   4. Listing       → ListingPageSchemaData
 *   5. Guide         → GuidePageSchemaData
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export type Locale = 'de-DE' | 'de-AT' | 'de-CH'

export type VenueCategory =
  | 'fkk-club'
  | 'bordell'
  | 'escort'
  | 'privat-party'
  | 'sauna-club'
  | 'swinger-club'

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

// ─── Shared sub-types ─────────────────────────────────────────────────────────

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface PostalAddress {
  streetAddress: string
  addressLocality: string   // Stadt
  postalCode: string
  addressRegion?: string    // Bundesland
  addressCountry: 'DE' | 'AT' | 'CH'
}

export interface OpeningHoursEntry {
  dayOfWeek: DayOfWeek[]
  opens: string   // 'HH:MM'
  closes: string  // 'HH:MM'
}

export interface AggregateRating {
  ratingValue: number     // 1.0 – 5.0
  reviewCount: number
  bestRating?: number     // default 5
  worstRating?: number    // default 1
}

export interface VenueImage {
  url: string
  width: number
  height: number
  caption?: string
}

export interface ContactPoint {
  telephone?: string
  email?: string
  contactType: 'customer service' | 'reservations' | 'general'
  availableLanguage: string[]
  areaServed: string[]    // ISO 3166-2 region codes: ['DE', 'AT']
}

export interface BreadcrumbItem {
  position: number
  name: string
  item: string  // full URL
}

// ─── Venue (core entity) ──────────────────────────────────────────────────────
// NestJS entity'nizden map edilen — field isimleri kasıtlı olarak
// backend'den bağımsız tutuldu (anti-corruption layer).

export interface VenueSummary {
  id: string
  slug: string
  name: string
  category: VenueCategory
  city: string
  postalCode: string
  tagline?: string
  thumbnailUrl?: string
  ratingValue?: number
  reviewCount?: number
  isVerified: boolean
  hasReservation: boolean
  priceRange?: '€' | '€€' | '€€€'
}

export interface VenueDetail extends VenueSummary {
  address: PostalAddress
  geo: GeoCoordinates
  telephone?: string
  email?: string
  website?: string
  description: string          // 150-300 kelime, SEO odaklı
  longDescription?: string     // Listing sayfası için 500+ kelime
  images: VenueImage[]
  openingHours: OpeningHoursEntry[]
  amenities: string[]          // ['Parkplatz', 'Barrierefrei', 'Duschen', ...]
  aggregateRating?: AggregateRating
  foundingYear?: number
  maximumCapacity?: number
}

// ─── FAQ (GEO için kritik) ────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string  // Min 40 kelime — AI citation için
}

// ─── Sayfa tiplerine özel data contract'ları ──────────────────────────────────

export interface HomePageSchemaData {
  pageType: 'homepage'
  siteUrl: string
  siteName: string
  locale: Locale
  tagline: string
  description: string        // 150-160 karakter, meta description
  longDescription: string    // İlk paragraf: min 40 kelime
  totalVenueCount: number
  totalCityCount: number
  featuredVenues: VenueSummary[]
  faqs: FaqItem[]
  contact: ContactPoint
  foundingYear: number
  sameAs: string[]           // Social media URLs
}

export interface CategoryPageSchemaData {
  pageType: 'category'
  siteUrl: string
  locale: Locale
  category: VenueCategory
  categoryLabel: string      // 'FKK Clubs', 'Bordelle', ...
  description: string
  longDescription: string    // Min 200 kelime
  totalCount: number
  venues: VenueSummary[]
  cityBreakdown: Array<{ city: string; count: number; slug: string }>
  faqs: FaqItem[]
  breadcrumbs: BreadcrumbItem[]
}

export interface CityPageSchemaData {
  pageType: 'city'
  siteUrl: string
  locale: Locale
  city: string
  citySlug: string
  federalState: string       // 'Bayern', 'NRW', ...
  geo: GeoCoordinates        // Şehir merkezi koordinatı
  description: string
  longDescription: string    // Min 300 kelime — şehir + kategori context'i
  totalCount: number
  categoryBreakdown: Array<{ category: VenueCategory; count: number }>
  venues: VenueSummary[]
  faqs: FaqItem[]
  breadcrumbs: BreadcrumbItem[]
  nearbyCity?: Array<{ city: string; slug: string; distanceKm: number }>
}

export interface ListingPageSchemaData {
  pageType: 'listing'
  siteUrl: string
  locale: Locale
  venue: VenueDetail
  relatedVenues: VenueSummary[]
  faqs: FaqItem[]
  breadcrumbs: BreadcrumbItem[]
  lastModified: string   // ISO 8601
  publishedAt: string    // ISO 8601
}

export interface GuidePageSchemaData {
  pageType: 'guide'
  siteUrl: string
  locale: Locale
  slug: string
  title: string
  description: string
  longDescription: string
  authorName: string
  authorUrl: string
  publishedAt: string
  lastModified: string
  wordCount: number
  faqs: FaqItem[]
  breadcrumbs: BreadcrumbItem[]
  relatedGuides?: Array<{ title: string; slug: string }>
  relatedVenues?: VenueSummary[]
}

// ─── Union type — composer'lar için ───────────────────────────────────────────

export type PageSchemaData =
  | HomePageSchemaData
  | CategoryPageSchemaData
  | CityPageSchemaData
  | ListingPageSchemaData
  | GuidePageSchemaData
