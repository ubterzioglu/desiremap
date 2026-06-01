import type { PublicEstablishment } from '@/types'
import { getVenuePath, getCityPath, getCategoryPath } from '@/lib/navigation'
import {
  WEBSITE_ID,
  ORG_ID,
  PRICE_CURRENCY,
  SCHEMA_DEFAULTS,
  VENUE_FALLBACK_IMAGE,
  venueTypeLabel,
} from './constants'
import { buildBreadcrumbList } from './core'
import {
  absoluteUrl,
  toBcp47,
  germanSlugify,
  prune,
  withGraph,
  type JsonLdNode,
  type JsonLdGraph,
  type BreadcrumbItem,
} from './helpers'

export interface VenueSchemaOptions {
  locale: string
  /** Category slug for the breadcrumb (defaults to the establishment `type`). */
  categorySlug?: string
  datePublished?: string
  dateModified?: string
}

interface VenueContext {
  locale: string
  categorySlug: string
  typeLabel: string
  description: string
  path: string
  venueUrl: string
  images: string[]
  primaryImageId: string
  priceRange?: string | undefined
  venueId: string
  productId: string
  webpageId: string
  breadcrumbId: string
  groupId: string
  ratingId: string
  offerId: string
  howToId: string
  datePublished?: string | undefined
  dateModified?: string | undefined
}

const DAY_OF_WEEK: Record<string, string> = {
  monday: 'Monday', montag: 'Monday', mon: 'Monday', mo: 'Monday',
  tuesday: 'Tuesday', dienstag: 'Tuesday', tue: 'Tuesday', di: 'Tuesday',
  wednesday: 'Wednesday', mittwoch: 'Wednesday', wed: 'Wednesday', mi: 'Wednesday',
  thursday: 'Thursday', donnerstag: 'Thursday', thu: 'Thursday', do: 'Thursday',
  friday: 'Friday', freitag: 'Friday', fri: 'Friday', fr: 'Friday',
  saturday: 'Saturday', samstag: 'Saturday', sat: 'Saturday', sa: 'Saturday',
  sunday: 'Sunday', sonntag: 'Sunday', sun: 'Sunday', so: 'Sunday',
}

function parseHourRange(value: string): { opens: string; closes: string } | null {
  const match = value.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  if (!match || !match[1] || !match[2]) return null
  return { opens: match[1], closes: match[2] }
}

function buildOpeningHoursSpec(hours: Record<string, string>): JsonLdNode[] {
  const specs: JsonLdNode[] = []
  for (const [day, value] of Object.entries(hours)) {
    const dayOfWeek = DAY_OF_WEEK[day.trim().toLowerCase()]
    const range = parseHourRange(value)
    if (!dayOfWeek || !range) continue
    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayOfWeek}`,
      opens: range.opens,
      closes: range.closes,
    })
  }
  return specs
}

function collectImages(e: PublicEstablishment): string[] {
  const all = [e.image, ...(e.images ?? [])].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  )
  const unique = Array.from(new Set(all)).map((url) => absoluteUrl(url))
  return unique.length > 0 ? unique : [VENUE_FALLBACK_IMAGE]
}

function computePriceRange(e: PublicEstablishment): string | undefined {
  if (typeof e.priceMin !== 'number' || e.priceMin <= 0) return undefined
  const hasMax = typeof e.priceMax === 'number' && e.priceMax > 0
  return `€${e.priceMin}${hasMax ? `–€${e.priceMax}` : '+'}`
}

function buildImageObjects(ctx: VenueContext, captionBase: string): JsonLdNode[] {
  return ctx.images.map((url, index) =>
    prune({
      '@type': 'ImageObject',
      '@id': `${ctx.venueUrl}#image-${index + 1}`,
      url,
      contentUrl: url,
      caption: captionBase,
      representativeOfPage: index === 0 ? true : undefined,
    }),
  )
}

/** AggregateRating — always emitted (product decision). Uses real values when present, else placeholders. */
function buildAggregateRating(e: PublicEstablishment, ratingId: string): JsonLdNode {
  const hasReal = typeof e.rating === 'number' && e.rating > 0 && e.reviewCount > 0
  const ratingValue = hasReal ? Number(e.rating) : SCHEMA_DEFAULTS.ratingValue
  const reviewCount = hasReal ? e.reviewCount : SCHEMA_DEFAULTS.reviewCount

  return {
    '@type': 'AggregateRating',
    '@id': ratingId,
    ratingValue,
    reviewCount,
    ratingCount: reviewCount,
    bestRating: SCHEMA_DEFAULTS.bestRating,
    worstRating: SCHEMA_DEFAULTS.worstRating,
  }
}

