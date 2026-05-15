import { describe, expect, test } from 'bun:test'

import { getProductDetailStructuredData, getStructuredData, type ProductDetailData } from './structuredData'

describe('homepage structured data', () => {
  test('returns stable JSON-LD for identical inputs', async () => {
    const first = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    await new Promise((resolve) => setTimeout(resolve, 5))

    const second = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    expect(first).toEqual(second)
  })
})

describe('product detail structured data', () => {
  test('omits FAQ and opening hours schemas when public content is empty', () => {
    const product: ProductDetailData = {
      id: 'empty-content-venue',
      name: 'Empty Content Venue',
      slug: 'empty-content-venue',
      description: '',
      image: 'https://desiremap.de/listing-bg.jpg',
      images: [],
      type: 'fkk',
      detailContent: null,
      city: 'Berlin',
      address: 'Berlin',
      price: 0,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      ratingValue: 0,
      reviewCount: 0,
      reviews: [],
      openingHours: { days: [], opens: '', closes: '' },
      services: [],
      ladiesCount: 0,
      verified: false,
      premium: false,
      relatedProducts: [],
      faq: [],
      datePublished: '2025-01-01T00:00:00.000Z',
      dateModified: '2025-01-01T00:00:00.000Z',
    }

    const structuredData = getProductDetailStructuredData(product, 'de', ['de'])
    const graph = structuredData['@graph']

    expect(graph.some((node) => node?.['@type'] === 'FAQPage')).toBe(false)
    expect(graph.some((node) => node?.['@type'] === 'OpeningHoursSpecification')).toBe(false)
    expect(graph.some((node) => 'openingHoursSpecification' in node)).toBe(false)
  })
})
