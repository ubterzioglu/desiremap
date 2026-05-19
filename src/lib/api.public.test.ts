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

  test('does not enrich missing establishment summary images from detail API', async () => {
    const originalFetch = globalThis.fetch
    const calls: string[] = []

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input)
      calls.push(url)

      if (url.includes('/public/establishments/pascha-laufhaus-und-hotel')) {
        return new Response(JSON.stringify({
          slug: 'pascha-laufhaus-und-hotel',
          name: 'Pascha Laufhaus und Hotel',
          city: 'Cologne',
          type: 'laufhaus',
          description: null,
          images: ['https://pascha.de/assets/img/Image-12.jpg'],
          rating: null,
          reviewCount: 0,
          priceMin: null,
          priceMax: null,
          tags: ['Laufhaus', 'Bordelle'],
          verified: true,
          lat: null,
          lng: null,
          openingHours: {},
          isActive: true,
        }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        results: [
          {
            slug: 'pascha-laufhaus-und-hotel',
            name: 'Pascha Laufhaus und Hotel',
            city: 'Cologne',
            type: 'laufhaus',
            description: null,
            images: [],
            rating: null,
            reviewCount: 0,
            priceMin: null,
            priceMax: null,
            tags: ['Laufhaus', 'Bordelle'],
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

      expect(result.items[0]?.images).toEqual([])
      expect(calls.some((url) => url.includes('/public/establishments/pascha-laufhaus-und-hotel'))).toBe(false)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

describe('publicApi hero', () => {
  test('calls backend hero endpoint directly and normalizes slides', async () => {
    const originalFetch = globalThis.fetch
    const originalWindow = globalThis.window
    const calls: string[] = []

    Object.defineProperty(globalThis, 'window', {
      value: {},
      configurable: true,
    })

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input)
      calls.push(url)

      return new Response(JSON.stringify({
        items: [
          { image_url: 'https://cdn.example.com/hero-2.jpg', sort_order: 20, is_active: true, updated_at: '2026-05-19T12:00:00.000Z', updated_by: 'admin' },
          { imageUrl: 'https://images.desiremap.local/private.jpg', sortOrder: 10 },
          { imageUrl: 'https://cdn.example.com/hero-1.jpg', sortOrder: 5, isActive: false, updatedAt: '2026-05-18T12:00:00.000Z', updatedBy: 'editor01' },
        ],
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch

    try {
      const result = await publicApi.getHero()

      expect(calls[0]).toBe('https://api.desiremap.de/api/public/hero')
      expect(result.items).toEqual([
        {
          imageUrl: 'https://cdn.example.com/hero-1.jpg',
          altText: null,
          sortOrder: 5,
          isActive: false,
          updatedAt: '2026-05-18T12:00:00.000Z',
          updatedBy: 'editor01',
        },
        {
          imageUrl: 'https://cdn.example.com/hero-2.jpg',
          altText: null,
          sortOrder: 20,
          isActive: true,
          updatedAt: '2026-05-19T12:00:00.000Z',
          updatedBy: 'admin',
        },
      ])
    } finally {
      globalThis.fetch = originalFetch

      if (originalWindow === undefined) {
        delete (globalThis as typeof globalThis & { window?: Window }).window
      } else {
        Object.defineProperty(globalThis, 'window', {
          value: originalWindow,
          configurable: true,
        })
      }
    }
  })

  test('returns only valid hero slides from malformed payloads', async () => {
    const originalFetch = globalThis.fetch

    globalThis.fetch = (async () => {
      return new Response(JSON.stringify({
        items: [
          null,
          {},
          { imageUrl: '' },
          { image_url: 'notaurl' },
          { imageUrl: 'https://cdn.example.com/hero-valid.jpg', alt_text: 'Hero Alt', sortOrder: 2 },
        ],
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch

    try {
      const result = await publicApi.getHero()

      expect(result.items).toEqual([
        {
          imageUrl: 'https://cdn.example.com/hero-valid.jpg',
          altText: 'Hero Alt',
          sortOrder: 2,
          isActive: true,
          updatedAt: null,
          updatedBy: null,
        },
      ])
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
