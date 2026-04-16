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
}
