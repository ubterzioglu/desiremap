import { V4 } from 'paseto'
import { randomUUID } from 'crypto'
import { createPublicKey, createPrivateKey, KeyObject } from 'crypto'

/**
 * PASETO v4 Token Service
 *
 * Uses asymmetric encryption (Public/Private) for maximum security.
 * Ed25519 key pair from PASETO_PUBLIC_KEY and PASETO_PRIVATE_KEY env variables.
 *
 * @see https://github.com/paseto-standard/paseto-spec
 */

const TOKEN_EXPIRY = '7d' // 7 days
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export interface TokenPayload {
  sub: string      // User ID
  role: string     // customer | owner | admin
  email: string    // User email
  jti?: string     // Unique token ID for revocation (auto-generated)
}

export interface DecodedToken extends TokenPayload {
  jti: string      // Unique token ID (always present in decoded tokens)
  iat: string      // Issued at (ISO string)
  exp: string      // Expiration (ISO string)
}

/**
 * Get the private key for signing tokens
 */
function getPrivateKey(): KeyObject {
  const key = process.env.PASETO_PRIVATE_KEY

  if (!key) {
    throw new Error('PASETO_PRIVATE_KEY environment variable is not set')
  }

  // Convert base64 to PEM format
  const pem = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`
  return createPrivateKey(pem)
}

/**
 * Get the public key for verifying tokens
 */
function getPublicKey(): KeyObject {
  const key = process.env.PASETO_PUBLIC_KEY

  if (!key) {
    throw new Error('PASETO_PUBLIC_KEY environment variable is not set')
  }

  // Convert base64 to PEM format
  const pem = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`
  return createPublicKey(pem)
}

/**
 * Generate a new PASETO token
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
  const key = getPrivateKey()
  const jti = payload.jti || randomUUID()

  const token = await V4.sign(
    {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      jti,
      iat: new Date().toISOString()
    },
    key,
    {
      expiresIn: TOKEN_EXPIRY,
      issuer: 'desiremap.de',
      audience: 'desiremap.de'
    }
  )

  return token
}

/**
 * Verify and decode a PASETO token
 * Returns decoded payload or throws if invalid/expired
 */
export async function verifyToken(token: string): Promise<DecodedToken> {
  const key = getPublicKey()

  try {
    const payload = await V4.verify(token, key, {
      issuer: 'desiremap.de',
      audience: 'desiremap.de',
      clockTolerance: '1m'
    })

    return payload as unknown as DecodedToken
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw new Error('Token expired')
      }
      if (error.message.includes('invalid')) {
        throw new Error('Invalid token')
      }
    }
    throw new Error('Token verification failed')
  }
}

/**
 * Extract token from Authorization header or cookie
 */
export function extractToken(request: Request): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Check cookie
  const cookie = request.headers.get('cookie')
  if (cookie) {
    const match = cookie.match(/auth_token=([^;]+)/)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Generate cookie options for setting auth token
 */
export function getCookieOptions(): {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path: string
  maxAge: number
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE
  }
}
