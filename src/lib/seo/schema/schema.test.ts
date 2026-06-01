import { describe, expect, test } from 'bun:test'
import type { PublicEstablishment } from '@/types'
import {
  buildVenueGraph,
  buildWebSite,
  buildOrganization,
  buildCollectionGraph,
  buildCityGraph,
  buildHomeGraph,
} from './index'
import {
  WEBSITE_ID,
  ORG_ID,
  SCHEMA_DEFAULTS,
  VENUE_FALLBACK_IMAGE,
} from './constants'
import type { JsonLdGraph } from './helpers'

const EXTERNAL_IDS = new Set([WEBSITE_ID, ORG_ID])

const fullEstablishment: PublicEstablishment = {
  slug: 'villa-rosa-koeln',
  name: 'Villa Rosa',
  city: 'Köln',
  type: 'fkk',
  description: 'Ein exklusiver FKK Club im Herzen von Köln.',
  detailContent: {
    aboutText: null,
    servicesText: null,
    ladiesAtmosphereText: null,
    faq: [{ question: 'Wie sind die Öffnungszeiten?', answer: 'Täglich von 14 bis 02 Uhr.' }],
  },
  image: 'https://cdn.example.com/villa.jpg',
  images: ['https://cdn.example.com/villa-2.jpg'],
  rating: 4.8,
  reviewCount: 37,
  priceMin: 60,
  priceMax: 150,
  tags: ['Sauna', 'Bar', 'Parkplatz'],
  verified: true,
  lat: 50.93,
  lng: 6.95,
  openingHours: { Monday: '14:00 - 02:00', Tuesday: '14:00 - 02:00' },
  isActive: true,
  phone: '+49 221 1234567',
  email: 'info@villarosa.de',
  website: 'https://villarosa.de',
}

const minimalEstablishment: PublicEstablishment = {
  slug: 'studio-x',
  name: 'Studio X',
  city: 'München',
  type: 'studio',
  description: null,
  image: null,
  images: [],
  rating: null,
  reviewCount: 0,
  priceMin: null,
  priceMax: null,
  tags: [],
  verified: false,
  lat: null,
  lng: null,
  openingHours: {},
}

function collectIds(value: unknown, defined: Set<string>, referenced: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, defined, referenced)
    return
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const id = typeof obj['@id'] === 'string' ? obj['@id'] : undefined
    if (id) {
      if ('@type' in obj) defined.add(id)
      else referenced.add(id)
    }
    for (const child of Object.values(obj)) collectIds(child, defined, referenced)
  }
}

function typesOf(graph: JsonLdGraph): Set<string> {
  const types = new Set<string>()
  for (const node of graph['@graph']) {
    const type = node['@type']
    if (typeof type === 'string') types.add(type)
    else if (Array.isArray(type)) type.forEach((t) => typeof t === 'string' && types.add(t))
  }
  return types
}

describe('global schema nodes', () => {
  test('WebSite uses the canonical id referenced by every page and exposes a SearchAction', () => {
    const website = buildWebSite('de')
    expect(website['@id']).toBe(WEBSITE_ID)
    expect(website['@type']).toBe('WebSite')
    expect(website.publisher).toEqual({ '@id': ORG_ID })
    const action = website.potentialAction as Record<string, unknown>
    expect(action['@type']).toBe('SearchAction')
  })

  test('Organization is an OnlineStore brand identity with a stable id', () => {
    const org = buildOrganization()
    expect(org['@id']).toBe(ORG_ID)
    expect(org['@type']).toEqual(['Organization', 'OnlineStore'])
    expect(org).not.toHaveProperty('sameAs') // empty ORG_SAME_AS must be pruned, never fabricated
  })
})

