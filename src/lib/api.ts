import type { PublicCity, PublicEstablishment } from '@/types'
import type { AuthSession, AuthUser } from '@/stores/authStore'
import { useAuthStore } from '@/stores/authStore'
import { normalizePublicServiceTypes } from '@/lib/public-service-types'
import { normalizePublicCity, normalizePublicEstablishment } from '@/lib/backend-client'
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

interface ApiRequestOptions extends RequestInit {
  auth?: boolean
}

interface AuthConfig {
  googleOAuth: boolean
  googleOAuthUrl?: string
}

type WorkspaceType = 'public' | 'admin'
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

export interface AdminStatsResponse {
  venues?: number
  publishedEvents?: number
  draftEvents?: number
  operators?: number
}

export interface AdminVenueResponse {
  venuePublicId: string
  venueName?: string
  name?: string
  city?: string
  status?: string
  priceMin?: number | null
  priceMax?: number | null
  price_min?: number | null
  price_max?: number | null
}

export interface AdminCreateVenuePayload {
  name: string
  addressLine: string
  cityId: number
  website?: string
  publicEmail?: string
  publicPhone?: string
  serviceTypeIds: number[]
  generalNote?: string
  priceMin?: number
  priceMax?: number
}

export interface AdminEventResponse {
  eventPublicId: string
  title?: string
  startAt: string | number | Date
  endAt: string | number | Date
  status?: string
  capacityTotal?: number
  reservedCount?: number
  reservationMode?: string
  lockVersion?: number
}

export interface AdminOperatorResponse {
  operatorPublicId: string
  displayName?: string
  invitedEmail?: string
  accountStatus?: string
  venues?: Array<{ roleCode?: string }>
}

export interface AdminBusinessResponse {
  id?: string
  public_id?: string
  businessPublicId: string
  legalName?: string
  display_name?: string
  displayName?: string
  billing_email?: string
  billingEmail?: string
  billingPhone?: string
  accountStatus?: string
  status?: string
  createdAt?: string | number | Date
  operators?: AdminOperatorResponse[]
}

export interface AdminCityResponse {
  cityId: number
  name: string
  slug: string
  venueCount?: number
  publicImageUrl?: string | null
  publicHeroImageUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  publicSubtitle?: Record<string, string | null> | null
  publicDescription?: Record<string, string | null> | null
  seoTitle?: Record<string, string | null> | null
  seoDescription?: Record<string, string | null> | null
  isPublicActive?: boolean
  sortOrder?: number | null
}

