import { getSearchPath } from '@/lib/navigation'
import {
  SITE_URL,
  SITE_NAME,
  ORG_ID,
  WEBSITE_ID,
  LOGO_ID,
  ORG_LOGO_URL,
  ORG_SAME_AS,
  ORG_CONTACT_EMAIL,
} from './constants'
import {
  absoluteUrl,
  toBcp47,
  prune,
  type JsonLdNode,
  type BreadcrumbItem,
} from './helpers'

/**
 * Organization / Brand / OnlineStore identity node. Site-wide singleton (`@id` = ORG_ID).
 * Referenced by WebSite.publisher, Offer.seller and LocalBusiness.parentOrganization.
 */
export function buildOrganization(): JsonLdNode {
  return prune({
    '@type': ['Organization', 'OnlineStore'],
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: ORG_LOGO_URL,
      caption: SITE_NAME,
    },
    image: { '@id': LOGO_ID },
    description:
      'Deutschlands Verzeichnis für verifizierte FKK Clubs, Laufhäuser, Bordelle, Studios und Privat-Adressen.',
    areaServed: { '@type': 'Country', name: 'Germany' },
    knowsLanguage: ['de', 'en', 'tr', 'ar'],
    sameAs: ORG_SAME_AS.length > 0 ? [...ORG_SAME_AS] : undefined,
    contactPoint: ORG_CONTACT_EMAIL
      ? {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: ORG_CONTACT_EMAIL,
          availableLanguage: ['de', 'en'],
        }
      : undefined,
  })
}

/**
 * WebSite node with a SearchAction (site search) + publisher link. Site-wide singleton
 * (`@id` = WEBSITE_ID). Referenced by every page's `isPartOf`.
 */
export function buildWebSite(locale: string): JsonLdNode {
  return prune({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: toBcp47(locale),
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(getSearchPath(locale))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  })
}

export function buildBreadcrumbList(items: BreadcrumbItem[], id: string): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((item, index) =>
      prune({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.path ? absoluteUrl(item.path) : undefined,
      }),
    ),
  }
}

export interface WebPageInput {
  id: string
  url: string
  name: string
  locale: string
  description?: string
  primaryImage?: string
  breadcrumbId?: string
  mainEntityId?: string
  datePublished?: string
  dateModified?: string
  speakableSelectors?: string[]
  /** Extra `@type` values (e.g. `'ItemPage'`, `'CollectionPage'`). */
  additionalTypes?: string[]
}

export function buildWebPage(input: WebPageInput): JsonLdNode {
  const type =
    input.additionalTypes && input.additionalTypes.length > 0
      ? ['WebPage', ...input.additionalTypes]
      : 'WebPage'

  return prune({
    '@type': type,
    '@id': input.id,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: toBcp47(input.locale),
    isPartOf: { '@id': WEBSITE_ID },
    primaryImageOfPage: input.primaryImage
      ? { '@type': 'ImageObject', url: input.primaryImage }
      : undefined,
    breadcrumb: input.breadcrumbId ? { '@id': input.breadcrumbId } : undefined,
    mainEntity: input.mainEntityId ? { '@id': input.mainEntityId } : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    speakable:
      input.speakableSelectors && input.speakableSelectors.length > 0
        ? { '@type': 'SpeakableSpecification', cssSelector: input.speakableSelectors }
        : undefined,
  })
}
