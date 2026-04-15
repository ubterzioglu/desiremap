import type { AuthSession, AuthUser } from '@/stores/authStore'
import { useAuthStore } from '@/stores/authStore'

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

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeEndpoint(endpoint: string) {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedEndpoint}` : normalizedEndpoint
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

async function apiCall<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(normalizeEndpoint(endpoint), {
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

function normalizeUser(payload: unknown): AuthUser {
  if (!isRecord(payload)) {
    throw new Error('API user payload missing')
  }

  return {
    id: String(payload.id ?? ''),
    email: String(payload.email ?? ''),
    name: typeof payload.name === 'string' ? payload.name : null,
    role: String(payload.role ?? 'customer').toLowerCase(),
    status: String(payload.status ?? 'active').toLowerCase(),
    avatar: typeof payload.avatar === 'string' ? payload.avatar : null
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
    googleOAuthUrl
  }
}

function getFallbackGoogleOAuthUrl() {
  return normalizeEndpoint('/auth/google')
}

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const payload = await apiCall<unknown>('/auth/login', {
      method: 'POST',
      auth: false,
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
    return apiCall<any>('/customer')
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiCall<any>('/customer', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getVisits: async () => {
    return apiCall<any[]>('/customer/visits')
  },

  getAddresses: async () => {
    return apiCall<any[]>('/customer/addresses')
  },

  createAddress: async (data: {
    label: string
    street: string
    city: string
    zip: string
    country?: string
    isDefault?: boolean
  }) => {
    return apiCall<any>('/customer/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateAddress: async (data: any) => {
    return apiCall<any>('/customer/addresses', {
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
    return apiCall<any[]>('/customer/badges')
  },

  getBookings: async () => {
    return apiCall<any[]>('/customer/bookings')
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
    return apiCall<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  getById: async (id: string) => {
    return apiCall<any>(`/bookings/${id}`)
  },

  update: async (id: string, data: any) => {
    return apiCall<any>(`/bookings/${id}`, {
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
    return apiCall<{ results: any[]; total: number; limit: number; offset: number }>(
      suffix ? `/establishments?${suffix}` : '/establishments'
    )
  }
}

export const adminApi = {
  getStats: async () => {
    return apiCall<any>('/admin/stats')
  },

  getEstablishments: async (params?: { status?: string; type?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value)
        }
      })
    }

    const suffix = searchParams.toString()
    return apiCall<any[]>(suffix ? `/admin/establishments?${suffix}` : '/admin/establishments')
  },

  createEstablishment: async (data: any) => {
    return apiCall<any>('/admin/establishments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateEstablishment: async (data: any) => {
    return apiCall<any>('/admin/establishments', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteEstablishment: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/establishments?id=${id}`, {
      method: 'DELETE'
    })
  },

  getCustomers: async (params?: { status?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value)
        }
      })
    }

    const suffix = searchParams.toString()
    return apiCall<any[]>(suffix ? `/admin/customers?${suffix}` : '/admin/customers')
  },

  updateCustomer: async (data: any) => {
    return apiCall<any>('/admin/customers', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteCustomer: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/customers?id=${id}`, {
      method: 'DELETE'
    })
  },

  getBookings: async (params?: { status?: string; bordellId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value)
        }
      })
    }

    const suffix = searchParams.toString()
    return apiCall<any[]>(suffix ? `/admin/bookings?${suffix}` : '/admin/bookings')
  },

  updateBooking: async (data: any) => {
    return apiCall<any>('/admin/bookings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getReviews: async (params?: { status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) {
      searchParams.append('status', params.status)
    }

    const suffix = searchParams.toString()
    return apiCall<any[]>(suffix ? `/admin/reviews?${suffix}` : '/admin/reviews')
  },

  updateReview: async (data: any) => {
    return apiCall<any>('/admin/reviews', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteReview: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/reviews?id=${id}`, {
      method: 'DELETE'
    })
  }
}

export const seedApi = {
  seed: async () => {
    return apiCall<{ success: boolean; message: string; data: any }>('/seed', {
      method: 'POST'
    })
  }
}