export interface AdminCityPayload {
  name?: string
  slug?: string
  publicImageUrl?: string | null
  publicHeroImageUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  publicSubtitle?: Record<string, string | null> | null
  publicDescription?: Record<string, string | null> | null
  seoTitle?: Record<string, string | null> | null
  seoDescription?: Record<string, string | null> | null
  isPublicActive?: boolean
  sortOrder?: number | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeEndpoint(endpoint: string) {
  return joinApiUrl(CLIENT_API_BASE_URL, endpoint)
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

  if (options.auth !== false) {
    const token = useAuthStore.getState().token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
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

function normalizeUser(payload: unknown): AuthUser {
  if (!isRecord(payload)) {
    throw new Error('API user payload missing')
  }

  const operatorPublicId = typeof payload.operatorPublicId === 'string' ? payload.operatorPublicId : undefined

  return {
    id: String(payload.id ?? ''),
    email: String(payload.email ?? ''),
    name: typeof payload.name === 'string' ? payload.name : null,
    role: String(payload.role ?? 'customer').toLowerCase(),
    status: String(payload.status ?? 'active').toLowerCase(),
    avatar: typeof payload.avatar === 'string' ? payload.avatar : null,
    workspace: payload.workspace === 'admin' ? 'admin' : 'public',
    ...(operatorPublicId === undefined ? {} : { operatorPublicId }),
    businessAccountPublicId: typeof payload.businessAccountPublicId === 'string' ? payload.businessAccountPublicId : null,
    requirePasswordReset: payload.requirePasswordReset === true
  }
}

function normalizeAuthSession(payload: unknown): AuthSession {
  if (!isRecord(payload)) {
    throw new Error('API login payload missing')
  }

  const token =
    typeof payload.accessToken === 'string'
      ? payload.accessToken
      : typeof payload.token === 'string'
        ? payload.token
        : typeof payload.authToken === 'string'
          ? payload.authToken
          : null

  const userPayload = isRecord(payload.user)
    ? payload.user
    : isRecord(payload.data) && isRecord(payload.data.user)
      ? payload.data.user
      : null

  if (!token || !userPayload) {
    throw new Error('API login response must include token and user')
  }

  return {
    token,
    user: normalizeUser(userPayload)
  }
}

function normalizeAuthConfig(payload: unknown): AuthConfig {
  if (!isRecord(payload)) {
    return { googleOAuth: false }
  }

  const googleOAuthUrl = typeof payload.googleOAuthUrl === 'string'
    ? payload.googleOAuthUrl
    : typeof payload.googleAuthUrl === 'string'
      ? payload.googleAuthUrl
      : undefined

  return {
    googleOAuth: payload.googleOAuth === true || Boolean(googleOAuthUrl),
    ...(googleOAuthUrl === undefined ? {} : { googleOAuthUrl })
  }
}

function getFallbackGoogleOAuthUrl() {
  return normalizeEndpoint('/auth/google')
}

export const authApi = {
  login: async (
    data: { email: string; password: string },
    workspace: WorkspaceType = 'public'
  ) => {
    const payload = await apiCall<unknown>('/auth/login', {
      method: 'POST',
      auth: false,
      headers: {
        'X-Desiremap-Workspace': workspace
      },
      body: JSON.stringify(data)
    })

    return normalizeAuthSession(payload)
  },

  register: async (data: {
    email: string
    password: string
    name?: string
    phone?: string
  }) => {
    return apiCall<{ id: string; email: string; name: string; role: string }>('/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(data)
    })
  },

  me: async () => {
    const payload = await apiCall<unknown>('/auth/me')
    const userPayload = isRecord(payload) && isRecord(payload.user) ? payload.user : payload
    return normalizeUser(userPayload)
  },

  logout: async () => {
    return apiCall<{ success: boolean; message?: string }>('/auth/logout', {
      method: 'POST'
    })
  },

  getConfig: async () => {
    try {
      const payload = await apiCall<unknown>('/auth/config', { auth: false })
      const config = normalizeAuthConfig(payload)

      if (config.googleOAuth && !config.googleOAuthUrl) {
        return { ...config, googleOAuthUrl: getFallbackGoogleOAuthUrl() }
      }

      return config
    } catch {
      return { googleOAuth: false }
    }
  },

  getGoogleLoginUrl: async () => {
    const config = await authApi.getConfig()
    return config.googleOAuthUrl || getFallbackGoogleOAuthUrl()
  }
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
  getCities: async () => {
    try {
      const response = await publicApiCall<{ items: PublicCity[] }>('/public/cities', { auth: false })

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
      const response = await publicApiCall<{ items: PublicCity[] }>('/public/stadt/cities', { auth: false })

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
        await publicApiCall<PublicCity>(`/public/stadt/cities/${encodeURIComponent(slug)}`, { auth: false })
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
      return { items: normalizePublicServiceTypes(await publicApiCall<unknown>('/public/service-types', { auth: false })) }
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
      suffix ? `/public/establishments?${suffix}` : '/public/establishments',
      { auth: false }
    )
    const raw = Array.isArray(data.results) ? data.results : Array.isArray(data.items) ? data.items : []
    const items = await Promise.all(raw.map(enrichPublicEstablishmentSummary))
    return { items, total: typeof data.total === 'number' ? data.total : items.length }
  },

  getEstablishmentDetail: (slug: string) =>
    publicApiCall<PublicEstablishment>(`/public/establishments/${slug}`, { auth: false }).then(normalizePublicEstablishment),
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

export const adminApi = {
  getDashboardSnapshot: async () => {
    return apiCall<AdminStatsResponse>('/admin/stats')
  },

  getVenues: async () => {
    return apiCall<AdminVenueResponse[]>('/admin/venues').then((venues) =>
      (Array.isArray(venues) ? venues : []).map((venue) => ({
        ...venue,
        priceMin: venue.priceMin ?? venue.price_min ?? null,
        priceMax: venue.priceMax ?? venue.price_max ?? null,
      }))
    )
  },

  createVenue: async (data: AdminCreateVenuePayload) => {
    return apiCall<AdminVenueResponse>('/admin/venues', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  getVenueEvents: async (venuePublicId: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set('venuePublicId', venuePublicId)
    return apiCall<AdminEventResponse[]>(`/admin/events?${searchParams.toString()}`)
  },

  getEventDetail: async (venuePublicId: string, eventPublicId: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set('venuePublicId', venuePublicId)
    searchParams.set('eventPublicId', eventPublicId)
    return apiCall<AdminEventResponse>(`/admin/event-detail?${searchParams.toString()}`)
  },

  createEvent: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  publishEvent: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/events', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  cancelEvent: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/events', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getBusinessOperators: async () => {
    return apiCall<AdminOperatorResponse[]>('/admin/operators')
  },

  disableBusinessOperator: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/operators', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  reactivateBusinessOperator: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/operators', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deprovisionBusinessOperator: async (data: Record<string, unknown>) => {
    return apiCall<unknown>('/admin/operators', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getBusinesses: async () => {
    const data = await apiCall<{ items: AdminBusinessResponse[] }>('/admin/businesses')
    return data.items ?? []
  },

  createBusiness: async (data: {
    legalName: string
    displayName: string
    billingEmail: string
    billingPhone?: string
  }) => {
    return apiCall<unknown>('/admin/businesses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  createOperator: async (businessId: string, data: {
    email: string
    password: string
    displayName: string
  }) => {
    return apiCall<unknown>(`/admin/businesses/${businessId}/operators`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  getCities: async () => {
    const data = await apiCall<{ items: AdminCityResponse[] }>('/admin/cities')
    return data.items ?? []
  },

  createCity: async (data: AdminCityPayload & { name: string; slug: string }) => {
    return apiCall<AdminCityResponse>('/admin/cities', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateCity: async (cityId: number, data: AdminCityPayload) => {
    return apiCall<AdminCityResponse>(`/admin/cities/${cityId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteCity: async (cityId: number) => {
    return apiCall<unknown>(`/admin/cities/${cityId}`, {
      method: 'DELETE'
    })
  }
}

export const seedApi = {
  seed: async () => {
    return apiCall<{ success: boolean; message: string; data: unknown }>('/seed', {
      method: 'POST'
    })
  }
}
