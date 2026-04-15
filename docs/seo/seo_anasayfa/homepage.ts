/**
 * Ana Sayfa API Çağrıları
 * ─────────────────────────────────────────────────────────────────────────────
 * ISR: 1 saat (3600 saniye)
 * Ana sayfa verisi çok sık değişmez ama günlük aktif kalmalı.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.desiremap.de'
const API_VERSION = 'v1'

export interface ApiVenueSummaryHome {
  id: string
  slug: string
  name: string
  category: string
  city: string
  postal_code: string
  tagline: string | null
  thumbnail_url: string | null
  rating_value: number | null
  review_count: number
  is_verified: boolean
  has_reservation: boolean
  price_range: string | null
}

export interface ApiHomePageData {
  featured_venues: ApiVenueSummaryHome[]
  total_venue_count: number
  total_city_count: number
  top_cities: Array<{
    city: string
    slug: string
    venue_count: number
    thumbnail_url: string | null
  }>
  stats: {
    total_venues: number
    total_cities: number
    total_verified: number
    total_with_reservation: number
  }
}

export async function fetchHomePageData(): Promise<ApiHomePageData> {
  const res = await fetch(`${API_BASE_URL}/${API_VERSION}/homepage`, {
    next: { revalidate: 3600 },
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'de-DE',
    },
  })

  if (!res.ok) {
    throw new Error(`Homepage API error: ${res.status}`)
  }

  return res.json()
}
