import { WEBSITE_ID } from './constants'
import { buildBreadcrumbList } from './core'
import {
  toBcp47,
  prune,
  withGraph,
  type JsonLdNode,
  type JsonLdGraph,
  type BreadcrumbItem,
} from './helpers'

export interface CollectionItem {
  name: string
  url: string
}

export interface CollectionInput {
  locale: string
  /** Absolute page URL. */
  url: string
  /** Base for `@id` anchors (defaults to `url`). */
  idBase?: string
  name: string
  description?: string
  primaryImage?: string
  breadcrumbs: BreadcrumbItem[]
  items: CollectionItem[]
  faq?: Array<{ question: string; answer: string }>
  /** When true, the page is also typed as `SearchResultsPage`. */
  isSearch?: boolean
}

/**
 * Builds a CollectionPage graph: CollectionPage + BreadcrumbList + ItemList (+ optional FAQPage).
 * Shared by city, category, city-index and search-results pages so they all link to the
 * site-wide WebSite node via `isPartOf`.
 */
export function buildCollectionGraph(input: CollectionInput): JsonLdGraph {
  const base = input.idBase ?? input.url
  const pageTypes = input.isSearch ? ['CollectionPage', 'SearchResultsPage'] : 'CollectionPage'

  const nodes: JsonLdNode[] = [
    prune({
      '@type': pageTypes,
      '@id': `${base}#webpage`,
      url: input.url,
      name: input.name,
      description: input.description,
      inLanguage: toBcp47(input.locale),
      isPartOf: { '@id': WEBSITE_ID },
      primaryImageOfPage: input.primaryImage
        ? { '@type': 'ImageObject', url: input.primaryImage }
        : undefined,
      breadcrumb: { '@id': `${base}#breadcrumb` },
      mainEntity: { '@id': `${base}#list` },
    }),
    buildBreadcrumbList(input.breadcrumbs, `${base}#breadcrumb`),
    {
      '@type': 'ItemList',
      '@id': `${base}#list`,
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  ]

  if (input.faq && input.faq.length > 0) {
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${base}#faq`,
      mainEntity: input.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  return withGraph(nodes)
}

export interface CityGraphInput {
  locale: string
  /** Absolute page URL. */
  url: string
  /** Base for `@id` anchors (defaults to `url`). */
  idBase?: string
  name: string
  description?: string
  primaryImage?: string
  /** Plain city name for the Place node (e.g. "Köln"). */
  placeName: string
  breadcrumbs: BreadcrumbItem[]
  /** Venues listed on the city page → ItemList of deep links. */
  venues: CollectionItem[]
  /** City search tags → ItemList of search shortcuts (the per-city `tags` SEO field). */
  tags?: CollectionItem[]
  /** Raw tag phrases for CollectionPage.keywords. */
  keywords?: string[]
  geo?: { latitude: number; longitude: number }
}

/**
 * City detail graph: CollectionPage + BreadcrumbList + venue ItemList, plus the city's
 * search-tag ItemList (clickable search shortcuts) and a geo-located Place node.
 */
export function buildCityGraph(input: CityGraphInput): JsonLdGraph {
  const base = input.idBase ?? input.url
  const hasGeo = Boolean(input.geo)
  const hasTags = Boolean(input.tags && input.tags.length > 0)

  const nodes: JsonLdNode[] = [
    prune({
      '@type': 'CollectionPage',
      '@id': `${base}#webpage`,
      url: input.url,
      name: input.name,
      description: input.description,
      inLanguage: toBcp47(input.locale),
      isPartOf: { '@id': WEBSITE_ID },
      about: hasGeo ? { '@id': `${base}#place` } : undefined,
      primaryImageOfPage: input.primaryImage
        ? { '@type': 'ImageObject', url: input.primaryImage }
        : undefined,
      breadcrumb: { '@id': `${base}#breadcrumb` },
      mainEntity: { '@id': `${base}#venues` },
      keywords:
        input.keywords && input.keywords.length > 0 ? input.keywords.join(', ') : undefined,
    }),
    buildBreadcrumbList(input.breadcrumbs, `${base}#breadcrumb`),
    {
      '@type': 'ItemList',
      '@id': `${base}#venues`,
      name: input.name,
      numberOfItems: input.venues.length,
      itemListElement: input.venues.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  ]

  if (hasTags && input.tags) {
    nodes.push({
      '@type': 'ItemList',
      '@id': `${base}#search-tags`,
      name: 'Beliebte Suchen',
      numberOfItems: input.tags.length,
      itemListElement: input.tags.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    })
  }

  if (hasGeo && input.geo) {
    nodes.push({
      '@type': ['Place', 'City'],
      '@id': `${base}#place`,
      name: input.placeName,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: input.geo.latitude,
        longitude: input.geo.longitude,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: input.placeName,
        addressCountry: 'DE',
      },
    })
  }

  return withGraph(nodes)
}
