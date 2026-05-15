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

export interface OperatorLoginResponse {
  operatorPublicId: string
  sessionToken: string
  expiresAt: string
  requirePasswordReset: boolean
}

export interface OperatorVenuePayload {
  cityId: number
  name: string
  addressLine: string
  website?: string
  publicEmail?: string
  publicPhone?: string
  generalNote?: string
  reservationNote?: string
  checkinNote?: string
  serviceTypeIds: number[]
  policy?: {
    maxActivePendingPerMember?: number
    maxActiveTotalPerMember?: number
    maxOverlappingActiveReservations?: number
    requireVerifiedPhoneForReservation?: boolean
    requireVerifiedPhoneForCheckin?: boolean
    pendingReviewTtlHours?: number
    lateCancelThresholdMinutes?: number
    note?: string
  }
}

export interface OperatorEventPayload {
  title: string
  description?: string
  startAt: string
  endAt: string
  reservationMode?: string
  requiresForm?: boolean
  capacityTotal?: number
  generalNote?: string
  visibility?: string
  customerCancellationAllowed?: boolean
  customerCancellationCutoffMinutes?: number
  checkinOtpPolicy?: string
}

export const backendApi = {
  operatorLogin: (email: string, password: string) =>
    backendFetch<OperatorLoginResponse>('/operator-auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  requestMemberOtp: (contactType: string, contactValue: string, purpose?: string) =>
    backendFetch<{ maskedContactValue: string; purpose: string; expiresAt: string }>(
      '/member-auth/request-otp',
      { method: 'POST', body: { contactType, contactValue, purpose } }
    ),

  verifyMemberOtp: (contactType: string, contactValue: string, code: string, purpose?: string) =>
    backendFetch<{ memberPublicId: string; sessionToken: string; expiresAt: string }>(
      '/member-auth/verify-otp',
      { method: 'POST', body: { contactType, contactValue, code, purpose } }
    ),

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

  listBusinessOperators: (businessPublicId: string, token: string) =>
    backendFetch<unknown[]>(`/operator/businesses/${businessPublicId}/operators`, { token }),

  createVenue: (businessPublicId: string, token: string, data: OperatorVenuePayload) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/venues`, {
      method: 'POST',
      token,
      body: data,
    }),

  createEvent: (businessPublicId: string, venuePublicId: string, token: string, data: OperatorEventPayload) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/venues/${venuePublicId}/events`, {
      method: 'POST',
      token,
      body: data,
    }),

  getOperatorEventDetail: (
    businessPublicId: string,
    venuePublicId: string,
    eventPublicId: string,
    token: string
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/venues/${venuePublicId}/events/${eventPublicId}`, {
      token,
    }),

  publishEvent: (
    businessPublicId: string,
    venuePublicId: string,
    eventPublicId: string,
    token: string,
    data: { expectedLockVersion: number; reasonCode?: string; note?: string }
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/venues/${venuePublicId}/events/${eventPublicId}/publish`, {
      method: 'POST',
      token,
      body: data,
    }),

  cancelEvent: (
    businessPublicId: string,
    venuePublicId: string,
    eventPublicId: string,
    token: string,
    data: { expectedLockVersion: number; reasonCode?: string; note?: string }
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/venues/${venuePublicId}/events/${eventPublicId}/cancel`, {
      method: 'POST',
      token,
      body: data,
    }),

  disableBusinessOperator: (
    businessPublicId: string,
    operatorPublicId: string,
    token: string,
    data: { reason?: string }
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/operators/${operatorPublicId}/disable`, {
      method: 'POST',
      token,
      body: data,
    }),

  reactivateBusinessOperator: (
    businessPublicId: string,
    operatorPublicId: string,
    token: string,
    data: { venuePublicId: string; roleCode: string }
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/operators/${operatorPublicId}/reactivate`, {
      method: 'POST',
      token,
      body: data,
    }),

  deprovisionBusinessOperator: (
    businessPublicId: string,
    operatorPublicId: string,
    token: string,
    data: { reason?: string }
  ) =>
    backendFetch<unknown>(`/operator/businesses/${businessPublicId}/operators/${operatorPublicId}/deprovision`, {
      method: 'POST',
      token,
      body: data,
    }),
}
