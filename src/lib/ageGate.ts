import { isBotUserAgent } from './botDetection'

export const AGE_VERIFICATION_COOKIE_NAME = 'dm_age_verified'
export const AGE_VERIFICATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function hasAgeVerificationCookie(cookieValue: string): boolean {
  return cookieValue
    .split(';')
    .map((part) => part.trim())
    .some((part) => part === `${AGE_VERIFICATION_COOKIE_NAME}=1`)
}

export function buildAgeVerificationCookie(): string {
  return `${AGE_VERIFICATION_COOKIE_NAME}=1; path=/; max-age=${AGE_VERIFICATION_COOKIE_MAX_AGE}; SameSite=Lax; Secure`
}

export function shouldRenderAgeGate({
  hasMounted,
  hasVerifiedAge,
  userAgent,
}: {
  hasMounted: boolean
  hasVerifiedAge: boolean
  userAgent: string
}): boolean {
  if (!hasMounted) return false
  if (hasVerifiedAge) return false
  if (isBotUserAgent(userAgent)) return false
  return true
}
