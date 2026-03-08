import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken, DecodedToken } from './paseto'
import { isRevoked } from './blacklist'

/**
 * Authentication result
 */
export interface AuthResult {
  success: true
  user: DecodedToken
}

export interface AuthError {
  success: false
  error: string
  status: number
}

/**
 * Require authentication for an API route
 * Returns user payload or error response
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  const token = extractToken(request)

  if (!token) {
    return {
      success: false,
      error: 'Authentication required',
      status: 401
    }
  }

  try {
    const payload = await verifyToken(token)

    if (isRevoked(payload.jti)) {
      return {
        success: false,
        error: 'Token has been revoked',
        status: 401
      }
    }

    return {
      success: true,
      user: payload
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid token'
    return {
      success: false,
      error: message,
      status: 401
    }
  }
}

/**
 * Require specific role(s) for an API route
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<AuthResult | AuthError> {
  const authResult = await requireAuth(request)

  if (!authResult.success) {
    return authResult
  }

  if (!allowedRoles.includes(authResult.user.role)) {
    return {
      success: false,
      error: 'Insufficient permissions',
      status: 403
    }
  }

  return authResult
}

/**
 * Require admin role
 */
export async function requireAdmin(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  return requireRole(request, ['admin'])
}

/**
 * Require owner or admin role
 */
export async function requireOwnerOrAdmin(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  return requireRole(request, ['owner', 'admin'])
}

/**
 * Helper to create unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Helper to create forbidden response
 */
export function forbiddenResponse(message = 'Insufficient permissions'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

/**
 * Check if user owns a resource (by comparing user ID)
 */
export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId
}
