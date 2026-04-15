import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

import { proxy } from '../proxy'
import { getSearchPath, getVenuePath } from '@/lib/navigation'
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

  return proxy(new NextRequest('https://desiremap.de/', { headers }))
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

  test('builds clean venue URLs without locale prefix for German', () => {
    expect(getVenuePath('de', 'pascha-koln')).toBe('/venue/pascha-koln')
    expect(getVenuePath('en', 'pascha-koln')).toBe('/en/venue/pascha-koln')
  })

  test('middleware matcher covers unprefixed search routes in production', () => {
    const source = readLocalFile('../proxy.ts')

    expect(source).not.toContain("matcher: ['/', '/(de|en|ar|tr)/:path*']")
    expect(source).toContain('/((?!api|_next/static|_next/image')
  })

  test('search page state updates use shared search path helper', () => {
    const source = readLocalFile('../app/[locale]/search/hooks/useSearchPage.ts')

    expect(source).toContain("import { getSearchPath, getVenuePath } from '@/lib/navigation'")
    expect(source).toContain('router.push(getSearchPath(locale')
    expect(source).not.toContain("router.push(`/${locale}/search")
  })

  test('search result clicks use shared venue path helper', () => {
    const source = readLocalFile('../app/[locale]/search/hooks/useSearchPage.ts')

    expect(source).toContain("import { getSearchPath, getVenuePath } from '@/lib/navigation'")
    expect(source).toContain('router.push(getVenuePath(locale, bordell.id))')
    expect(source).not.toContain('/venue/${bordell.id}')
  })

  test('homepage list clicks use shared venue path helper instead of local spa detail state', () => {
    const source = readLocalFile('../app/[locale]/page.tsx')

    expect(source).toContain("import { getLocalizedPath, getVenuePath } from '@/lib/navigation'")
    expect(source).toContain("onBordellClick: (bordell) => { router.push(getVenuePath(locale, bordell.id)); toTop() }")
    expect(source).not.toContain("onBordellClick: (bordell) => { setSelectedBordell(bordell); setView('detail'); toTop() }")
  })

  test('venue alias route reuses the bordell detail page implementation', () => {
    const source = readLocalFile('../app/[locale]/venue/[slug]/page.tsx')

    expect(source).toContain("export { default, generateMetadata, generateStaticParams } from '../../bordell/[slug]/page'")
  })

  test('routed venue detail keeps header, footer, and a back action', () => {
    const source = readLocalFile('../app/[locale]/bordell/[slug]/ProductDetailPageContent.tsx')

    expect(source).toContain("import { useRouter } from 'next/navigation'")
    expect(source).toContain("import { Header } from '@/components/layout/Header'")
    expect(source).toContain("import { Footer } from '@/components/layout/Footer'")
    expect(source).toContain('const handleBack = () => {')
    expect(source).toContain('router.back()')
    expect(source).toContain("router.push(getSearchPath(locale, { city: bordell.city }))")
    expect(source).toContain('<Header')
    expect(source).toContain('<Footer locale={locale} />')
    expect(source).toContain('Zurück')
  })
})
