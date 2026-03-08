import { NextResponse } from 'next/server'
import { generateOAuthState, getAuthUrl } from '@/lib/auth/oauth/google'

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow - redirects to Google consent screen
 */
export async function GET(request: Request) {
  try {
    // Generate state and PKCE parameters
    const state = generateOAuthState()
    const authUrl = getAuthUrl(state)

    // Create response with redirect
    const response = NextResponse.redirect(authUrl)

    // Store state and codeVerifier in HTTP-only cookies for security
    // These will be verified in the callback
    response.cookies.set('oauth_state', state.state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600 // 10 minutes
    })

    response.cookies.set('oauth_code_verifier', state.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600 // 10 minutes
    })

    return response
  } catch (error) {
    console.error('Google OAuth init error:', error)
    return NextResponse.redirect(
      new URL('/de/login?error=oauth_failed', request.url)
    )
  }
}
