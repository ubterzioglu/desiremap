/**
 * Get localized search path - handles localePrefix: 'as-needed' for German
 */
export function getSearchPath(locale: string, params?: { q?: string; city?: string; category?: string }): string {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set('q', params.q)
  if (params?.city) searchParams.set('city', params.city)
  if (params?.category) searchParams.set('category', params.category)
  
  const queryString = searchParams.toString()
  const basePath = locale === 'de' ? '/search' : `/${locale}/search`
  
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Get localized venue detail path - handles localePrefix: 'as-needed' for German
 */
export function getVenuePath(locale: string, slug: string): string {
  const basePath = `/venue/${slug}`

  if (locale === 'de') {
    return basePath
  }

  return `/${locale}${basePath}`
}

export function getCityPath(locale: string, slug: string): string {
  const basePath = `/stadt/${slug}`

  if (locale === 'de') {
    return basePath
  }

  return `/${locale}${basePath}`
}

/**
 * Get localized path - handles localePrefix: 'as-needed' for German
 */
export function getLocalizedPath(locale: string, path: string): string {
  if (locale === 'de' && !path.startsWith('/')) {
    return `/${path}`
  }
  if (locale === 'de') {
    return path
  }
  return `/${locale}${path.startsWith('/') ? '' : '/'}${path}`
}
