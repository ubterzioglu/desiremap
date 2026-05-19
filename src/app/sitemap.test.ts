import { describe, expect, test } from 'bun:test'

describe('sitemap.xml route', () => {
  test('serves explicit urlset XML with url children for public venue URLs', async () => {
    const routeModule = await import('./sitemap.xml/route').catch(() => null)

    expect(routeModule).not.toBeNull()

    if (!routeModule) {
      return
    }

    const originalFetch = globalThis.fetch
    const calls: string[] = []

    const mockFetch = Object.assign(async (input: RequestInfo | URL) => {
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
    }, { preconnect: originalFetch.preconnect })

    globalThis.fetch = mockFetch

    try {
      const response = await routeModule.GET()
      const body = await response.text()

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/xml')
      expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
      expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(body).toContain('<url>')
      expect(body).toContain('<loc>https://desiremap.de/venue/pascha-laufhaus-und-hotel</loc>')
      expect(body).toContain('<loc>https://desiremap.de/en</loc>')
      expect(body).toContain('<loc>https://desiremap.de/en/venue/pascha-laufhaus-und-hotel</loc>')
      expect(body).toContain('<changefreq>daily</changefreq>')
      expect(body).toContain('<priority>0.7</priority>')
      expect(body).not.toContain('<loc>https://desiremap.de/en/</loc>')
      expect(body).not.toContain('0.7000000000000001')
      expect(body).not.toContain('xmlns:xhtml')
      expect(body).not.toContain('<xhtml:link')
      expect(body.trim().endsWith('</urlset>')).toBe(true)
      expect(calls.some((url) => url.includes('/public/establishments'))).toBe(true)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
