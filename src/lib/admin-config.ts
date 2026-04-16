export const ADMIN_HOSTNAME = process.env.NEXT_PUBLIC_ADMIN_HOST || 'admin.desiremap.de'

export function isAdminHostname(hostname: string | null | undefined) {
  if (!hostname) {
    return false
  }

  const normalizedHost = hostname.toLowerCase().split(':')[0]
  const adminHost = ADMIN_HOSTNAME.toLowerCase().split(':')[0]
  return normalizedHost === adminHost
}

export function getConfiguredBusinessAccountPublicId() {
  return process.env.BUSINESS_ACCOUNT_PUBLIC_ID || process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_PUBLIC_ID || null
}

export function getConfiguredVenuePublicId() {
  return process.env.DEFAULT_OPERATOR_VENUE_PUBLIC_ID || process.env.NEXT_PUBLIC_DEFAULT_OPERATOR_VENUE_PUBLIC_ID || null
}
