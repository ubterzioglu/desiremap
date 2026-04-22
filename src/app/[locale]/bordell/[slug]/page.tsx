import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { backendApi } from '@/lib/backend-client'
import { getProductDetailStructuredData, getProductMetadata, type ProductDetailData } from '@/lib/structuredData'
import { ProductDetailPageContent } from './ProductDetailPageContent'
import type { Bordell, BordellType, PublicEstablishment } from '@/types'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']


// Global fallback — API opening_hours field coming soon (is_open, is_top_venue, is_verified, opening_hours)
const DEFAULT_OPENING_HOURS: Record<string, string> = {
  Monday: '11:00 - 03:00',
  Tuesday: '11:00 - 03:00',
  Wednesday: '11:00 - 03:00',
  Thursday: '11:00 - 03:00',
  Friday: '11:00 - 05:00',
  Saturday: '11:00 - 05:00',
  Sunday: '11:00 - 02:00',
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function parseOpeningHoursForSEO(hoursStr: string): { days: string[], opens: string, closes: string } {
  if (!hoursStr) return { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '00:00', closes: '23:59' }
  const match = hoursStr.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  if (match) return { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: match[1], closes: match[2] }
  return { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '00:00', closes: '23:59' }
}

function formatOpeningHours(hours: Record<string, string>): string {
  if (!hours || Object.keys(hours).length === 0) return ''
  const today = DAY_NAMES[new Date().getDay()]
  const todayHours = hours[today]
  if (todayHours) return `Heute: ${todayHours}`
  const firstDay = Object.keys(hours)[0]
  return hours[firstDay]
}

function getIsOpen(hours: Record<string, string>): boolean {
  if (!hours || Object.keys(hours).length === 0) return false
  const now = new Date()
  const today = DAY_NAMES[now.getDay()]
  const todayHours = hours[today]
  if (!todayHours) return false
  const match = todayHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  if (!match) return false
  const [, openH, openM, closeH, closeM] = match.map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  // Handle past-midnight closing (e.g. 11:00 - 03:00 means open until 3 AM next day)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
  }
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

function publicEstablishmentToBordell(e: PublicEstablishment): Bordell {
  return {
    id: e.slug,
    name: e.name,
    type: e.type as BordellType,
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange: e.priceMin != null ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}` : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    maxPrice: e.priceMax ?? undefined,
    ladiesCount: 0,
    services: e.tags,
    isOpen: getIsOpen(e.openingHours && Object.keys(e.openingHours).length > 0 ? e.openingHours : DEFAULT_OPENING_HOURS),
    openHours: formatOpeningHours(e.openingHours && Object.keys(e.openingHours).length > 0 ? e.openingHours : DEFAULT_OPENING_HOURS),
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: e.phone ?? '',
    email: e.email,
    website: e.website,
    description: e.description ?? '',
    coverImage: e.images?.[0],
    images: e.images,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }
}

function bordellToProductData(bordell: Bordell, relatedItems: PublicEstablishment[]): ProductDetailData {
  return {
    id: bordell.id,
    name: bordell.name,
    slug: bordell.id,
    description: bordell.description,
    image: bordell.coverImage || `${siteUrl}/listing-bg.jpg`,
    images: bordell.images,
    type: bordell.type,
    city: bordell.city,
    address: bordell.city,
    phone: bordell.phone,
    price: bordell.minPrice,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: bordell.rating,
    reviewCount: bordell.reviewCount,
    reviews: [],
    openingHours: parseOpeningHoursForSEO(bordell.openHours),
    services: bordell.services,
    ladiesCount: bordell.ladiesCount,
    verified: bordell.verified,
    premium: bordell.premium,
    relatedProducts: relatedItems.slice(0, 3).map((b) => ({ id: b.slug, name: b.name, slug: b.slug, type: b.type, city: b.city })),
    faq: [
      { question: `Was kostet der Eintritt in ${bordell.name}?`, answer: `Der Eintritt beginnt bei ${bordell.minPrice > 0 ? `${bordell.minPrice}€` : 'Auf Anfrage'}.` },
      { question: `Ist ${bordell.name} verifiziert?`, answer: bordell.verified ? `Ja, ${bordell.name} ist verifiziert.` : `${bordell.name} befindet sich im Verifizierungsprozess.` },
    ],
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
    const establishment = await backendApi.getPublicEstablishmentDetail(slug)
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
    establishment = await backendApi.getPublicEstablishmentDetail(slug)
  } catch {
    notFound()
  }

  const bordell = publicEstablishmentToBordell(establishment)
  const relatedResult = await backendApi.getPublicEstablishments({ city: establishment.city, limit: 4 }).catch(() => ({ results: [], total: 0 }))
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
