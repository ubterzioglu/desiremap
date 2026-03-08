import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken } from '@/lib/auth/paseto'
import { isRevoked } from '@/lib/auth/blacklist'
import { db } from '@/lib/db'

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from request
    const token = extractToken(request)

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    let payload
    try {
      payload = await verifyToken(token)
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if token is revoked
    if (isRevoked(payload.jti)) {
      return NextResponse.json(
        { error: 'Token has been revoked' },
        { status: 401 }
      )
    }

    // Get fresh user data from database
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        memberSince: true,
        lastLogin: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is banned
    if (user.status === 'BANNED') {
      return NextResponse.json(
        { error: 'Account has been banned' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.toLowerCase(),
        status: user.status.toLowerCase(),
        memberSince: user.memberSince,
        lastLogin: user.lastLogin,
        emailVerified: !!user.emailVerified
      }
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
