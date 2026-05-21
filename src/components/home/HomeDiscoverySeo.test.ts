import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('Home discovery SEO guards', () => {
  test('filters homepage city cards to cities with real venue counts', () => {
    const source = readLocalFile('./FeaturedCities.tsx')

    expect(source).toContain('.filter((city) => getPublicCityVenueCount(city) > 0)')
  })

  test('feeds homepage city cards from the same public city image helper as Stadt pages', () => {
    const source = readLocalFile('./FeaturedCities.tsx')

    expect(source).toContain('getPublicCityImage')
    expect(source).toContain('image: getPublicCityImage(city)')
    expect(source).not.toContain('image: city.image ?? null')
  })

  test('uses crawlable category routes instead of category query-string links', () => {
    const navigationSource = readLocalFile('../../lib/navigation.ts')
    const categoriesSource = readLocalFile('./CategoriesSection.tsx')
    const seoContentSource = readLocalFile('./SEOContentSection.tsx')
    const homeSeoSource = readLocalFile('../../lib/seo/home.ts')

    expect(navigationSource).toContain('export function getCategoryPath')
    expect(categoriesSource).toContain('getCategoryPath(locale, category.slug)')
    expect(seoContentSource).toContain('href={cluster.href}')
    expect(homeSeoSource).toContain('href: getCategoryPath(currentLocale,')
    expect(homeSeoSource).not.toContain('href: getSearchPath(currentLocale, { category:')
  })

  test('keeps listing cards discoverable with real links and responsive comparison table width', () => {
    const listingCardSource = readLocalFile('../listings/ListingCard.tsx')
    const seoContentSource = readLocalFile('./SEOContentSection.tsx')

    expect(listingCardSource).toContain("import Link from 'next/link'")
    expect(listingCardSource).toContain('<Link')
    expect(listingCardSource).not.toContain('className="group relative cursor-pointer"')
    expect(listingCardSource).not.toContain('onClick={() => onDetailClickAction(bordell)}')
    expect(seoContentSource).toContain('min-w-[500px]')
  })
})
