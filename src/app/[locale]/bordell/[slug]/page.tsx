import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductDetailStructuredData, getProductMetadata, type ProductDetailData } from '@/lib/structuredData'
import { ProductDetailPageContent } from './ProductDetailPageContent'
import { bordells } from '@/data/mock-data'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

// Generate static paths for all bordells
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = []
  for (const locale of locales) {
    for (const bordell of bordells) {
      params.push({
        locale,
        slug: bordell.id // Using ID as slug for now
      })
    }
  }
  return params
}

// Convert Bordell to ProductDetailData
function bordellToProductData(bordell: typeof bordells[0]): ProductDetailData {
  return {
    id: bordell.id,
    name: bordell.name,
    slug: bordell.id,
    description: bordell.description,
    image: bordell.coverImage || `${siteUrl}/covers/default-bg.jpg`,
    images: bordell.images,
    type: bordell.type,
    city: bordell.city,
    address: `${bordell.location}, ${bordell.city}`,
    phone: bordell.phone,
    email: bordell.email,
    website: bordell.website,
    price: bordell.minPrice,
    priceCurrency: 'EUR',
    availability: bordell.isOpen ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    ratingValue: bordell.rating,
    reviewCount: bordell.reviewCount,
    reviews: [
      {
        id: '1',
        authorName: 'Max M.',
        rating: 5,
        date: '2025-12-15',
        content: `Ausgezeichnete Erfahrung in ${bordell.name}. Sehr professionell und diskret.`
      },
      {
        id: '2',
        authorName: 'Thomas K.',
        rating: 4,
        date: '2025-11-20',
        content: `Guter Service, saubere Räumlichkeiten. Werde wieder kommen.`
      }
    ],
    openingHours: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    },
    services: bordell.services,
    ladiesCount: bordell.ladiesCount,
    verified: bordell.verified,
    premium: bordell.premium,
    relatedProducts: bordells
      .filter(b => b.id !== bordell.id && (b.city === bordell.city || b.type === bordell.type))
      .slice(0, 3)
      .map(b => ({
        id: b.id,
        name: b.name,
        slug: b.id,
        type: b.type,
        city: b.city
      })),
    faq: [
      {
        question: `Was kostet der Eintritt in ${bordell.name}?`,
        answer: `Der Eintritt in ${bordell.name} beginnt bei ${bordell.minPrice}€. Weitere Services und Extras werden separat berechnet.`
      },
      {
        question: `Ist ${bordell.name} verifiziert?`,
        answer: bordell.verified
          ? `Ja, ${bordell.name} ist durch unseren mehrstufigen Verifizierungsprozess geprüft und trägt das Verified-Siegel.`
          : `${bordell.name} befindet sich im Verifizierungsprozess.`
      },
      {
        question: `Wie viele Damen sind in ${bordell.name} tätig?`,
        answer: `Aktuell sind ${bordell.ladiesCount} Damen in ${bordell.name} tätig. Die Anzahl kann je nach Tageszeit variieren.`
      },
      {
        question: `Welche Services bietet ${bordell.name} an?`,
        answer: `${bordell.name} bietet folgende Services: ${bordell.services.join(', ')}.`
      }
    ],
    datePublished: bordell.createdAt,
    dateModified: bordell.updatedAt
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const bordell = bordells.find(b => b.id === slug)

  if (!bordell) {
    return { title: 'Nicht gefunden' }
  }

  const productData = bordellToProductData(bordell)
  return getProductMetadata(productData, locale)
}

export default async function BordellDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const bordell = bordells.find(b => b.id === slug)

  if (!bordell) {
    notFound()
  }

  const productData = bordellToProductData(bordell)
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
