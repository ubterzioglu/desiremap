import type { PublicCity, PublicEstablishment, PublicHeroSlide } from '@/types'
import { normalizePublicServiceTypes } from '@/lib/public-service-types'
import {
  normalizePublicCity,
  normalizePublicEstablishment,
  normalizePublicImageUrl,
} from '@/lib/backend-client'
import {
  getFallbackPublicCities,
  getFallbackPublicServiceTypes,
} from '@/lib/public-discovery-fallbacks'
import {
  getFallbackPublicStadtCities,
  getFallbackPublicStadtCity,
} from '@/lib/public-cities'
import { APP_BFF_BASE_URL, CLIENT_API_BASE_URL, PRODUCTION_PUBLIC_API_BASE_URL, joinApiUrl } from '@/lib/api-config'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: { total: number; page: number; limit: number }
}

type ApiRequestOptions = RequestInit
export interface CustomerProfileResponse {
  name?: string | null
  email?: string | null
  memberSince?: string | number | Date
  totalSpent?: number
}

export interface CustomerVisitResponse {
  id: string
  bordellName?: string
  date?: string | number | Date
  price?: number | string
  duration?: number | string
}

export interface CustomerAddressResponse {
  id: string
  label?: string
  street?: string
  zip?: string
  city?: string
  isDefault?: boolean
}

export interface CustomerBadgeResponse {
  id: string
  color?: string
  icon?: string
  name?: string
  description?: string
}



function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeEndpointWithBase(baseUrl: string, endpoint: string) {
  return joinApiUrl(baseUrl, endpoint)
}

function isLocalApiBaseUrl(baseUrl: string) {
  return /\/\/(127\.0\.0\.1|localhost)(?::\d+)?(\/|$)/.test(baseUrl)
}

function createHeaders(options: ApiRequestOptions) {
  const headers = new Headers(options.headers)

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return headers
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  const text = await response.text().catch(() => '')
  return text || null
}

function getErrorMessage(payload: unknown, response: Response) {
  if (isRecord(payload) && typeof payload.error === 'string') {
    return payload.error
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  return `HTTP ${response.status}`
}

function unwrapPayload<T>(payload: unknown): T {
  if (
    isRecord(payload) &&
    typeof payload.success === 'boolean'
  ) {
    const envelope = payload as unknown as ApiResponse<unknown>

    if (!envelope.success) {
      throw new Error(envelope.error || 'Request failed')
    }

    if (envelope.data !== undefined) {
      return envelope.data as T
    }
  }

  return payload as T
}

async function apiCallAgainstBase<T>(baseUrl: string, endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(normalizeEndpointWithBase(baseUrl, endpoint), {
    ...options,
    headers: createHeaders(options),
    cache: options.cache ?? 'no-store'
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response))
  }

  return unwrapPayload<T>(payload)
}

async function apiCall<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  return apiCallAgainstBase(CLIENT_API_BASE_URL, endpoint, options)
}

async function publicApiCall<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  if (typeof window !== 'undefined' && APP_BFF_BASE_URL.startsWith('/')) {
    try {
      return await apiCallAgainstBase(APP_BFF_BASE_URL, endpoint, options)
    } catch {
      // fall through to external/public fallback chain
    }
  }

  if (isLocalApiBaseUrl(CLIENT_API_BASE_URL) && CLIENT_API_BASE_URL !== PRODUCTION_PUBLIC_API_BASE_URL) {
    try {
      return await apiCallAgainstBase(PRODUCTION_PUBLIC_API_BASE_URL, endpoint, options)
    } catch {
      return apiCallAgainstBase(CLIENT_API_BASE_URL, endpoint, options)
    }
  }

  try {
    return await apiCall(endpoint, options)
  } catch (error) {
    if (CLIENT_API_BASE_URL === PRODUCTION_PUBLIC_API_BASE_URL) {
      throw error
    }

    return apiCallAgainstBase(PRODUCTION_PUBLIC_API_BASE_URL, endpoint, options)
  }
}

async function directPublicApiCall<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  if (isLocalApiBaseUrl(CLIENT_API_BASE_URL) && CLIENT_API_BASE_URL !== PRODUCTION_PUBLIC_API_BASE_URL) {
    try {
      return await apiCallAgainstBase(PRODUCTION_PUBLIC_API_BASE_URL, endpoint, options)
    } catch {
      return apiCallAgainstBase(CLIENT_API_BASE_URL, endpoint, options)
    }
  }

  try {
    return await apiCallAgainstBase(CLIENT_API_BASE_URL, endpoint, options)
  } catch (error) {
    if (CLIENT_API_BASE_URL === PRODUCTION_PUBLIC_API_BASE_URL) {
      throw error
    }

    return apiCallAgainstBase(PRODUCTION_PUBLIC_API_BASE_URL, endpoint, options)
  }
}

