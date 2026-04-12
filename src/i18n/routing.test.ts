import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

import middleware from '../../middleware'
import { getSearchPath } from '@/lib/navigation'
import { readFileSync } from 'node:fs'

function runRootRequest(options?: {
  acceptLanguage?: string
  localeCookie?: string
}) {
  const headers = new Headers()

  if (options?.acceptLanguage) {
    headers.set('accept-language', options.acceptLanguage)
  }

  if (options?.localeCookie) {
    headers.set('cookie', `NEXT_LOCALE=${options.localeCookie}`)
  }

  return middleware(new NextRequest('https://desiremap.de/', { headers }))
}

function readLocalFile(relativePathFromThisFile: string) {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('locale middleware root routing', () => {
  test('keeps the root path unprefixed for Turkish browser language', () => {
    const response = runRootRequest({ acceptLanguage: 'tr' })

    expect(response?.headers.get('location')).toBeNull()
  })

  test('keeps the root path unprefixed even when NEXT_LOCALE is Turkish', () => {
    const response = runRootRequest({ localeCookie: 'tr' })

    expect(response?.headers.get('location')).toBeNull()
  })

  test('builds clean German search URLs without locale prefix', () => {
    expect(getSearchPath('de')).toBe('/search')
    expect(getSearchPath('de', { city: 'Berlin' })).toBe('/search?city=Berlin')
    expect(getSearchPath('de', { q: 'spa', city: 'Berlin' })).toBe('/search?q=spa&city=Berlin')
  })

  test('middleware matcher covers unprefixed search routes in production', () => {
    const source = readLocalFile('../../middleware.ts')

    expect(source).not.toContain("matcher: ['/', '/(de|en|ar|tr)/:path*']")
    expect(source).toContain('/((?!api|_next/static|_next/image')
  })

  test('search page state updates use shared search path helper', () => {
    const source = readLocalFile('../app/[locale]/search/hooks/useSearchPage.ts')

    expect(source).toContain("import { getSearchPath } from '@/lib/navigation'")
    expect(source).toContain('router.push(getSearchPath(locale')
    expect(source).not.toContain("router.push(`/${locale}/search")
  })
})
