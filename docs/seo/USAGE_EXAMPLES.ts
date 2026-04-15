/**
 * DesireMap – Kullanım Örnekleri
 * ─────────────────────────────────────────────────────────────────────────────
 * Her sayfa tipi için gerçek Next.js App Router kullanım örneği.
 * Kendi page.tsx dosyalarınıza bu pattern'i uygulayın.
 */

// ════════════════════════════════════════════════════════════════════════════
// ÖRNEK 1: app/page.tsx (Ana Sayfa)
// ════════════════════════════════════════════════════════════════════════════

/*
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { composeHomePageSchemas } from '@/lib/seo/composers/page-composers'
import { generateHomeMetadata } from '@/lib/seo/composers/metadata-generators'
import { mapHomePageData } from '@/lib/seo/composers/mappers'

// FAQ'lar içerik ekibinden veya CMS'ten gelir — statik başlayın, sonra dinamik yapın
const HOME_FAQS = [
  {
    question: 'Wie funktioniert DesireMap?',
    answer:
      'DesireMap ist ein unabhängiges Verzeichnis für verifizierte Erwachsenenlocations in Deutschland. ' +
      'Alle aufgeführten Betriebe werden manuell geprüft und müssen bestimmte Qualitäts- und Legalitätsstandards erfüllen. ' +
      'Nutzer können Locations suchen, Bewertungen lesen und – wo verfügbar – direkt über die Plattform reservieren.',
  },
  {
    question: 'Sind alle Locations auf DesireMap legal tätig?',
    answer:
      'Ja. DesireMap nimmt ausschließlich Betriebe auf, die im Rahmen des deutschen Prostitutionsschutzgesetzes (ProstSchG) ' +
      'angemeldet und behördlich erlaubt sind. Betriebe ohne gültige Konzession werden nicht gelistet. ' +
      'Bei Verstößen werden Einträge unverzüglich entfernt.',
  },
  {
    question: 'Zeigt DesireMap explizite Inhalte?',
    answer:
      'Nein. DesireMap verzichtet bewusst auf explizite oder pornografische Inhalte. ' +
      'Die Plattform bietet ausschließlich sachliche, informative Beschreibungen der Locations ' +
      'sowie neutrale Bewertungen registrierter Nutzer.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const api = await fetchHomePageData()  // NestJS API çağrısı
  const data = mapHomePageData(api, HOME_FAQS)
  return generateHomeMetadata(data)
}

export default async function HomePage() {
  const api = await fetchHomePageData()
  const data = mapHomePageData(api, HOME_FAQS)
  const schemas = composeHomePageSchemas(data)

  return (
    <>
      <JsonLd schemas={schemas} />
      <main>
        // ... sayfa içeriği
      </main>
    </>
  )
}
*/

// ════════════════════════════════════════════════════════════════════════════
// ÖRNEK 2: app/location/[slug]/page.tsx (Mekan Detay Sayfası)
// ════════════════════════════════════════════════════════════════════════════

/*
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { composeListingPageSchemas } from '@/lib/seo/composers/page-composers'
import { generateListingMetadata } from '@/lib/seo/composers/metadata-generators'
import { mapListingPageData } from '@/lib/seo/composers/mappers'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  // ISR veya tam statik için slug listesi — tercihize göre
  const slugs = await fetchAllVenueSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const api = await fetchVenueBySlug(params.slug)
  if (!api) return {}

  const data = mapListingPageData(api.venue, api.related, api.faqs, api.publishedAt, api.lastModified)
  return generateListingMetadata(data)
}

export default async function ListingPage({ params }: Props) {
  const api = await fetchVenueBySlug(params.slug)
  if (!api) notFound()

  const data = mapListingPageData(
    api.venue,
    api.related,
    api.faqs,
    api.publishedAt,
    api.lastModified
  )
  const schemas = composeListingPageSchemas(data)

  return (
    <>
      <JsonLd schemas={schemas} />
      <main>
        // ... mekan detay içeriği
      </main>
    </>
  )
}
*/

// ════════════════════════════════════════════════════════════════════════════
// ÖRNEK 3: app/stadt/[city]/page.tsx (Şehir Sayfası)
// ════════════════════════════════════════════════════════════════════════════

/*
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { composeCityPageSchemas } from '@/lib/seo/composers/page-composers'
import { generateCityMetadata } from '@/lib/seo/composers/metadata-generators'
import { mapCityPageData } from '@/lib/seo/composers/mappers'

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const api = await fetchCityData(params.city)
  const data = mapCityPageData(api)
  return generateCityMetadata(data)
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const api = await fetchCityData(params.city)
  const data = mapCityPageData(api)
  const schemas = composeCityPageSchemas(data)

  return (
    <>
      <JsonLd schemas={schemas} />
      <main>
        // ... şehir içeriği
      </main>
    </>
  )
}
*/

export {}  // TypeScript module olarak tanımlı
