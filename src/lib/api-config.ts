function collapseDuplicatedApiSegments(value: string) {
  return value.replace(/(?:\/api){2,}(?=\/|$|\?)/g, '/api')
}

export function normalizeApiBaseUrl(value: string) {
  const trimmedValue = value.replace(/\/+$/, '')

  if (!trimmedValue) {
    return ''
  }

  if (!/^https?:\/\//.test(trimmedValue)) {
    return collapseDuplicatedApiSegments(trimmedValue)
  }

  try {
    const url = new URL(trimmedValue)
    url.pathname = collapseDuplicatedApiSegments(url.pathname)
    return url.toString().replace(/\/+$/, '')
  } catch {
    return collapseDuplicatedApiSegments(trimmedValue)
  }
}

export function joinApiUrl(baseUrl: string, endpoint: string) {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return collapseDuplicatedApiSegments(baseUrl ? `${baseUrl}${normalizedEndpoint}` : normalizedEndpoint)
}

export const APP_BFF_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_APP_API_URL || '/api'
)

export const CLIENT_API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || APP_BFF_BASE_URL
)

export const SERVER_BACKEND_API_URL = normalizeApiBaseUrl(
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.desiremap.de/api'
)
