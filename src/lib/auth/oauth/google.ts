import { randomUUID, randomBytes, createHash } from 'crypto'

/**
 * Google OAuth 2.0 Service
 *
 * Implements PKCE (Proof Key for Code Exchange) for enhanced security.
 * PKCE prevents authorization code interception attacks.
 *
 * @see https://developers.google.com/identity/protocols/oauth2
 */

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export interface GoogleUser {
  id: string
  email: string
  emailVerified: boolean
  name?: string
  picture?: string
}

export interface OAuthState {
  state: string
  codeVerifier: string
  codeChallenge: string
}

/**
 * Generate PKCE code verifier (43-128 characters)
 */
function generateCodeVerifier(): string {
  return randomBytes(32)
    .toString('base64url')
    .slice(0, 43) // 43 characters is minimum recommended
}

/**
 * Generate PKCE code challenge from verifier
 */
function generateCodeChallenge(verifier: string): string {
  return createHash('sha256')
    .update(verifier)
    .digest('base64url')
}

/**
 * Generate OAuth state and PKCE parameters
 * Store these in session/cookie before redirecting
 */
export function generateOAuthState(): OAuthState {
  const state = randomUUID()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  return { state, codeVerifier, codeChallenge }
}

/**
 * Get Google OAuth authorization URL
 */
export function getAuthUrl(state: OAuthState): string {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error('Google OAuth credentials not configured')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: state.state,
    code_challenge: state.codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent'
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCode(
  code: string,
  codeVerifier: string
): Promise<{ accessToken: string; refreshToken?: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth credentials not configured')
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString()
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Google token exchange failed:', error)
    throw new Error('Failed to exchange authorization code')
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token
  }
}

/**
 * Get user info from Google using access token
 */
export async function getUserInfo(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to get user info from Google')
  }

  const data = await response.json()

  return {
    id: data.sub,
    email: data.email,
    emailVerified: data.email_verified === true,
    name: data.name,
    picture: data.picture
  }
}
