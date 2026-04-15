/**
 * DesireMap API Client
 * ─────────────────────────────────────────────────────────────────────────────
 * NestJS backend ile iletişim. Tüm fetch çağrıları buradan geçer.
 * Cache stratejisi sayfa tipine göre burada belirlenir:
 *   - venue detail  → ISR (revalidate: 86400 = 24 saat)
 *   - search        → no-store (her zaman taze)
 *   - listings      → ISR (revalidate: 3600 = 1 saat)
 *
 * Backend arkadaşınız endpoint'leri değiştirirse sadece bu dosya güncellenir.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.desiremap.de'
const API_VERSION = 'v1'

// ─── Tip tanımları (backend DTO'larına göre güncelleyin) ──────────────────────

export interface ApiVenueSummary {
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

export interface ApiVenueDetail extends ApiVenueSummary {
  street_address: string
  address_region: string | null
  latitude: number
  longitude: number
  telephone: string | null
  email: string | null
  website: string | null
  description: string
  long_description: string | null
  images: Array<{
    url: string
    width: number
    height: number
    caption: string | null
  }>
  opening_hours: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  amenities: string[]
  founding_year: number | null
  maximum_capacity: number | null
  published_at: string
  last_modified: string
  faqs: Array<{ question: string; answer: string }>
  related_venues: ApiVenueSummary[]
}

export interface ApiSearchResult {
  venues: ApiVenueSummary[]
  total: number
  page: number
  per_page: number
  city: string | null
  query: string | null
}

export interface ApiSearchParams {
  q?: string
  city?: string
  category?: string
  page?: number
  per_page?: number
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options

  const cacheConfig: RequestInit =
    revalidate === false
      ? { cache: 'no-store' }
      : { next: { revalidate: revalidate ?? 86400 } }

  const response = await fetch(`${API_BASE_URL}/${API_VERSION}${endpoint}`, {
    ...cacheConfig,
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'de-DE',
      ...(fetchOptions.headers ?? {}),
    },
  })

  if (!response.ok) {
    // 404 → notFound() çağrısı için özel hata
    if (response.status === 404) {
      const error = new Error('NOT_FOUND') as Error & { status: number }
      error.status = 404
      throw error
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// ─── Venue endpoint'leri ──────────────────────────────────────────────────────

/**
 * Venue detay sayfası için — ISR 24 saat
 * GET /v1/venues/:slug
 */
export async function fetchVenueBySlug(slug: string): Promise<ApiVenueDetail> {
  return apiFetch<ApiVenueDetail>(`/venues/${slug}`, { revalidate: 86400 })
}

/**
 * generateStaticParams için tüm slug'lar — build time'da bir kez
 * GET /v1/venues/slugs
 */
export async function fetchAllVenueSlugs(): Promise<string[]> {
  const data = await apiFetch<{ slugs: string[] }>('/venues/slugs', {
    revalidate: 3600,
  })
  return data.slugs
}

/**
 * Arama sayfası — her zaman taze (no-store)
 * GET /v1/search?q=...&city=...&category=...&page=...
 */
export async function fetchSearch(
  params: ApiSearchParams
): Promise<ApiSearchResult> {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.city) query.set('city', params.city)
  if (params.category) query.set('category', params.category)
  if (params.page) query.set('page', String(params.page))
  if (params.per_page) query.set('per_page', String(params.per_page))

  return apiFetch<ApiSearchResult>(`/search?${query.toString()}`, {
    revalidate: false,  // no-store
  })
}
