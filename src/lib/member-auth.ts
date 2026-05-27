export function resolveGoogleClientId(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }

  const clientId = value
    .split(',')
    .map((entry) => entry.trim())
    .find((entry) => entry.length > 0)

  return clientId ?? null
}

export function getPostAuthRedirect(locale: string) {
  return locale === 'de' ? '/' : `/${locale}`
}
