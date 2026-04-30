import { describe, expect, test } from 'bun:test'

import { normalizePublicEstablishment } from './backend-client'
import type { PublicEstablishment } from '@/types'

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

    expect(result.images).toEqual(['https://api.desiremap.de/media/venues/munich-cover.jpg'])
  })
})
