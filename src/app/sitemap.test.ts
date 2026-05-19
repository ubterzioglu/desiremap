import { describe, expect, test } from 'bun:test'

import sitemap from './sitemap'

describe('sitemap', () => {
  test('includes localized venue detail URLs from public establishments', async () => {
    const originalFetch = globalThis.fetch
    const calls: string[] = []

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input)
      calls.push(url)

      if (url.includes('/public/stadt/cities')) {
        return new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      }

      if (url.includes('/public/establishments')) {
        return new Response(JSON.stringify({
          results: [
            {
              slug: 'pascha-laufhaus-und-hotel',
              name: 'Pascha Laufhaus und Hotel',
              city: 'Köln',
              type: 'laufhaus',
              description: null,
              images: [],
              rating: null,
              reviewCount: 0,
              priceMin: null,
              priceMax: null,
              tags: ['Laufhaus'],
              verified: true,
              lat: null,
              lng: null,
              openingHours: {},
              isActive: true,
            },
          ],
          total: 1,
        }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({}), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch

    try {
      const entries = await sitemap()
      const urls = entries.map((entry) => entry.url)

      expect(calls.some((url) => url.includes('/public/establishments'))).toBe(true)
      expect(urls).toContain('https://desiremap.de/venue/pascha-laufhaus-und-hotel')
      expect(urls).toContain('https://desiremap.de/en')
      expect(urls).toContain('https://desiremap.de/en/venue/pascha-laufhaus-und-hotel')
      expect(urls).not.toContain('https://desiremap.de/en/')
      expect(urls).not.toContain('https://desiremap.de/de/venue/pascha-laufhaus-und-hotel')

      const venueEntry = entries.find(
        (entry) => entry.url === 'https://desiremap.de/venue/pascha-laufhaus-und-hotel'
      )

      expect(venueEntry?.alternates?.languages?.de).toBe(
        'https://desiremap.de/venue/pascha-laufhaus-und-hotel'
      )
      expect(venueEntry?.alternates?.languages?.en).toBe(
        'https://desiremap.de/en/venue/pascha-laufhaus-und-hotel'
      )

      const englishStadtEntry = entries.find(
        (entry) => entry.url === 'https://desiremap.de/en/stadt'
      )

      expect(englishStadtEntry?.priority).toBe(0.7)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