/** Offer / AggregateOffer with a MerchantReturnPolicy. Services are non-returnable → NotPermitted. */
function buildOffers(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  const min = typeof e.priceMin === 'number' && e.priceMin > 0 ? e.priceMin : SCHEMA_DEFAULTS.price
  const max = typeof e.priceMax === 'number' && e.priceMax > 0 ? e.priceMax : undefined
  const availability =
    e.isActive === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'

  const returnPolicy = {
    '@type': 'MerchantReturnPolicy',
    '@id': `${ctx.offerId}-returnpolicy`,
    applicableCountry: 'DE',
    returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
  }

  if (max && max > min) {
    return {
      '@type': 'AggregateOffer',
      '@id': ctx.offerId,
      priceCurrency: PRICE_CURRENCY,
      lowPrice: min,
      highPrice: max,
      offerCount: 1,
      availability,
      url: ctx.venueUrl,
      seller: { '@id': ORG_ID },
      hasMerchantReturnPolicy: returnPolicy,
    }
  }

  return {
    '@type': 'Offer',
    '@id': ctx.offerId,
    priceCurrency: PRICE_CURRENCY,
    price: min,
    availability,
    url: ctx.venueUrl,
    seller: { '@id': ORG_ID },
    hasMerchantReturnPolicy: returnPolicy,
  }
}

function buildLocalBusiness(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  const hasGeo = typeof e.lat === 'number' && typeof e.lng === 'number'
  const openingHours = buildOpeningHoursSpec(e.openingHours ?? {})

  return prune({
    '@type': ['LocalBusiness', 'Store'],
    '@id': ctx.venueId,
    name: e.name,
    description: ctx.description,
    url: ctx.venueUrl,
    image: { '@id': ctx.primaryImageId },
    telephone: e.phone || undefined,
    email: e.email || undefined,
    priceRange: ctx.priceRange,
    currenciesAccepted: PRICE_CURRENCY,
    address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'DE' },
    geo: hasGeo ? { '@type': 'GeoCoordinates', latitude: e.lat, longitude: e.lng } : undefined,
    openingHoursSpecification: openingHours.length > 0 ? openingHours : undefined,
    aggregateRating: { '@id': ctx.ratingId },
    makesOffer: { '@id': ctx.offerId },
    amenityFeature:
      e.tags.length > 0
        ? e.tags.map((tag) => ({ '@type': 'LocationFeatureSpecification', name: tag, value: true }))
        : undefined,
    isPartOf: { '@id': WEBSITE_ID },
    parentOrganization: { '@id': ORG_ID },
    sameAs: e.website ? [e.website] : undefined,
  })
}

function buildProduct(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  return prune({
    '@type': 'Product',
    '@id': ctx.productId,
    name: `${e.name} – ${ctx.typeLabel}`,
    sku: e.slug,
    description: ctx.description,
    image: { '@id': ctx.primaryImageId },
    category: ctx.typeLabel,
    brand: { '@type': 'Brand', name: e.name },
    url: ctx.venueUrl,
    aggregateRating: { '@id': ctx.ratingId },
    offers: { '@id': ctx.offerId },
    isVariantOf: { '@id': ctx.groupId },
    additionalProperty:
      e.tags.length > 0
        ? e.tags.map((tag) => ({ '@type': 'PropertyValue', name: 'Service', value: tag }))
        : undefined,
  })
}

function buildProductGroup(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  return {
    '@type': 'ProductGroup',
    '@id': ctx.groupId,
    name: `${ctx.typeLabel} – ${e.name}`,
    description: `${ctx.typeLabel} Angebote von ${e.name} in ${e.city}.`,
    productGroupID: e.slug,
    variesBy: ['https://schema.org/serviceType'],
    brand: { '@type': 'Brand', name: e.name },
    url: ctx.venueUrl,
    aggregateRating: { '@id': ctx.ratingId },
    hasVariant: { '@id': ctx.productId },
  }
}

function buildVenueWebPage(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  return prune({
    '@type': ['WebPage', 'ItemPage'],
    '@id': ctx.webpageId,
    url: ctx.venueUrl,
    name: `${e.name} – ${ctx.typeLabel} in ${e.city}`,
    description: ctx.description,
    inLanguage: toBcp47(ctx.locale),
    isPartOf: { '@id': WEBSITE_ID },
    primaryImageOfPage: { '@id': ctx.primaryImageId },
    breadcrumb: { '@id': ctx.breadcrumbId },
    mainEntity: { '@id': ctx.productId },
    datePublished: ctx.datePublished,
    dateModified: ctx.dateModified,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-description', '.speakable-services', '.speakable-faq'],
    },
  })
}

