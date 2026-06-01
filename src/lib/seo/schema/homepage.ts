import {
  ORG_ID,
  WEBSITE_ID,
  SITE_NAME,
  PRICE_CURRENCY,
  ORG_FALLBACK_IMAGE,
  HOME_PLACEHOLDER,
} from './constants'
import {
  toBcp47,
  prune,
  withGraph,
  type JsonLdNode,
  type JsonLdGraph,
} from './helpers'
import type { CollectionItem } from './collection'

export interface HomeGraphInput {
  locale: string
  /** Absolute home URL. */
  url: string
  name: string
  description: string
  primaryImage?: string
  faq: Array<{ question: string; answer: string }>
  /** Category clusters (FKK, Laufhaus, …) as deep links. */
  categories: CollectionItem[]
  /** Featured city links as deep links. */
  cities: CollectionItem[]
}

interface HomeContext {
  base: string
  locale: string
  name: string
  description: string
  primaryImage: string
  faq: Array<{ question: string; answer: string }>
  categories: CollectionItem[]
  cities: CollectionItem[]
}

function buildHomeWebPage(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'WebPage',
    '@id': `${ctx.base}#webpage`,
    url: ctx.base,
    name: ctx.name,
    description: ctx.description,
    inLanguage: toBcp47(ctx.locale),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@id': `${ctx.base}#primaryimage` },
    breadcrumb: { '@id': `${ctx.base}#breadcrumb` },
    mainEntity: { '@id': `${ctx.base}#categories` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1'] },
  }
}

function buildHomeBreadcrumb(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${ctx.base}#breadcrumb`,
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: ctx.base }],
  }
}

function buildHomeImage(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'ImageObject',
    '@id': `${ctx.base}#primaryimage`,
    url: ctx.primaryImage,
    contentUrl: ctx.primaryImage,
    caption: ctx.name,
    representativeOfPage: true,
  }
}

function buildList(id: string, name: string, items: CollectionItem[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

function buildHomeProduct(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'Product',
    '@id': `${ctx.base}#product`,
    name: HOME_PLACEHOLDER.productName,
    sku: HOME_PLACEHOLDER.productSku,
    description: 'Premium-Platzierung für verifizierte Betriebe auf DesireMap.',
    image: { '@id': `${ctx.base}#primaryimage` },
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: 'Premium Listing',
    url: ctx.base,
    aggregateRating: { '@id': `${ctx.base}#rating` },
    offers: { '@id': `${ctx.base}#offer` },
    review: [{ '@id': `${ctx.base}#review` }],
    isVariantOf: { '@id': `${ctx.base}#productgroup` },
  }
}

function buildHomeProductGroup(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'ProductGroup',
    '@id': `${ctx.base}#productgroup`,
    name: 'DesireMap Eintragspakete',
    description: 'Basis-, Premium- und Sponsored-Pakete für Betriebe.',
    productGroupID: HOME_PLACEHOLDER.productSku,
    variesBy: ['https://schema.org/category'],
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: ctx.base,
    hasVariant: { '@id': `${ctx.base}#product` },
  }
}

function buildHomeOffer(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'AggregateOffer',
    '@id': `${ctx.base}#offer`,
    priceCurrency: PRICE_CURRENCY,
    lowPrice: HOME_PLACEHOLDER.priceLow,
    highPrice: HOME_PLACEHOLDER.priceHigh,
    offerCount: 3,
    availability: 'https://schema.org/InStock',
    url: ctx.base,
    seller: { '@id': ORG_ID },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      '@id': `${ctx.base}#returnpolicy`,
      applicableCountry: 'DE',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
    },
  }
}

function buildHomeRating(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'AggregateRating',
    '@id': `${ctx.base}#rating`,
    ratingValue: HOME_PLACEHOLDER.ratingValue,
    reviewCount: HOME_PLACEHOLDER.reviewCount,
    ratingCount: HOME_PLACEHOLDER.reviewCount,
    bestRating: 5,
    worstRating: 1,
  }
}

function buildHomeReview(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'Review',
    '@id': `${ctx.base}#review`,
    itemReviewed: { '@id': `${ctx.base}#product` },
    author: { '@id': `${ctx.base}#person` },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: HOME_PLACEHOLDER.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: HOME_PLACEHOLDER.reviewBody,
    inLanguage: toBcp47(ctx.locale),
  }
}

function buildHomePerson(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': `${ctx.base}#person`,
    name: HOME_PLACEHOLDER.reviewAuthor,
    jobTitle: 'Redaktion',
    worksFor: { '@id': ORG_ID },
    url: ctx.base,
  }
}

function buildHomeHowTo(ctx: HomeContext): JsonLdNode {
  const steps = [
    { name: 'Stadt wählen', text: 'Wähle deine Stadt aus der Städteübersicht.' },
    { name: 'Kategorie filtern', text: 'Filtere nach FKK Club, Laufhaus, Studio oder Privat.' },
    { name: 'Betriebe vergleichen', text: 'Vergleiche verifizierte Adressen, Preise und Bewertungen.' },
    { name: 'Kontakt aufnehmen', text: 'Öffne das Profil und nimm direkt Kontakt auf.' },
  ]
  return {
    '@type': 'HowTo',
    '@id': `${ctx.base}#howto`,
    name: 'So findest du die passende Adresse auf DesireMap',
    description: 'In wenigen Schritten zur passenden verifizierten Adresse.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

function buildHomeFaq(ctx: HomeContext): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${ctx.base}#faq`,
    mainEntity: ctx.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/**
 * Homepage graph — the full schema set specified for the homepage. References the site-wide
 * WebSite + Organization, lists categories and cities, and emits the platform's premium-listing
 * Product / Offer / Rating / Review / ProductGroup / Person plus FAQPage, HowTo and ImageObject.
 *
 * Commerce nodes use `HOME_PLACEHOLDER` (MVP — no backend data yet); swap for real values later.
 */
export function buildHomeGraph(input: HomeGraphInput): JsonLdGraph {
  const ctx: HomeContext = {
    base: input.url,
    locale: input.locale,
    name: input.name,
    description: input.description,
    primaryImage: input.primaryImage ?? ORG_FALLBACK_IMAGE,
    faq: input.faq,
    categories: input.categories,
    cities: input.cities,
  }

  const nodes: JsonLdNode[] = [
    prune(buildHomeWebPage(ctx)),
    buildHomeBreadcrumb(ctx),
    buildHomeImage(ctx),
    buildList(`${ctx.base}#categories`, 'Kategorien', ctx.categories),
    buildList(`${ctx.base}#cities`, 'Städte', ctx.cities),
    buildHomeProduct(ctx),
    buildHomeProductGroup(ctx),
    buildHomeOffer(ctx),
    buildHomeRating(ctx),
    buildHomeReview(ctx),
    buildHomePerson(ctx),
    buildHomeHowTo(ctx),
  ]

  if (ctx.faq.length > 0) nodes.push(buildHomeFaq(ctx))

  return withGraph(nodes)
}
