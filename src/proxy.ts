import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { detectBot } from '@/lib/botDetection'
import { routing } from '@/i18n/routing'

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

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  const [first, second] = parts

  if (parts.length !== 4 || first === undefined || second === undefined) return true
  if (first === 0 || first === 10 || first === 127) return true
  if (first === 100 && second >= 64 && second <= 127) return true
  if (first === 169 && second === 254) return true
  if (first === 172 && second >= 16 && second <= 31) return true
  if (first === 192 && second === 168) return true
  if (first === 198 && (second === 18 || second === 19)) return true

  return false
}

function isPrivateIpv6(ip: string): boolean {
  const normalizedIp = ip.toLowerCase()

  if (normalizedIp === '::' || normalizedIp === '::1') return true
  if (normalizedIp.startsWith('fc') || normalizedIp.startsWith('fd')) return true
  if (/^fe[89ab]/.test(normalizedIp)) return true

  return false
}

function normalizeIpToken(token: string): string {
  const trimmed = token.trim().replace(/^for=/i, '').replace(/^"|"$/g, '')

  if (trimmed.startsWith('[')) {
    return trimmed.replace(/^\[([^\]]+)\](?::\d+)?$/, '$1')
  }

  return trimmed
}

function isIpv6Candidate(ip: string): boolean {
  return ip.includes(':') && /^[a-f0-9:]+$/i.test(ip)
}

function extractIpCandidates(value: string | null): string[] {
  if (!value) return []

  return value
    .split(',')
    .flatMap((part) => part.split(';'))
    .flatMap((part) => {
      const ipv4Matches = part.match(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g)
      if (ipv4Matches) return ipv4Matches

      const normalized = normalizeIpToken(part)
      return isIpv6Candidate(normalized) ? [normalized] : []
    })
}

function resolveClientIp(headers: Headers): string | null {
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('true-client-ip'),
    headers.get('x-forwarded-for'),
    headers.get('x-real-ip'),
    headers.get('forwarded'),
  ].flatMap(extractIpCandidates)

  return candidates.find((candidate) => (
    candidate.includes(':')
      ? !isPrivateIpv6(candidate)
      : !isPrivateIpv4(candidate)
  )) ?? null
}

function normalizeBackendUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

function shouldTrackPageView(request: NextRequest): boolean {
  const { pathname } = request.nextUrl
  const method = request.method.toUpperCase()

  if (method !== 'GET' && method !== 'HEAD') return false
  if (pathname === '/api' || pathname.startsWith('/api/')) return false
  if (pathname.startsWith('/_next/')) return false
  if (pathname.startsWith('/.well-known/')) return false
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') return false
  if (/\/google.*\.html$/i.test(pathname)) return false

  const lastSegment = pathname.split('/').pop() ?? ''
  return !lastSegment.includes('.')
}

function hasEmptyUserAgent(request: NextRequest): boolean {
  return !(request.headers.get('user-agent')?.trim() ?? '')
}

async function trackPageView(
  request: NextRequest,
  backendUrl: string,
  token: string,
): Promise<void> {
  const ua = request.headers.get('user-agent')?.trim() ?? ''
  const ip = resolveClientIp(request.headers)

  try {
    await fetch(`${normalizeBackendUrl(backendUrl)}/internal/page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': token,
      },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        method: request.method,
        ip,
        userAgent: ua,
        referer: request.headers.get('referer') ?? null,
        botName: detectBot(ua),
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // intentional no-op — tracking must never block page rendering
  }
}

function schedulePageViewTracking(request: NextRequest, event: NextFetchEvent | undefined): void {
  const backendUrl = process.env.BACKEND_API_URL
  const token = process.env.INTERNAL_TRACKING_TOKEN

  if (event && backendUrl && token && shouldTrackPageView(request)) {
    event.waitUntil(trackPageView(request, backendUrl, token))
  }
}

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (hasEmptyUserAgent(request)) {
    schedulePageViewTracking(request, event)
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (request.headers.get('accept')?.includes('text/markdown')) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('_path', pathname)
    return NextResponse.rewrite(url)
  }

  const segment = pathname.split('/')[1]
  const hasLocalePrefix = segment !== undefined && (locales as readonly string[]).includes(segment)

  if (hasLocalePrefix) {
    if (segment === defaultLocale) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/${defaultLocale}`, '') || '/'
      return NextResponse.redirect(url, 308)
    }
    return intlMiddleware(request)
  }

  schedulePageViewTracking(request, event)

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|images|covers|.*\\..*).*)'
  ]
}