function normalizePublicHeroSlides(items: unknown[]): PublicHeroSlide[] {
  const normalized = items
    .map((item) => {
      if (!isRecord(item)) {
        return null
      }

      const raw = item as unknown as PublicHeroSlide & {
        alt_text?: string | null
        image_url?: string | null
        is_active?: boolean | null
        sort_order?: number | string | null
        updated_at?: string | null
        updated_by?: string | null
      }

      const imageUrl = normalizePublicImageUrl(raw.imageUrl ?? raw.image_url)
      if (!imageUrl) {
        return null
      }

      const rawSortOrder = raw.sortOrder ?? raw.sort_order
      const parsedSortOrder =
        typeof rawSortOrder === 'number'
          ? rawSortOrder
          : typeof rawSortOrder === 'string' && rawSortOrder.trim().length > 0
            ? Number(rawSortOrder)
            : null

      return {
        imageUrl,
        altText: raw.altText ?? raw.alt_text ?? null,
        isActive: raw.isActive ?? raw.is_active ?? true,
        sortOrder:
          parsedSortOrder !== null && Number.isFinite(parsedSortOrder)
            ? parsedSortOrder
            : null,
        updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
        updatedBy: raw.updatedBy ?? raw.updated_by ?? null,
      }
    })

  return normalized
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((left, right) => {
      const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER
      const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER
      return leftOrder - rightOrder
    })
}

export const customerApi = {
  getProfile: async () => {
    return apiCall<CustomerProfileResponse>('/customer')
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiCall<unknown>('/customer', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getVisits: async () => {
    return apiCall<CustomerVisitResponse[]>('/customer/visits')
  },

  getAddresses: async () => {
    return apiCall<CustomerAddressResponse[]>('/customer/addresses')
  },

  createAddress: async (data: {
    label: string
    street: string
    city: string
    zip: string
    country?: string
    isDefault?: boolean
  }) => {
    return apiCall<unknown>('/customer/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateAddress: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/customer/addresses', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteAddress: async (id: string) => {
    return apiCall<{ success: boolean }>(`/customer/addresses?id=${id}`, {
      method: 'DELETE'
    })
  },

  getBadges: async () => {
    return apiCall<CustomerBadgeResponse[]>('/customer/badges')
  },

  getBookings: async () => {
    return apiCall<unknown[]>('/customer/bookings')
  }
}

export const bookingApi = {
  create: async (data: {
    bordellId: string
    date: string
    time: string
    duration: number
    price: number
    notes?: string
  }) => {
    return apiCall<unknown>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  getById: async (id: string) => {
    return apiCall<unknown>(`/bookings/${id}`)
  },

  update: async (id: string, data: Record<string, unknown>) => {
    return apiCall<unknown>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  cancel: async (id: string) => {
    return apiCall<{ success: boolean }>(`/bookings/${id}`, {
      method: 'DELETE'
    })
  }
}

async function enrichPublicEstablishmentSummary(item: PublicEstablishment) {
  return normalizePublicEstablishment(item)
}

export const publicApi = {
  getHero: async () => {
    const response = await directPublicApiCall<unknown>('/public/hero')
    const items = isRecord(response) && Array.isArray(response.items)
      ? response.items
      : []

    return {
      items: normalizePublicHeroSlides(items),
    }
  },

  getCities: async () => {
    try {
      const response = await publicApiCall<{ items: PublicCity[] }>('/public/cities')

      return {
        items: Array.isArray(response.items)
          ? response.items.map(normalizePublicCity)
          : [],
      }
    } catch {
      return { items: getFallbackPublicCities() }
    }
  },

  getStadtCities: async () => {
    try {
      const response = await publicApiCall<{ items: PublicCity[] }>('/public/stadt/cities')

      return {
        items: Array.isArray(response.items)
          ? response.items.map(normalizePublicCity)
          : [],
      }
    } catch {
      return { items: getFallbackPublicStadtCities() }
    }
  },

  getStadtCity: async (slug: string) => {
    try {
      return normalizePublicCity(
        await publicApiCall<PublicCity>(`/public/stadt/cities/${encodeURIComponent(slug)}`)
      )
    } catch {
      const city = getFallbackPublicStadtCity(slug)
      if (!city) {
        throw new Error('City not found')
      }

      return city
    }
  },

  getServiceTypes: async () => {
    try {
      return { items: normalizePublicServiceTypes(await publicApiCall<unknown>('/public/service-types')) }
    } catch {
      return { items: getFallbackPublicServiceTypes() }
    }
  },

  getEstablishments: async (params?: {
    city?: string
    type?: string
    q?: string
    limit?: number
    offset?: number
  }) => {
    const qs = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') qs.append(k, String(v))
      })
    }
    const suffix = qs.toString()
    const data = await publicApiCall<{ results?: PublicEstablishment[]; items?: PublicEstablishment[]; total?: number }>(
      suffix ? `/public/establishments?${suffix}` : '/public/establishments'
    )
    const raw = Array.isArray(data.results) ? data.results : Array.isArray(data.items) ? data.items : []
    const items = await Promise.all(raw.map(enrichPublicEstablishmentSummary))
    return { items, total: typeof data.total === 'number' ? data.total : items.length }
  },

  getEstablishmentDetail: (slug: string) =>
    publicApiCall<PublicEstablishment>(`/public/establishments/${slug}`).then(normalizePublicEstablishment),
}

export const establishmentsApi = {
  search: async (params: {
    q?: string
    city?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    limit?: number
    offset?: number
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value))
      }
    })

    const suffix = searchParams.toString()
    return apiCall<{ results: unknown[]; total: number; limit: number; offset: number }>(
      suffix ? `/establishments?${suffix}` : '/establishments'
    )
  }
}
