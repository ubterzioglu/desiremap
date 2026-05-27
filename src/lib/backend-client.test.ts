import { describe, expect, test } from 'bun:test'

import { BackendApiError, memberAuthApi, normalizePublicCity, normalizePublicEstablishment } from './backend-client'
import type { PublicCity, PublicEstablishment } from '@/types'

describe('normalizePublicCity', () => {
  test('uses public hero image as the canonical city image before legacy public image fields', () => {
    const result = normalizePublicCity({
      id: 1,
      cityId: 1,
      slug: 'berlin',
      name: 'Berlin',
      venueCount: 12,
      image: null,
      publicHeroImageUrl: '/uploads/city-images/berlin-hero.jpg',
      publicImageUrl: 'https://example.com/legacy-card.jpg',
    } as PublicCity)

    expect(result.image).toBe('https://api.desiremap.de/uploads/city-images/berlin-hero.jpg')
    expect(result.publicHeroImageUrl).toBe('https://api.desiremap.de/uploads/city-images/berlin-hero.jpg')
    expect(result.publicImageUrl).toBe('https://example.com/legacy-card.jpg')
  })

  test('normalizes snake_case city hero image from the public API', () => {
    const result = normalizePublicCity({
      id: 2,
      cityId: 2,
      slug: 'hamburg',
      name: 'Hamburg',
      venueCount: 4,
      public_hero_image_url: '/uploads/city-images/hamburg-hero.webp',
    } as PublicCity & { public_hero_image_url: string })

    expect(result.image).toBe('https://api.desiremap.de/uploads/city-images/hamburg-hero.webp')
  })
})

describe('normalizePublicEstablishment', () => {
  test('drops internal .local image URLs and keeps public-safe images', () => {
    const result = normalizePublicEstablishment({
      slug: 'hamburg-harbor-thermal-club',
      name: 'Hamburg Harbor Thermal Club',
      city: 'Hamburg',
      type: 'thermal',
      description: 'Harbor-facing thermal spa',
      images: [
        'https://images.desiremap.local/venues/hamburg-cover.jpg',
        'https://lh3.googleusercontent.com/example',
        '/covers/artemis-bg.jpg',
      ],
      rating: 4.8,
      reviewCount: 214,
      priceMin: 64,
      priceMax: 69,
      tags: ['Thermal Spa'],
      verified: true,
      lat: null,
      lng: null,
      openingHours: {},
      image: 'https://images.desiremap.local/venues/hamburg-cover.jpg',
    } as PublicEstablishment & { image: string })

    expect(result.images).toEqual([
      'https://lh3.googleusercontent.com/example',
      '/covers/artemis-bg.jpg',
    ])
    expect((result as PublicEstablishment & { image?: string | null }).image).toBeNull()
  })

  test('drops internal .local image URLs from alternate primary image fields', () => {
    const result = normalizePublicEstablishment({
      slug: 'munich-night-thermal-club',
      name: 'Munich Night Thermal Club',
      city: 'Munich',
      type: 'thermal',
      description: 'City center thermal spa',
      images: [],
      rating: 4.7,
      reviewCount: 184,
      priceMin: 74,
      priceMax: 89,
      tags: ['Thermal Spa'],
      verified: true,
      lat: null,
      lng: null,
      openingHours: {},
      coverImage: 'https://images.desiremap.local/venues/munich-cover.jpg',
      thumbnail_url: 'https://images.desiremap.local/venues/berlin-cover.jpg',
      heroImage: 'https://api.desiremap.de/media/venues/munich-cover.jpg',
    } as PublicEstablishment & {
      coverImage: string
      heroImage: string
      thumbnail_url: string
    })

    expect((result as PublicEstablishment & { image?: string | null }).image).toBe('https://api.desiremap.de/media/venues/munich-cover.jpg')
    expect(result.images).toEqual([])
  })

  test('normalizes summary image separately from snake_case price fields', () => {
    const result = normalizePublicEstablishment({
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
      tags: ['Laufhaus'],
      verified: true,
      lat: null,
      lng: null,
      openingHours: {},
      image: 'https://pascha.de/assets/img/Image-12.jpg',
      price_min: '80',
      price_max: '120',
    } as PublicEstablishment & {
      image: string
      price_min: string
      price_max: string
    })

    expect((result as PublicEstablishment & { image?: string | null }).image).toBe('https://pascha.de/assets/img/Image-12.jpg')
    expect(result.images).toEqual([])
    expect(result.priceMin).toBe(80)
    expect(result.priceMax).toBe(120)
  })

  test('keeps listing image separate from gallery images', () => {
    const result = normalizePublicEstablishment({
      slug: 'berlin-gallery-club',
      name: 'Berlin Gallery Club',
      city: 'Berlin',
      type: 'fkk',
      description: null,
      images: ['https://cdn.example.com/gallery-1.jpg'],
      rating: null,
      reviewCount: 0,
      priceMin: null,
      priceMax: null,
      tags: [],
      verified: true,
      lat: null,
      lng: null,
      openingHours: {},
      public_image_url: 'https://cdn.example.com/card.jpg',
    } as PublicEstablishment & { public_image_url: string })

    expect((result as PublicEstablishment & { image?: string | null }).image).toBe('https://cdn.example.com/card.jpg')
    expect(result.images).toEqual(['https://cdn.example.com/gallery-1.jpg'])
  })
})

describe('memberAuthApi', () => {
  test('posts the Google ID token against the public member auth endpoint with credentials', async () => {
    const originalFetch = globalThis.fetch
    const calls: Array<{ input: RequestInfo | URL, init?: RequestInit | undefined }> = []

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ input, init })

      return new Response(JSON.stringify({
        memberPublicId: '51000000-0000-0000-0000-000000000001',
        accessToken: 'access_live_member_x7Z8',
        expiresAt: '2026-05-27T12:00:00.000Z',
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch

    try {
      const result = await memberAuthApi.loginWithGoogle({ idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' })

      expect(String(calls[0]?.input)).toBe('https://api.desiremap.de/api/member-auth/google')
      expect(calls[0]?.init?.method).toBe('POST')
      expect(calls[0]?.init?.credentials).toBe('include')
      expect(calls[0]?.init?.body).toBe(JSON.stringify({ idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' }))
      expect(result.memberPublicId).toBe('51000000-0000-0000-0000-000000000001')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  test('surfaces backend auth error codes for Google configuration failures', async () => {
    const originalFetch = globalThis.fetch

    globalThis.fetch = (async () => new Response(JSON.stringify({
      statusCode: 503,
      errorCode: 'GOOGLE_AUTH_NOT_CONFIGURED',
      message: 'Google sign-in is not configured yet.',
    }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    })) as unknown as typeof fetch

    try {
      let capturedError: unknown = null

      try {
        await memberAuthApi.loginWithGoogle({ idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' })
      } catch (error) {
        capturedError = error
      }

      expect(capturedError).toBeInstanceOf(BackendApiError)
      expect((capturedError as BackendApiError).statusCode).toBe(503)
      expect((capturedError as BackendApiError).errorCode).toBe('GOOGLE_AUTH_NOT_CONFIGURED')
      expect((capturedError as BackendApiError).message).toBe('Google sign-in is not configured yet.')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
