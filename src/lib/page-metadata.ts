import type { Metadata } from 'next'
import { getVenuePath } from '@/lib/navigation'

const siteUrl = 'https://desiremap.de'

function getBlogPostRelativePath(locale: string, slug: string) {
  return locale === 'de' ? `/blog/${slug}` : `/${locale}/blog/${slug}`
}

function getVenueRelativePath(locale: string, slug: string) {
  return getVenuePath(locale, slug)
}

export interface ProductDetailData {
  id: string
  name: string
  slug: string
  description: string
  image: string
  images?: string[]
  type: string
  detailContent?: {
    aboutText: string | null
    servicesText: string | null
    ladiesAtmosphereText: string | null
    faq: Array<{
      question: string
      answer: string
    }>
  } | null
  city: string
  address: string
  phone?: string
  email?: string
  website?: string
  price: number
  ratingValue: number
  reviewCount: number
  reviews: Array<{
    id: string
    authorName: string
    rating: number
    date: string
    content: string
  }>
  openingHours: {
    days: string[]
    opens: string
    closes: string
  }
  services: string[]
  ladiesCount: number
  verified: boolean
  premium: boolean
  relatedProducts: Array<{
    id: string
    name: string
    slug: string
    type: string
    city: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
  datePublished: string
  dateModified: string
}

type BlogMetadataInput = {
  slug: string
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    name: string
  }
}

const VENUE_TYPE_LABELS: Record<string, string> = {
  fkk: 'FKK Club',
  laufhaus: 'Laufhaus',
  bordell: 'Bordell',
  studio: 'Studio',
  privat: 'Privat',
}

function venueTypeLabel(type: string): string {
  return VENUE_TYPE_LABELS[type] ?? type
}

export function getBlogPostMetadata(post: BlogMetadataInput, locale: string): Metadata {
  const relativePath = getBlogPostRelativePath(locale, post.slug)
  const absoluteUrl = `${siteUrl}${relativePath}`
  const title = `${post.headline} | DesireMap Blog`

  return {
    title,
    description: post.description,
    alternates: {
      canonical: relativePath,
      languages: {
        de: getBlogPostRelativePath('de', post.slug),
        en: getBlogPostRelativePath('en', post.slug),
        tr: getBlogPostRelativePath('tr', post.slug),
        ar: getBlogPostRelativePath('ar', post.slug),
        'x-default': getBlogPostRelativePath('de', post.slug),
      },
    },
    openGraph: {
      type: 'article',
      url: absoluteUrl,
      title,
      description: post.description,
      images: [{ url: post.image, width: 1200, height: 630 }],
      siteName: 'DesireMap',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.description,
      images: [post.image],
    },
  }
}

export function getProductMetadata(product: ProductDetailData, locale: string): Metadata {
  const productRelativePath = getVenueRelativePath(locale, product.slug)
  const productUrl = `${siteUrl}${productRelativePath}`
  const typeLabel = venueTypeLabel(product.type)
  const title = `${product.name} | ${typeLabel} in ${product.city} | DesireMap`

  const descSnippet = product.description?.trim()
    ? product.description.substring(0, 100).trimEnd() + (product.description.length > 100 ? '…' : '')
    : `${typeLabel} in ${product.city} – verifizierte Adresse auf DesireMap.`
  const rawDescription = `${product.name} – ${typeLabel} in ${product.city}. ${descSnippet} Jetzt entdecken.`
  const description = rawDescription.length > 160 ? `${rawDescription.substring(0, 157)}…` : rawDescription
  const imageUrl = product.image || `${siteUrl}/og-image.png`
  const ogLocale = locale === 'en' ? 'en_GB' : locale === 'tr' ? 'tr_TR' : locale === 'ar' ? 'ar_SA' : 'de_DE'

  return {
    title,
    description,
    alternates: {
      canonical: productRelativePath,
      languages: {
        de: getVenueRelativePath('de', product.slug),
        en: getVenueRelativePath('en', product.slug),
        tr: getVenueRelativePath('tr', product.slug),
        ar: getVenueRelativePath('ar', product.slug),
        'x-default': getVenueRelativePath('de', product.slug),
      },
    },
    openGraph: {
      type: 'website',
      url: productUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${product.name} – ${typeLabel} in ${product.city}` }],
      siteName: 'DesireMap',
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
