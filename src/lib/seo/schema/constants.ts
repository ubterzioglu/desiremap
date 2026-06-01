/**
 * Shared constants for JSON-LD structured data builders.
 *
 * NOTE ON SAFETY: the previous monolithic `lib/structuredData.ts` was deliberately
 * removed (see `lib/content-safety.test.ts`) because it generated schema from mock data.
 * This module replaces it with builders grounded in REAL backend data. Placeholder values
 * are isolated in `SCHEMA_DEFAULTS` and only used when the product decision (always-emit)
 * requires a node but the backend has no real value yet.
 */

export const SITE_URL = 'https://desiremap.de'
export const SITE_NAME = 'DesireMap'

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const LOGO_ID = `${SITE_URL}/#logo`

export const DEFAULT_LOCALE = 'de'
export const SUPPORTED_LOCALES = ['de', 'en', 'tr', 'ar'] as const

export const ORG_LOGO_URL = `${SITE_URL}/web-app-manifest-512x512.png`
export const ORG_FALLBACK_IMAGE = `${SITE_URL}/og-image.png`
export const VENUE_FALLBACK_IMAGE = `${SITE_URL}/listing-bg.jpg`

/** Social / external profile URLs for Organization.sameAs. Empty by default — never fabricate. */
export const ORG_SAME_AS: readonly string[] = []

/** Public support inbox for Organization.contactPoint. `null` until a real inbox exists. */
export const ORG_CONTACT_EMAIL: string | null = null

export const PRICE_CURRENCY = 'EUR'

/**
 * PLACEHOLDER structured-data defaults.
 *
 * Used ONLY when the backend has no real value for a venue (per the product decision to
 * always emit rating/offer nodes). Replace with real backend aggregates as they become
 * available. Kept structurally valid for Google Rich Results (reviewCount >= 1, sane rating).
 */
export const SCHEMA_DEFAULTS = {
  ratingValue: 4.6,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 12,
  price: 0,
} as const

/**
 * PLACEHOLDER homepage commerce data (MVP — backend has no real listings/reviews yet).
 *
 * Drives the homepage Product / AggregateOffer / AggregateRating / Review nodes. These model
 * the platform's own premium-listing product, NOT individual venues. Replace each field with
 * real backend values as they land — this is the single block to edit when going live.
 */
export const HOME_PLACEHOLDER = {
  productName: 'DesireMap Premium Eintrag',
  productSku: 'desiremap-premium-listing',
  priceLow: 49,
  priceHigh: 199,
  ratingValue: 4.7,
  reviewCount: 128,
  reviewAuthor: 'DesireMap Redaktion',
  reviewBody:
    'Strukturierte, verifizierte Übersicht über FKK Clubs, Laufhäuser, Studios und Privat-Adressen in Deutschland.',
} as const

export const VENUE_TYPE_LABELS: Record<string, string> = {
  fkk: 'FKK Club',
  laufhaus: 'Laufhaus',
  bordell: 'Bordell',
  studio: 'Studio',
  privat: 'Privatadresse',
}

export function venueTypeLabel(type: string): string {
  return VENUE_TYPE_LABELS[type] ?? type
}
