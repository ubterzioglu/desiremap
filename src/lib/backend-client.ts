import type { PublicCity, PublicEstablishment } from '@/types'
import { SERVER_BACKEND_API_URL } from '@/lib/api-config'
import { normalizePublicServiceTypes } from '@/lib/public-service-types'

const BACKEND_URL = SERVER_BACKEND_API_URL

export function normalizePublicImageUrl(value: string | null | undefined) {
  if (typeof value !== 'string' || value.length === 0) {
    return null
  }

  if (value.startsWith('/')) {
    return value
  }

  try {
    const url = new URL(value)

    if (url.hostname.endsWith('.local')) {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

function normalizeNullableNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function normalizePublicCity(item: PublicCity): PublicCity {
  const raw = item as PublicCity & {
    count?: number | string | null
    venue_count?: number | string | null
    venueCount?: number | string | null
    public_image_url?: string | null
    publicImageUrl?: string | null
  }
  const id = Number(raw.id ?? raw.cityId)
  const normalizedId = Number.isFinite(id) ? id : 0
  const cityId = raw.cityId ?? (normalizedId > 0 ? normalizedId : null)

  return {
    ...item,
    id: normalizedId,
    ...(cityId !== null ? { cityId } : {}),
    venueCount: normalizeNullableNumber(raw.venueCount ?? raw.venue_count ?? raw.count) ?? 0,
    image:
      normalizePublicImageUrl(raw.image)
      ?? normalizePublicImageUrl(raw.publicImageUrl)
      ?? normalizePublicImageUrl(raw.public_image_url),
    latitude: normalizeNullableNumber(raw.latitude),
    longitude: normalizeNullableNumber(raw.longitude),
    subtitle: raw.subtitle ?? {},
    description: raw.description ?? {},
    seoTitle: raw.seoTitle ?? {},
    seoDescription: raw.seoDescription ?? {},
    isActive: raw.isActive ?? true,
    sortOrder: normalizeNullableNumber(raw.sortOrder),
  }
}

export function normalizePublicEstablishment(item: PublicEstablishment): PublicEstablishment {
  const raw = item as PublicEstablishment & {
    cover_image_url?: string | null
    coverImage?: string | null
    hero_image_url?: string | null
    heroImage?: string | null
    is_active?: boolean
    price_min?: number | string | null
    price_max?: number | string | null
    public_hero_image_url?: string | null
    publicHeroImageUrl?: string | null
    public_image_url?: string | null
    publicImageUrl?: string | null
    thumbnail_url?: string | null
    thumbnailUrl?: string | null
  }

  const images = Array.isArray(item.images)
    ? item.images
        .map((image) => normalizePublicImageUrl(image))
        .filter((image): image is string => typeof image === 'string' && image.length > 0)
    : []

  const primaryImage =
    normalizePublicImageUrl(raw.image)
      ?? normalizePublicImageUrl(raw.publicHeroImageUrl)
      ?? normalizePublicImageUrl(raw.public_hero_image_url)
      ?? normalizePublicImageUrl(raw.publicImageUrl)
      ?? normalizePublicImageUrl(raw.public_image_url)
      ?? normalizePublicImageUrl(raw.coverImage)
      ?? normalizePublicImageUrl(raw.cover_image_url)
      ?? normalizePublicImageUrl(raw.thumbnailUrl)
      ?? normalizePublicImageUrl(raw.thumbnail_url)
      ?? normalizePublicImageUrl(raw.heroImage)
      ?? normalizePublicImageUrl(raw.hero_image_url)

  return {
    ...item,
    image: primaryImage,
    images,
    priceMin: normalizeNullableNumber(raw.priceMin ?? raw.price_min),
    priceMax: normalizeNullableNumber(raw.priceMax ?? raw.price_max),
    isActive: raw.isActive ?? raw.is_active ?? true,
  }
}

export async function backendFetch<T>(
  endpoint: string,
  options: {
    method?: string
    body?: unknown
    token?: string | null
  } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const requestInit: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  }

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body)
  }

  const response = await fetch(url, requestInit)

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : payload && typeof payload === 'string'
          ? payload
          : `Backend ${response.status}`
    throw new Error(message)
  }

  return payload as T
}



export const backendApi = {
  getPublicCities: () =>
    backendFetch<{ items: PublicCity[] }>('/public/cities'),

  getPublicStadtCities: () =>
    backendFetch<{ items: PublicCity[] }>('/public/stadt/cities').then((response) => ({
      items: Array.isArray(response.items)
        ? response.items.map(normalizePublicCity)
        : [],
    })),

  getPublicStadtCity: (slug: string) =>
    backendFetch<PublicCity>(`/public/stadt/cities/${encodeURIComponent(slug)}`).then(
      normalizePublicCity
    ),

  getPublicServiceTypes: async () => ({
    items: normalizePublicServiceTypes(await backendFetch<unknown>('/public/service-types'))
  }),

  getPublicEstablishments: (params?: {
    city?: string
    type?: string
    q?: string
    limit?: number
    offset?: number
  }) => {
    const qs = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) qs.append(k, String(v))
      })
    }
    const suffix = qs.toString()
    return backendFetch<{ results: PublicEstablishment[]; total: number }>(
      suffix ? `/public/establishments?${suffix}` : '/public/establishments'
    ).then((response) => ({
      ...response,
      results: Array.isArray(response.results)
        ? response.results.map(normalizePublicEstablishment)
        : [],
    }))
  },

  getPublicEstablishmentDetail: (slug: string) =>
    backendFetch<PublicEstablishment>(`/public/establishments/${slug}`).then(normalizePublicEstablishment),

  getPublicVenueEvents: (venuePublicId: string) =>
    backendFetch<{
      items: Array<{
        eventPublicId: string
        title: string
        description: string | null
        startAt: string
        endAt: string
        status: string
        reservationMode: string
        capacityTotal: number | null
        reservedCount: number
        requiresForm: boolean
        visibility: string
        customerCancellationAllowed: boolean
        customerCancellationCutoffMinutes: number | null
        checkinOtpPolicy: string
      }>
    }>(`/public/venues/${venuePublicId}/events`),

}
