/**
 * Middleware — Locale Routing
 * ─────────────────────────────────────────────────────────────────────────────
 * `de` (default) → prefix YOK  → desiremap.de/venue/pascha-koln
 * `en`           → prefix VAR  → desiremap.de/en/venue/pascha-koln
 *
 * Next.js App Router'da `[locale]` klasörü olduğu için middleware
 * gerçek URL ile dosya sistemi arasındaki köprüyü kurar.
 *
 * Kütüphane bağımlılığı yok — vanilla Next.js ile çalışır.
 */

import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['de', 'en'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const DEFAULT_LOCALE: Locale = 'de'

// Bu path'ler locale routing'den muaf — statik dosyalar, API, vs.
const PUBLIC_PATHS = [
  '/api/',
  '/_next/',
  '/favicon',
  '/robots.txt',
  '/sitemap',
  '/images/',
  '/icons/',
]

function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1]
  return SUPPORTED_LOCALES.includes(segment as Locale)
    ? (segment as Locale)
    : null
}

function getLocaleFromAcceptHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
  return SUPPORTED_LOCALES.includes(preferred as Locale)
    ? (preferred as Locale)
    : DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Statik ve sistem path'lerini atla
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const localeInPath = getLocaleFromPath(pathname)

  // /en/... → zaten locale prefix'i var, rewrite et
  if (localeInPath && localeInPath !== DEFAULT_LOCALE) {
    const rewritten = request.nextUrl.clone()
    rewritten.pathname = pathname // app/[locale]/... dosyasına gider
    return NextResponse.rewrite(rewritten)
  }

  // /en/... yerine /de/... gelirse default'a yönlendir
  if (localeInPath === DEFAULT_LOCALE) {
    const redirected = request.nextUrl.clone()
    redirected.pathname = pathname.replace(`/${DEFAULT_LOCALE}`, '') || '/'
    return NextResponse.redirect(redirected, 308)
  }

  // Prefix yok → default locale (de) olarak app/[locale]/... rewrite et
  const rewritten = request.nextUrl.clone()
  rewritten.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.rewrite(rewritten)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static
     * - _next/image
     * - static files (favicon, robots, sitemap, images)
     */
    '/((?!api|_next/static|_next/image|favicon|robots|sitemap|images|icons).*)',
  ],
}
