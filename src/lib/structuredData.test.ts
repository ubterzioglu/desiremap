import { describe, expect, test } from 'bun:test'

import type { PublicCity } from '@/types'
import {
  getProductDetailStructuredData,
  getStadtStructuredData,
  getStructuredData,
  type ProductDetailData,
} from './structuredData'

function graphTypes(graph: Array<Record<string, unknown>>): unknown[] {
  return graph.map((node) => node['@type'])
}

function hasKeyDeep(value: unknown, key: string): boolean {
  if (Array.isArray(value)) return value.some((item) => hasKeyDeep(item, key))
  if (value === null || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  return Object.prototype.hasOwnProperty.call(record, key) || Object.values(record).some((item) => hasKeyDeep(item, key))
}

function hasTypeDeep(value: unknown, type: string): boolean {
  if (Array.isArray(value)) return value.some((item) => hasTypeDeep(item, type))
  if (value === null || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  return record['@type'] === type || Object.values(record).some((item) => hasTypeDeep(item, type))
}

const emptyContentVenue: ProductDetailData = {
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

describe('homepage structured data', () => {
  test('returns stable JSON-LD for identical inputs', async () => {
    const first = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    await new Promise((resolve) => setTimeout(resolve, 5))

    const second = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    expect(first).toEqual(second)
  })

  test('describes DesireMap as platform schemas, not a local shop or ecommerce catalog', () => {
    const structuredData = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])
    const graph = structuredData['@graph'] as Array<Record<string, unknown>>
    const types = graphTypes(graph)

    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
    expect(types).not.toContain('LocalBusiness')
    expect(graph.find((node) => node['@type'] === 'Organization')).toMatchObject({
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kurfürstendamm 100',
        addressLocality: 'Berlin',
      },
    })
    expect(graph.find((node) => node['@type'] === 'WebPage')).toMatchObject({
      isPartOf: { '@id': 'https://desiremap.de/#website' },
      about: { '@id': 'https://desiremap.de/#organization' },
    })
    expect(hasTypeDeep(structuredData, 'Product')).toBe(false)
    expect(hasTypeDeep(structuredData, 'ProductGroup')).toBe(false)
    expect(hasTypeDeep(structuredData, 'OfferShippingDetails')).toBe(false)
    expect(hasTypeDeep(structuredData, 'MerchantReturnPolicy')).toBe(false)
    expect(hasKeyDeep(structuredData, 'availability')).toBe(false)
    expect(hasKeyDeep(structuredData, 'stock')).toBe(false)
  })
})

describe('product detail structured data', () => {
  test('omits FAQ and opening hours schemas when public content is empty', () => {
    const structuredData = getProductDetailStructuredData(emptyContentVenue, 'de', ['de'])
    const graph = structuredData['@graph']

    expect(graph.some((node) => node?.['@type'] === 'FAQPage')).toBe(false)
    expect(graph.some((node) => node?.['@type'] === 'OpeningHoursSpecification')).toBe(false)
    expect(graph.some((node) => 'openingHoursSpecification' in node)).toBe(false)
  })

  test('describes venue details as local entertainment businesses without ecommerce product fields', () => {
    const structuredData = getProductDetailStructuredData(emptyContentVenue, 'de', ['de'])
    const graph = structuredData['@graph'] as Array<Record<string, unknown>>
    const types = graphTypes(graph)

    expect(types).toContain('EntertainmentBusiness')
    expect(types).not.toContain('Product')
    expect(hasTypeDeep(structuredData, 'OfferShippingDetails')).toBe(false)
    expect(hasTypeDeep(structuredData, 'MerchantReturnPolicy')).toBe(false)
    expect(hasKeyDeep(structuredData, 'shippingDetails')).toBe(false)
    expect(hasKeyDeep(structuredData, 'hasMerchantReturnPolicy')).toBe(false)
    expect(hasKeyDeep(structuredData, 'availability')).toBe(false)
  })
})

describe('stadt structured data', () => {
  const cities: PublicCity[] = [
    {
      id: 1,
      cityId: 1,
      slug: 'berlin',
      name: 'Berlin',
      venueCount: 124,
      image: 'https://images.example.com/berlin.jpg',
      description: {
        de: 'Berlin bietet die größte Dichte an Premium-Adressen in Deutschland.',
      },
      isActive: true,
    },
    {
      id: 2,
      cityId: 2,
      slug: 'hamburg',
      name: 'Hamburg',
      venueCount: 87,
      image: 'https://images.example.com/hamburg.jpg',
      description: {
        de: 'Hamburg überzeugt mit diskreten Studios und bekannten Häusern.',
      },
      isActive: true,
    },
  ]

  test('builds a city index graph with page, search, list, FAQ, service, and how-to schemas', () => {
    const structuredData = getStadtStructuredData('de', cities, ['de', 'en', 'tr', 'ar'])
    const graph = structuredData['@graph'] as Array<Record<string, unknown>>
    const graphTypes = graph.map((node) => node['@type'])

    expect(graphTypes).toContain('Organization')
    expect(graphTypes).toContain('WebSite')
    expect(graphTypes).toContain('WebPage')
    expect(graphTypes).toContain('SpeakableSpecification')
    expect(graphTypes).toContain('BreadcrumbList')
    expect(graphTypes).toContain('ItemList')
    expect(graphTypes).toContain('FAQPage')
    expect(graphTypes).toContain('Service')
    expect(graphTypes).toContain('HowTo')
    expect(graphTypes).toContain('ImageObject')
    expect(hasTypeDeep(structuredData, 'Offer')).toBe(false)
    expect(hasKeyDeep(structuredData, 'availability')).toBe(false)
    expect(graphTypes).not.toContain('LocalBusiness')
    expect(graphTypes).not.toContain('Review')

    const website = graph.find((node) => node['@type'] === 'WebSite') as Record<string, unknown>
    const searchAction = website.potentialAction as Record<string, unknown>
    const searchTarget = searchAction.target as Record<string, unknown>
    expect(searchAction['@type']).toBe('SearchAction')
    expect(searchTarget['@type']).toBe('EntryPoint')
    expect(searchTarget.urlTemplate).toContain('{search_term_string}')

    const webPage = graph.find((node) => node['@type'] === 'WebPage') as Record<string, unknown>
    expect(webPage['@id']).toBe('https://desiremap.de/stadt/#webpage')
    expect(webPage.url).toBe('https://desiremap.de/stadt')
    expect(webPage.mainEntity).toEqual({ '@id': 'https://desiremap.de/stadt/#city-list' })

    const itemList = graph.find((node) => node['@type'] === 'ItemList') as Record<string, unknown>
    const itemListElements = itemList.itemListElement as Array<Record<string, unknown>>
    expect(itemList.numberOfItems).toBe(2)
    expect(itemListElements[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Berlin',
      item: 'https://desiremap.de/stadt/berlin',
    })
  })
})