describe('venue graph (full data)', () => {
  const graph = buildVenueGraph(fullEstablishment, { locale: 'de' })

  test('every internal @id reference resolves to a defined node', () => {
    const defined = new Set<string>()
    const referenced = new Set<string>()
    collectIds(graph, defined, referenced)
    const dangling = [...referenced].filter((id) => !defined.has(id) && !EXTERNAL_IDS.has(id))
    expect(dangling).toEqual([])
  })

  test('emits the full requested schema vocabulary', () => {
    const types = typesOf(graph)
    for (const expected of [
      'WebPage',
      'ItemPage',
      'BreadcrumbList',
      'LocalBusiness',
      'Store',
      'Product',
      'ProductGroup',
      'AggregateOffer',
      'AggregateRating',
      'ImageObject',
      'HowTo',
      'FAQPage',
    ]) {
      expect(types).toContain(expected)
    }
  })

  test('uses real backend rating values', () => {
    const rating = graph['@graph'].find((n) => n['@type'] === 'AggregateRating')
    expect(rating?.ratingValue).toBe(4.8)
    expect(rating?.reviewCount).toBe(37)
  })

  test('ItemPage exposes speakable selectors that exist in the rendered DOM', () => {
    const page = graph['@graph'].find((n) => Array.isArray(n['@type']) && (n['@type'] as string[]).includes('ItemPage'))
    const speakable = page?.speakable as Record<string, unknown>
    expect(speakable.cssSelector).toEqual(['.speakable-description', '.speakable-services', '.speakable-faq'])
  })

  test('serialized output carries no null or undefined leakage', () => {
    const json = JSON.stringify(graph)
    expect(json).not.toContain('null')
    expect(json).not.toContain('undefined')
  })
})

describe('venue graph (empty backend data)', () => {
  const graph = buildVenueGraph(minimalEstablishment, { locale: 'de' })

  test('AggregateRating + Offer are still emitted using valid placeholders', () => {
    const rating = graph['@graph'].find((n) => n['@type'] === 'AggregateRating')
    expect(rating?.reviewCount).toBe(SCHEMA_DEFAULTS.reviewCount)
    expect(rating?.reviewCount as number).toBeGreaterThanOrEqual(1)

    const offer = graph['@graph'].find((n) => n['@type'] === 'Offer')
    expect(offer?.price).toBe(SCHEMA_DEFAULTS.price)
  })

  test('falls back to the house image and omits FAQPage when there is no FAQ', () => {
    const image = graph['@graph'].find((n) => n['@type'] === 'ImageObject')
    expect(image?.url).toBe(VENUE_FALLBACK_IMAGE)
    expect(typesOf(graph)).not.toContain('FAQPage')
  })

  test('no internal reference dangles even on sparse data', () => {
    const defined = new Set<string>()
    const referenced = new Set<string>()
    collectIds(graph, defined, referenced)
    const dangling = [...referenced].filter((id) => !defined.has(id) && !EXTERNAL_IDS.has(id))
    expect(dangling).toEqual([])
  })
})

describe('city graph', () => {
  const graph = buildCityGraph({
    locale: 'de',
    url: 'https://desiremap.de/stadt/koeln',
    name: 'Köln — FKK Clubs, Laufhäuser & Studios',
    description: 'FKK Clubs in Köln.',
    primaryImage: 'https://cdn.example.com/koeln.jpg',
    placeName: 'Köln',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Städte', path: '/stadt' },
      { name: 'Köln', path: '/stadt/koeln' },
    ],
    venues: [{ name: 'Villa Rosa', url: 'https://desiremap.de/venue/villa-rosa-koeln' }],
    tags: [{ name: 'köln pascha', url: 'https://desiremap.de/search?q=koeln+pascha' }],
    keywords: ['köln pascha', 'köln laufhaus'],
    geo: { latitude: 50.93, longitude: 6.95 },
  })

  test('emits CollectionPage, a venue list, a search-tag list and a geo Place', () => {
    const types = typesOf(graph)
    expect(types).toContain('CollectionPage')
    expect(types).toContain('Place')
    expect(types).toContain('City')
    const lists = graph['@graph'].filter((n) => n['@type'] === 'ItemList')
    expect(lists.length).toBe(2) // venues + search-tag shortcuts

    const page = graph['@graph'].find((n) => n['@type'] === 'CollectionPage')
    expect(page?.isPartOf).toEqual({ '@id': WEBSITE_ID })
    expect(page?.keywords).toBe('köln pascha, köln laufhaus')
  })

  test('the search-tag list carries the city tags as crawlable shortcuts', () => {
    const tagList = graph['@graph'].find((n) => n['@id'] === 'https://desiremap.de/stadt/koeln#search-tags')
    const elements = tagList?.itemListElement as Array<Record<string, unknown>>
    expect(elements[0]?.name).toBe('köln pascha')
    expect(elements[0]?.url).toContain('/search')
  })

  test('no dangling @id references', () => {
    const defined = new Set<string>()
    const referenced = new Set<string>()
    collectIds(graph, defined, referenced)
    const dangling = [...referenced].filter((id) => !defined.has(id) && !EXTERNAL_IDS.has(id))
    expect(dangling).toEqual([])
  })

  test('omits the search-tag list and Place node when there are no tags or geo', () => {
    const minimal = buildCityGraph({
      locale: 'de',
      url: 'https://desiremap.de/stadt/leer',
      name: 'Leer',
      placeName: 'Leer',
      breadcrumbs: [{ name: 'Home', path: '/' }],
      venues: [],
    })
    expect(minimal['@graph'].filter((n) => n['@type'] === 'ItemList').length).toBe(1)
    expect(typesOf(minimal)).not.toContain('Place')
  })
})

