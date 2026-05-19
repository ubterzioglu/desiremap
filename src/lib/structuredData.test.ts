import { describe, expect, test } from 'bun:test'

import type { PublicCity } from '@/types'
import {
  getProductDetailStructuredData,
  getStadtStructuredData,
  getStructuredData,
  type ProductDetailData,
} from './structuredData'

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
