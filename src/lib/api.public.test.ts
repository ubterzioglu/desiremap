import { describe, expect, test } from 'bun:test'

import { publicApi } from './api'

describe('publicApi establishments fallback', () => {
  test('prefers production public API over local API in local development', async () => {
    const originalFetch = globalThis.fetch
    const calls: string[] = []

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input)
      calls.push(url)

      return new Response(JSON.stringify({
        results: [
          {
            slug: 'db-venue',
            name: 'DB Venue',
            city: 'Berlin',
            type: 'fkk',
            description: 'Remote data',
            images: ['/covers/artemis-bg.jpg'],
            rating: 4.8,
            reviewCount: 12,
            priceMin: 80,
            priceMax: 120,
            tags: ['Wellness'],
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
    }) as unknown as typeof fetch

    try {
      const result = await publicApi.getEstablishments({ limit: 1 })

      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]?.slug).toBe('db-venue')
      expect(calls[0]).toContain('https://api.desiremap.de/api/public/establishments')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
