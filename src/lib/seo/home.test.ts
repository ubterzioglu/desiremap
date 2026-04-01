import { describe, expect, test } from 'bun:test'
import { getHomeSeoExperience, getHomeSeoMetadata } from './home'

describe('home SEO content model', () => {
  test('builds category and city routes for the localized homepage SEO section', () => {
    const seo = getHomeSeoExperience('de')

    expect(seo.clusters).toHaveLength(4)
    expect(seo.clusters.map((item) => item.href)).toEqual([
      '/de/search?category=fkk',
      '/de/search?category=laufhaus',
      '/de/search?category=studio',
      '/de/search?category=privat'
    ])

    expect(seo.cityLinks.some((item) => item.href === '/de/search?city=Berlin')).toBe(true)
    expect(seo.faq).toHaveLength(4)
  })

  test('returns homepage metadata tuned for the German market', () => {
    const metadata = getHomeSeoMetadata('de')

    expect(metadata.title).toContain('DesireMap')
    expect(metadata.title).toContain('Deutschland')
    expect(metadata.description).toContain('verifizierte')
    expect(metadata.description).toContain('Deutschland')
  })
})
