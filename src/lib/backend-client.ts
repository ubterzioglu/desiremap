import type { PublicCity, PublicEstablishment, PublicServiceType } from '@/types'

const BACKEND_URL = (process.env.BACKEND_API_URL || 'https://api.desiremap.de/api').replace(/\/+$/, '')

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

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

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

  getPublicServiceTypes: () =>
    backendFetch<{ items: PublicServiceType[] }>('/public/service-types'),

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
    )
  },

  getPublicEstablishmentDetail: (slug: string) =>
    backendFetch<PublicEstablishment>(`/public/establishments/${slug}`),

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
