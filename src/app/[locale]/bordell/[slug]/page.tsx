import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { backendApi, normalizePublicEstablishment } from '@/lib/backend-client'
import { PRODUCTION_PUBLIC_API_BASE_URL, joinApiUrl } from '@/lib/api-config'
import { toBordellType } from '@/lib/bordell-type'
import { getProductDetailStructuredData, getProductMetadata, type ProductDetailData } from '@/lib/structuredData'
import { ProductDetailPageContent } from './ProductDetailPageContent'
import type { Bordell, PublicEstablishment } from '@/types'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'string')
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}

function isOptionalStringOrNull(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string'
}

export function isPublicEstablishmentPayload(value: unknown): value is PublicEstablishment {
  if (!isRecord(value)) return false

  return (
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.city === 'string' &&
    typeof value.type === 'string' &&
    isOptionalStringOrNull(value.description) &&
    isOptionalStringOrNull(value.image) &&
    isStringArray(value.images) &&
    isNullableNumber(value.rating) &&
    typeof value.reviewCount === 'number' &&
    isNullableNumber(value.priceMin) &&
    isNullableNumber(value.priceMax) &&
    isStringArray(value.tags) &&
    typeof value.verified === 'boolean' &&
    isNullableNumber(value.lat) &&
    isNullableNumber(value.lng) &&
    isStringRecord(value.openingHours)
  )
}

async function getPublicEstablishmentDetailWithFallback(slug: string): Promise<PublicEstablishment> {
  try {
    return await backendApi.getPublicEstablishmentDetail(slug)
  } catch {
    const response = await fetch(
      joinApiUrl(PRODUCTION_PUBLIC_API_BASE_URL, `/public/establishments/${slug}`),
      { cache: 'no-store' }
    )

    if (!response.ok) {
      throw new Error(`Fallback detail fetch failed: ${response.status}`)
    }

    const payload: unknown = await response.json()
    if (!isPublicEstablishmentPayload(payload)) {
      throw new Error('Fallback detail payload did not match PublicEstablishment')
    }

    return normalizePublicEstablishment(payload)
  }
}

async function getPublicEstablishmentsByCityWithFallback(city: string): Promise<{ results: PublicEstablishment[]; total: number }> {
  try {
    return await backendApi.getPublicEstablishments({ city, limit: 4 })
  } catch {
    const url = new URL(joinApiUrl(PRODUCTION_PUBLIC_API_BASE_URL, '/public/establishments'))
    url.searchParams.set('city', city)
    url.searchParams.set('limit', '4')

    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) {
      return { results: [], total: 0 }
    }

    const payload: unknown = await response.json()
    const results = isRecord(payload) && Array.isArray(payload.results)
      ? payload.results.filter(isPublicEstablishmentPayload).map(normalizePublicEstablishment)
      : []

    return { results, total: isRecord(payload) && typeof payload.total === 'number' ? payload.total : results.length }
  }
}

function parseOpeningHoursForSEO(hoursStr: string): { days: string[], opens: string, closes: string } {
  if (!hoursStr) return { days: [], opens: '', closes: '' }

  const match = hoursStr.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  if (!match) return { days: [], opens: '', closes: '' }
  const opens = match[1]
  const closes = match[2]
  if (!opens || !closes) return { days: [], opens: '', closes: '' }

  return { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens, closes }
}

function formatOpeningHours(hours: Record<string, string>): string {
  if (!hours || Object.keys(hours).length === 0) return ''
  const today = DAY_NAMES[new Date().getDay()] ?? 'Sunday'
  const todayHours = hours[today]
  if (todayHours) return `Heute: ${todayHours}`
  const firstDay = Object.keys(hours)[0]
  return firstDay ? hours[firstDay] ?? '' : ''
}

function getIsOpen(hours: Record<string, string>): boolean {
  if (!hours || Object.keys(hours).length === 0) return false
  const now = new Date()
  const today = DAY_NAMES[now.getDay()] ?? 'Sunday'
  const todayHours = hours[today]
  if (!todayHours) return false
  const match = todayHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  if (!match) return false
  const openH = Number(match[1])
  const openM = Number(match[2])
  const closeH = Number(match[3])
  const closeM = Number(match[4])
  if (![openH, openM, closeH, closeM].every(Number.isFinite)) return false
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  // Handle past-midnight closing (e.g. 11:00 - 03:00 means open until 3 AM next day)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
  }
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

export function publicEstablishmentToBordell(e: PublicEstablishment): Bordell {
  const openingHours = e.openingHours && Object.keys(e.openingHours).length > 0 ? e.openingHours : {}

  const bordell: Bordell = {
    id: e.slug,
    name: e.name,
    type: toBordellType(e.type),
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange: e.priceMin != null ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}` : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    ladiesCount: 0,
    services: e.tags,
    isOpen: getIsOpen(openingHours),
    openHours: formatOpeningHours(openingHours),
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: e.phone ?? '',
    description: e.description ?? '',
    images: e.images,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }

  if (e.priceMax != null) bordell.maxPrice = e.priceMax
  if (e.email) bordell.email = e.email
  if (e.website) bordell.website = e.website
  if (e.detailContent) bordell.detailContent = e.detailContent
  if (e.image) bordell.coverImage = e.image

  return bordell
}

export function bordellToProductData(bordell: Bordell, relatedItems: PublicEstablishment[]): ProductDetailData {
  return {
    id: bordell.id,
    name: bordell.name,
    slug: bordell.id,
    description: bordell.description,
    image: bordell.coverImage || `${siteUrl}/listing-bg.jpg`,
    images: bordell.images ?? [],
    type: bordell.type,
    detailContent: bordell.detailContent ?? null,
    city: bordell.city,
    address: bordell.city,
    phone: bordell.phone,
    ...(bordell.email ? { email: bordell.email } : {}),
    ...(bordell.website ? { website: bordell.website } : {}),
    price: bordell.minPrice,
    ratingValue: bordell.rating,
    reviewCount: bordell.reviewCount,
    reviews: [],
    openingHours: parseOpeningHoursForSEO(bordell.openHours),
    services: bordell.services,
    ladiesCount: bordell.ladiesCount,
    verified: bordell.verified,
    premium: bordell.premium,
    relatedProducts: relatedItems.slice(0, 3).map((b) => ({ id: b.slug, name: b.name, slug: b.slug, type: b.type, city: b.city })),
    faq: bordell.detailContent?.faq.length ? bordell.detailContent.faq : [],
    datePublished: bordell.createdAt,
    dateModified: bordell.updatedAt,
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const establishment = await getPublicEstablishmentDetailWithFallback(slug)
    const bordell = publicEstablishmentToBordell(establishment)
    const productData = bordellToProductData(bordell, [])
    return getProductMetadata(productData, locale)
  } catch {
    return { title: 'Nicht gefunden' }
  }
}

export default async function BordellDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  let establishment: PublicEstablishment
  try {
    establishment = await getPublicEstablishmentDetailWithFallback(slug)
  } catch {
    notFound()
  }

  const bordell = publicEstablishmentToBordell(establishment)
  const relatedResult = await getPublicEstablishmentsByCityWithFallback(establishment.city)
  const relatedItems = relatedResult.results.filter((e) => e.slug !== slug)

  const productData = bordellToProductData(bordell, relatedItems)
  const structuredData = getProductDetailStructuredData(productData, locale, locales)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailPageContent
        bordell={bordell}
        productData={productData}
        locale={locale}
      />
    </>
  )
}
