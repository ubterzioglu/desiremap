/**
 * Auth Module - PASETO v4 + Google OAuth
 *
 * This module provides secure authentication using PASETO v4 tokens
 * and Google OAuth for customers.
 *
 * @example
 * // Login
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password })
 * })
 *
 * @example
 * // Google OAuth
 * window.location.href = '/api/auth/google'
 *
 * @example
 * // Protected API route
 * import { requireAdmin } from '@/lib/auth/guards'
 *
 * export async function GET(request: NextRequest) {
 *   const auth = await requireAdmin(request)
 *   if (!auth.success) {
 *     return NextResponse.json({ error: auth.error }, { status: auth.status })
 *   }
 *   // auth.user is now available
 * }
 */

// PASETO Token Service
export {
  generateToken,
  verifyToken,
  extractToken,
  getCookieOptions,
  type TokenPayload,
  type DecodedToken
} from './paseto'

// Password Service
export { hash, verify as verifyPassword, needsRehash } from './password'

// Token Blacklist
export { revokeToken, isRevoked } from './blacklist'

// Auth Guards
export {
  requireAuth,
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin,
  unauthorizedResponse,
  forbiddenResponse,
  isOwner,
  type AuthResult,
  type AuthError
} from './guards'

// Google OAuth
export {
  generateOAuthState,
  getAuthUrl,
  exchangeCode,
  getUserInfo,
  type GoogleUser,
  type OAuthState
} from './oauth/google'
