import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken } from '@/lib/auth/paseto'
import { revokeToken } from '@/lib/auth/blacklist'

/**
 * POST /api/auth/logout
 * Revokes the current token and clears auth cookie
 */
export async function POST(request: NextRequest) {
  try {
    // Extract token from request
    const token = extractToken(request)

    if (token) {
      try {
        // Verify and decode token to get JTI
        const payload = await verifyToken(token)

        // Add JTI to blacklist
        revokeToken(payload.jti)
      } catch {
        // Token already invalid, just proceed with logout
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear auth cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