describe('home graph', () => {
  const graph = buildHomeGraph({
    locale: 'de',
    url: 'https://desiremap.de',
    name: 'DesireMap',
    description: 'FKK Clubs & Bordelle in Deutschland.',
    primaryImage: 'https://desiremap.de/hero-bg.jpg',
    faq: [{ question: 'Ist DesireMap kostenlos?', answer: '<strong>Ja.</strong>' }],
    categories: [{ name: 'FKK Clubs', url: 'https://desiremap.de/kategorie/fkk' }],
    cities: [{ name: 'Köln', url: 'https://desiremap.de/stadt/koeln' }],
  })

  test('emits the full homepage schema set specified for the homepage', () => {
    const types = typesOf(graph)
    for (const expected of [
      'WebPage',
      'BreadcrumbList',
      'ImageObject',
      'ItemList',
      'Product',
      'ProductGroup',
      'AggregateOffer',
      'AggregateRating',
      'Review',
      'Person',
      'HowTo',
      'FAQPage',
    ]) {
      expect(types).toContain(expected)
    }
    expect(graph['@graph'].filter((n) => n['@type'] === 'ItemList').length).toBe(2)
  })

  test('WebPage links to the global WebSite + Organization', () => {
    const page = graph['@graph'].find((n) => n['@type'] === 'WebPage')
    expect(page?.isPartOf).toEqual({ '@id': WEBSITE_ID })
    expect(page?.about).toEqual({ '@id': ORG_ID })
  })

  test('the AggregateOffer carries a MerchantReturnPolicy', () => {
    const offer = graph['@graph'].find((n) => n['@type'] === 'AggregateOffer')
    const policy = offer?.hasMerchantReturnPolicy as Record<string, unknown>
    expect(policy['@type']).toBe('MerchantReturnPolicy')
  })

  test('no dangling @id references and no undefined leakage', () => {
    const defined = new Set<string>()
    const referenced = new Set<string>()
    collectIds(graph, defined, referenced)
    expect([...referenced].filter((id) => !defined.has(id) && !EXTERNAL_IDS.has(id))).toEqual([])
    expect(JSON.stringify(graph)).not.toContain('undefined')
  })
})

describe('collection graph', () => {
  test('links to the site-wide WebSite node and lists items', () => {
    const graph = buildCollectionGraph({
      locale: 'de',
      url: 'https://desiremap.de/kategorie/fkk',
      name: 'FKK Clubs in Deutschland',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'FKK Clubs', path: '/kategorie/fkk' },
      ],
      items: [{ name: 'Villa Rosa', url: 'https://desiremap.de/venue/villa-rosa-koeln' }],
    })
    const page = graph['@graph'].find((n) => n['@type'] === 'CollectionPage')
    expect(page?.isPartOf).toEqual({ '@id': WEBSITE_ID })
    const list = graph['@graph'].find((n) => n['@type'] === 'ItemList')
    expect(list?.numberOfItems).toBe(1)
  })
})
