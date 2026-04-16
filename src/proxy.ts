import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { isAdminHostname } from '@/lib/admin-config'

const intlMiddleware = createMiddleware(routing)

const { defaultLocale, locales } = routing

const PUBLIC_PATHS = [
  '/api/',
  '/_next/',
  '/favicon',
  '/robots.txt',
  '/sitemap',
  '/images/',
  '/covers/',
  '/icon.svg',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')

  if (isAdminHostname(host)) {
    const segment = pathname.split('/')[1]
    const hasLocalePrefix = (locales as readonly string[]).includes(segment)

    if (pathname === '/') {
      return NextResponse.next()
    }

    if (hasLocalePrefix) {
      const url = request.nextUrl.clone()
      const strippedPath = pathname.replace(`/${segment}`, '') || '/'
      url.pathname = strippedPath
      return NextResponse.redirect(url, 308)
    }

    return NextResponse.next()
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  const segment = pathname.split('/')[1]
  const hasLocalePrefix = (locales as readonly string[]).includes(segment)

  if (hasLocalePrefix) {
    if (segment === defaultLocale) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/${defaultLocale}`, '') || '/'
      return NextResponse.redirect(url, 308)
    }
    return intlMiddleware(request)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|images|covers|.*\\..*).*)'
  ]
}
