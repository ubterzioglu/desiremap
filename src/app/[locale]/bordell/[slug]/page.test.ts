import { describe, expect, test } from 'bun:test'

import { bordellToProductData, isPublicEstablishmentPayload, publicEstablishmentToBordell } from './page'
import type { Bordell, PublicEstablishment } from '@/types'

describe('public venue detail mapping', () => {
  test('validates fallback public establishment payload shape before normalization', () => {
    expect(isPublicEstablishmentPayload({ slug: 'missing-required-fields' })).toBe(false)
    expect(isPublicEstablishmentPayload({
      slug: 'valid-venue',
      name: 'Valid Venue',
      city: 'Berlin',
      type: 'fkk',
      description: null,
      images: [],
      rating: null,
      reviewCount: 0,
      priceMin: null,
      priceMax: null,
      tags: [],
      verified: true,
      lat: null,
      lng: null,
      openingHours: {},
    })).toBe(true)
  })

  test('uses detail image as hero image while keeping gallery images separate', () => {
    const establishment = {
      slug: 'berlin-gallery-club',
      name: 'Berlin Gallery Club',
      city: 'Berlin',
      type: 'fkk',
      description: 'Public description',
      image: 'https://cdn.example.com/hero.jpg',
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
    } as PublicEstablishment & { image: string }

    const bordell = publicEstablishmentToBordell(establishment)

    expect(bordell.coverImage).toBe('https://cdn.example.com/hero.jpg')
    expect(bordell.images).toEqual(['https://cdn.example.com/gallery-1.jpg'])
  })

  test('does not invent opening hours or FAQ content when public content is empty', () => {
    const bordell: Bordell = {
      id: 'empty-content-venue',
      name: 'Empty Content Venue',
      type: 'fkk',
      location: 'Berlin',
      city: 'Berlin',
      distance: '',
      rating: 0,
      reviewCount: 0,
      priceRange: 'Auf Anfrage',
      minPrice: 0,
      ladiesCount: 0,
      services: [],
      isOpen: false,
      openHours: '',
      verified: false,
      premium: false,
      sponsored: false,
      phone: '',
      description: '',
      detailContent: null,
      images: [],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      views: 0,
      bookings: 0,
      revenue: 0,
      status: 'active',
    }

    const productData = bordellToProductData(bordell, [])

    expect(productData.openingHours).toEqual({ days: [], opens: '', closes: '' })
    expect(productData.faq).toEqual([])
  })
})
