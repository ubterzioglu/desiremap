import type { Metadata } from 'next'
import { publicApi } from '@/lib/api'
import { KategoriePageContent } from '@/components/kategorie/KategoriePageContent'
import { JsonLd } from '@/components/seo/JsonLd'

const LOCALES = ['de', 'en', 'ar', 'tr']
const SITE_URL = 'https://desiremap.de'

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []

  const { items: serviceTypes } = await publicApi.getServiceTypes()
  return serviceTypes.flatMap((type) =>
    LOCALES.map((locale) => ({ locale, slug: type.slug })),
  )
}

async function getCategory(slug: string) {
  const { items } = await publicApi.getServiceTypes()
  return items.find((t) => t.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategory(slug)
  const categoryName = category?.name ?? slug

  const title = `${categoryName} in Deutschland — desiremap.de`
  const description = `Alle ${categoryName} in Deutschland auf desiremap.de entdecken. Verified listings, Bewertungen und Details.`
  const canonicalPath =
    locale === 'de' ? `/kategorie/${slug}` : `/${locale}/kategorie/${slug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: `${SITE_URL}/kategorie/${slug}`,
        en: `${SITE_URL}/en/kategorie/${slug}`,
        tr: `${SITE_URL}/tr/kategorie/${slug}`,
        ar: `${SITE_URL}/ar/kategorie/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'DesireMap',
      images: [{ url: `${SITE_URL}/hero-bg.jpg`, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  }
}

export default async function KategoriePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ q?: string; city?: string }>
}) {
  const { locale, slug } = await params
  const { q = '', city = '' } = await searchParams

  const category = await getCategory(slug)
  const categoryName = category?.name ?? slug

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} in Deutschland`,
    description: `Alle ${categoryName} auf desiremap.de`,
    url: `${SITE_URL}${locale === 'de' ? '' : `/${locale}`}/kategorie/${slug}`,
  }

  return (
    <>
      <JsonLd schemas={[structuredData]} />
      <KategoriePageContent
        locale={locale}
        slug={slug}
        categoryName={categoryName}
        initialQuery={q}
        initialCity={city}
      />
    </>
  )
}
