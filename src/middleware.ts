import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth/paseto'
import { isRevoked } from './lib/auth/blacklist'

/**
 * Route configuration for middleware
 */
const protectedRoutes = {
  // Admin routes - require ADMIN role
  admin: {
    paths: ['/de/admin', '/en/admin', '/tr/admin', '/ar/admin'],
    roles: ['admin']
  },
  // Dashboard routes - require authentication (any role)
  dashboard: {
    paths: ['/de/dashboard', '/en/dashboard', '/tr/dashboard', '/ar/dashboard'],
    roles: ['customer', 'owner', 'admin']
  },
  // Owner routes - require OWNER or ADMIN role
  owner: {
    paths: ['/de/owner', '/en/owner', '/tr/owner', '/ar/owner'],
    roles: ['owner', 'admin']
  }
}

const authRoutes = ['/de/login', '/en/login', '/tr/login', '/ar/login',
                    '/de/register', '/en/register', '/tr/register', '/ar/register']

/**
 * Middleware for authentication and authorization
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value

  // Check if it's an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If user has token and tries to access auth routes, redirect to dashboard
  if (token && isAuthRoute) {
    try {
      const payload = await verifyToken(token)
      if (!isRevoked(payload.jti)) {
        // User is authenticated, redirect to dashboard
        const locale = pathname.split('/')[1] || 'de'
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
      }
    } catch {
      // Invalid token, proceed to login page
    }
  }

  // Check if route requires authentication
  let requiredRoles: string[] | null = null

  for (const [, config] of Object.entries(protectedRoutes)) {
    if (config.paths.some(path => pathname.startsWith(path))) {
      requiredRoles = config.roles
      break
    }
  }

  // If route doesn't require auth, proceed
  if (!requiredRoles) {
    return NextResponse.next()
  }

  // No token - redirect to login
  if (!token) {
    const locale = pathname.split('/')[1] || 'de'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  let payload
  try {
    payload = await verifyToken(token)
  } catch {
    const locale = pathname.split('/')[1] || 'de'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('error', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  // Check if token is revoked
  if (isRevoked(payload.jti)) {
    const locale = pathname.split('/')[1] || 'de'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('error', 'session_revoked')
    return NextResponse.redirect(loginUrl)
  }

  // Check role authorization
  if (!requiredRoles.includes(payload.role)) {
    const locale = pathname.split('/')[1] || 'de'
    return NextResponse.redirect(new URL(`/${locale}?error=unauthorized`, request.url))
  }

  // Add user info to headers for API routes
  const response = NextResponse.next()
  response.headers.set('x-user-id', payload.sub)
  response.headers.set('x-user-role', payload.role)
  response.headers.set('x-user-email', payload.email)

  return response
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    // Match all routes except static files, api, images, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|images|covers|.*\\.(?:jpg|jpeg|png|webp|svg|gif|ico|woff|woff2)).*)'
  ]
}