function buildVenueBreadcrumb(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: ctx.locale === 'de' ? '/' : `/${ctx.locale}` },
    { name: ctx.typeLabel, path: getCategoryPath(ctx.locale, ctx.categorySlug) },
    { name: e.city, path: getCityPath(ctx.locale, germanSlugify(e.city)) },
    { name: e.name, path: ctx.path },
  ]
  return buildBreadcrumbList(crumbs, ctx.breadcrumbId)
}

function buildVisitHowTo(e: PublicEstablishment, ctx: VenueContext): JsonLdNode {
  const steps: Array<{ name: string; text: string }> = [
    {
      name: 'Öffnungszeiten prüfen',
      text: `Informiere dich vorab über die aktuellen Öffnungszeiten von ${e.name}.`,
    },
  ]
  if (e.phone) {
    steps.push({ name: 'Kontakt aufnehmen', text: `Erreiche ${e.name} telefonisch unter ${e.phone}.` })
  }
  steps.push({
    name: 'Ausweis mitbringen',
    text: 'Der Zutritt ist nur für Personen ab 18 Jahren mit gültigem Lichtbildausweis gestattet.',
  })
  steps.push({
    name: 'Anreise planen',
    text: `Plane deine Anreise nach ${e.city} mit dem ÖPNV oder dem eigenen Fahrzeug.`,
  })

  return {
    '@type': 'HowTo',
    '@id': ctx.howToId,
    name: `So besuchst du ${e.name}`,
    description: `Schritte für deinen Besuch bei ${e.name} (${ctx.typeLabel}) in ${e.city}.`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

function buildFaqPage(e: PublicEstablishment, venueUrl: string): JsonLdNode | null {
  const faqItems = e.detailContent?.faq ?? []
  if (faqItems.length === 0) return null
  return {
    '@type': 'FAQPage',
    '@id': `${venueUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function buildContext(e: PublicEstablishment, options: VenueSchemaOptions): VenueContext {
  const { locale } = options
  const path = getVenuePath(locale, e.slug)
  const venueUrl = absoluteUrl(path)
  const typeLabel = venueTypeLabel(e.type)
  const description = (e.description ?? '').trim() || `${e.name} – ${typeLabel} in ${e.city}, Deutschland.`

  return {
    locale,
    categorySlug: options.categorySlug ?? e.type,
    typeLabel,
    description,
    path,
    venueUrl,
    images: collectImages(e),
    primaryImageId: `${venueUrl}#image-1`,
    priceRange: computePriceRange(e),
    venueId: `${venueUrl}#venue`,
    productId: `${venueUrl}#product`,
    webpageId: `${venueUrl}#webpage`,
    breadcrumbId: `${venueUrl}#breadcrumb`,
    groupId: `${venueUrl}#productgroup`,
    ratingId: `${venueUrl}#venue-rating`,
    offerId: `${venueUrl}#venue-offer`,
    howToId: `${venueUrl}#howto`,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
  }
}

/**
 * Full venue detail (PDP) graph. Emits LocalBusiness/Store, Product (+ ProductGroup),
 * Offer/AggregateOffer (+ MerchantReturnPolicy), AggregateRating, ImageObject gallery,
 * ItemPage (with SpeakableSpecification), BreadcrumbList, FAQPage and a visit HowTo.
 */
export function buildVenueGraph(e: PublicEstablishment, options: VenueSchemaOptions): JsonLdGraph {
  const ctx = buildContext(e, options)
  const captionBase = `${e.name} – ${ctx.typeLabel} in ${e.city}`

  const nodes: JsonLdNode[] = [
    buildVenueWebPage(e, ctx),
    buildVenueBreadcrumb(e, ctx),
    buildLocalBusiness(e, ctx),
    buildProduct(e, ctx),
    buildProductGroup(e, ctx),
    buildAggregateRating(e, ctx.ratingId),
    buildOffers(e, ctx),
    ...buildImageObjects(ctx, captionBase),
    buildVisitHowTo(e, ctx),
  ]

  const faqPage = buildFaqPage(e, ctx.venueUrl)
  if (faqPage) nodes.push(faqPage)

  return withGraph(nodes)
}
