import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, getUserInfo } from '@/lib/auth/oauth/google'
import { generateToken, getCookieOptions } from '@/lib/auth/paseto'
import { db } from '@/lib/db'

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        new URL('/de/login?error=oauth_denied', request.url)
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/de/login?error=invalid_request', request.url)
      )
    }

    // Get stored state and code verifier from cookies
    const storedState = request.cookies.get('oauth_state')?.value
    const codeVerifier = request.cookies.get('oauth_code_verifier')?.value

    // Verify state to prevent CSRF
    if (!storedState || state !== storedState) {
      return NextResponse.redirect(
        new URL('/de/login?error=state_mismatch', request.url)
      )
    }

    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL('/de/login?error=missing_verifier', request.url)
      )
    }

    // Exchange code for access token
    const { accessToken } = await exchangeCode(code, codeVerifier)

    // Get user info from Google
    const googleUser = await getUserInfo(accessToken)

    // Find or create user in database
    let user = await db.user.findUnique({
      where: { googleId: googleUser.id }
    })

    if (!user) {
      // Check if user exists with this email
      user = await db.user.findUnique({
        where: { email: googleUser.email }
      })

      if (user) {
        // Link Google account to existing user
        user = await db.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.id,
            emailVerified: googleUser.emailVerified ? new Date() : user.emailVerified,
            avatar: user.avatar || googleUser.picture,
            lastLogin: new Date()
          }
        })
      } else {
        // Create new user (CUSTOMER role for OAuth)
        user = await db.user.create({
          data: {
            email: googleUser.email,
            googleId: googleUser.id,
            name: googleUser.name,
            avatar: googleUser.picture,
            role: 'CUSTOMER',
            status: 'ACTIVE',
            emailVerified: googleUser.emailVerified ? new Date() : null,
            lastLogin: new Date()
          }
        })
      }
    } else {
      // Update last login
      user = await db.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          avatar: user.avatar || googleUser.picture
        }
      })
    }

    // Check if user is banned
    if (user.status === 'BANNED') {
      return NextResponse.redirect(
        new URL('/de/login?error=account_banned', request.url)
      )
    }

    // Generate PASETO token
    const token = await generateToken({
      sub: user.id,
      role: user.role.toLowerCase(),
      email: user.email
    })

    // Create redirect response
    const response = NextResponse.redirect(
      new URL('/de/dashboard', request.url)
    )

    // Set auth cookie
    const cookieOptions = getCookieOptions()
    response.cookies.set('auth_token', token, cookieOptions)

    // Clear OAuth state cookies
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')

    return response
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/de/login?error=oauth_failed', request.url)
    )
  }
}
