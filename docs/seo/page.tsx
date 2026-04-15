/**
 * Venue Detay Sayfası
 * ─────────────────────────────────────────────────────────────────────────────
 * URL: desiremap.de/venue/pascha-koln
 * App Router: app/[locale]/venue/[slug]/page.tsx
 *
 * Render: ISR (revalidate: 86400 — 24 saat)
 * Build time: generateStaticParams ile bilinen slug'lar statik üretilir.
 * Yeni mekanlar: ilk request'te render edilir, sonra cache'e alınır.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { fetchVenueBySlug, fetchAllVenueSlugs } from '../../../../lib/api/client'
import { mapVenueDetail, mapVenueSummary } from '../../../../lib/seo/composers/mappers'
import { composeListingPageSchemas } from '../../../../lib/seo/composers/page-composers'
import { generateListingMetadata } from '../../../../lib/seo/composers/metadata-generators'
import { CATEGORY_CONFIG, SITE_CONFIG } from '../../../../lib/seo/utils/constants'
import {
  generateOpeningParagraph,
  generateDescriptionParagraph,
  generateAmenitiesParagraph,
  generateReservationParagraph,
  generateOpeningHoursParagraph,
  generateLegalParagraph,
  generateVenueFaqs,
  formatOpeningHours,
  type ContentVars,
} from '../../../../lib/seo/content/content-engine'

// ─── Tipler ───────────────────────────────────────────────────────────────────

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

// ─── Static params (build time) ───────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await fetchAllVenueSlugs()
  // Her locale için üret — şimdilik sadece 'de'
  return slugs.map((slug) => ({ locale: 'de', slug }))
}

// ─── Revalidation (ISR) ───────────────────────────────────────────────────────
// Mekan bilgisi sık değişmez. 24 saat yeterli.
// Acil güncelleme gerekirse: POST /api/revalidate?slug=...

export const revalidate = 86400

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const api = await fetchVenueBySlug(params.slug)
    const venue = mapVenueDetail(api)
    const relatedVenues = (api.related_venues ?? []).map(mapVenueSummary)

    const data = {
      pageType: 'listing' as const,
      siteUrl: SITE_CONFIG.url,
      locale: 'de-DE' as const,
      venue,
      relatedVenues,
      faqs: api.faqs,
      breadcrumbs: buildBreadcrumbs(venue.slug, venue.name, venue.city, venue.category),
      publishedAt: api.published_at,
      lastModified: api.last_modified,
    }

    return generateListingMetadata(data)
  } catch {
    return {}
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function VenuePage({ params }: PageProps) {
  // 404 handling — notFound() Next.js'e yönlendirir
  let api
  try {
    api = await fetchVenueBySlug(params.slug)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NOT_FOUND') notFound()
    throw err
  }

  const venue = mapVenueDetail(api)
  const relatedVenues = (api.related_venues ?? []).map(mapVenueSummary)
  const categoryConfig = CATEGORY_CONFIG[venue.category]
  const formattedHours = formatOpeningHours(api.opening_hours)

  // ─── İçerik değişkenleri ──────────────────────────────────────────────────
  const contentVars: ContentVars = {
    venueName: venue.name,
    city: venue.city,
    category: venue.category,
    categoryLabel: categoryConfig.label,
    categoryPlural: categoryConfig.plural,
    amenities: venue.amenities,
    priceRange: venue.priceRange ?? undefined,
    hasReservation: venue.hasReservation,
    isVerified: venue.isVerified,
    openDays: api.opening_hours.flatMap((h) => h.days),
    foundingYear: venue.foundingYear,
    capacity: venue.maximumCapacity,
    tagline: venue.tagline ?? undefined,
  }

  // ─── İçerik üretimi ───────────────────────────────────────────────────────
  // Seed = slug → deterministik, her build'de aynı template seçilir
  const seed = params.slug

  const openingParagraph = generateOpeningParagraph(contentVars, seed)
  const descriptionParagraph = generateDescriptionParagraph(contentVars, seed)
  const amenitiesParagraph = generateAmenitiesParagraph(contentVars)
  const reservationParagraph = generateReservationParagraph(contentVars)
  const openingHoursParagraph = generateOpeningHoursParagraph(contentVars, formattedHours)
  const legalParagraph = generateLegalParagraph(contentVars)

  // ─── FAQ üretimi ──────────────────────────────────────────────────────────
  // API'dan gelen FAQ'lar varsa onları kullan, yoksa content engine üret
  const faqs =
    api.faqs?.length > 0
      ? api.faqs
      : generateVenueFaqs(contentVars, formattedHours)

  // ─── Breadcrumbs ──────────────────────────────────────────────────────────
  const breadcrumbs = buildBreadcrumbs(
    venue.slug,
    venue.name,
    venue.city,
    venue.category
  )

  // ─── Schema data ──────────────────────────────────────────────────────────
  const schemaData = {
    pageType: 'listing' as const,
    siteUrl: SITE_CONFIG.url,
    locale: 'de-DE' as const,
    venue,
    relatedVenues,
    faqs,
    breadcrumbs,
    publishedAt: api.published_at,
    lastModified: api.last_modified,
  }

  const schemas = composeListingPageSchemas(schemaData)

  return (
    <>
      {/* Schema injection — <head> içine otomatik gider (App Router) */}
      <JsonLd schemas={schemas} />

      <main>
        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section aria-label="Venue Header">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb — görsel navigasyon */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-gray-500">
                <li><a href="/">DesireMap</a></li>
                <li aria-hidden>/</li>
                <li>
                  <a href={`/${categoryConfig.slug}`}>{categoryConfig.plural}</a>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <a href={`/stadt/${venue.city.toLowerCase()}`}>{venue.city}</a>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page">{venue.name}</li>
              </ol>
            </nav>

            {/* H1 — ana keyword */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {venue.name}
              <span className="sr-only"> – {categoryConfig.label} in {venue.city}</span>
            </h1>

            {/* Tagline / subheading */}
            {venue.tagline && (
              <p className="text-lg text-gray-600 mb-4">{venue.tagline}</p>
            )}

            {/* Verified badge */}
            {venue.isVerified && (
              <div
                className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full mb-6"
                aria-label="Verifizierter Betrieb"
              >
                <span aria-hidden>✓</span> Verifizierter Betrieb
              </div>
            )}
          </div>
        </section>

        {/* ── Direkt cevap paragrafı (AI snippet için kritik) ─────────── */}
        {/* Google ve AI bu bölümü ilk indexler — min 40 kelime */}
        <section aria-label="Übersicht" className="bg-white">
          <div className="container mx-auto px-4 py-6">
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
              {openingParagraph}
            </p>
          </div>
        </section>

        {/* ── Mekan detayı ─────────────────────────────────────────────── */}
        <section aria-labelledby="description-heading" className="py-8">
          <div className="container mx-auto px-4">
            <h2
              id="description-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Über {venue.name}
            </h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-4">
              {descriptionParagraph}
            </p>
            {amenitiesParagraph && (
              <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
                {amenitiesParagraph}
              </p>
            )}
          </div>
        </section>

        {/* ── Öffnungszeiten ───────────────────────────────────────────── */}
        <section aria-labelledby="hours-heading" className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h2
              id="hours-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Öffnungszeiten
            </h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-4">
              {openingHoursParagraph}
            </p>
            {/* Yapısal tablo — Google featured snippet için */}
            <table className="text-sm text-gray-700 border-collapse">
              <caption className="sr-only">Öffnungszeiten von {venue.name}</caption>
              <tbody>
                {api.opening_hours.map((h, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-2 pr-6 font-medium">{h.days.join(', ')}</td>
                    <td className="py-2">
                      {h.opens} – {h.closes} Uhr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Rezervasyon ──────────────────────────────────────────────── */}
        <section aria-labelledby="reservation-heading" className="py-8">
          <div className="container mx-auto px-4">
            <h2
              id="reservation-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Reservierung
            </h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-4">
              {reservationParagraph}
            </p>
            {venue.hasReservation && (
              <a
                href={`/venue/${venue.slug}/reservierung`}
                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                Jetzt reservieren
              </a>
            )}
          </div>
        </section>

        {/* ── Legal / E-E-A-T bölümü ───────────────────────────────────── */}
        <section aria-labelledby="legal-heading" className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h2
              id="legal-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Rechtliches & Sicherheit
            </h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
              {legalParagraph}
            </p>
          </div>
        </section>

        {/* ── FAQ (GEO için kritik) ─────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="py-8">
          <div className="container mx-auto px-4">
            <h2
              id="faq-heading"
              className="text-2xl font-semibold text-gray-900 mb-6"
            >
              Häufige Fragen zu {venue.name}
            </h2>
            <dl className="space-y-6 max-w-3xl">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-200 pb-6">
                  <dt className="font-semibold text-gray-900 mb-2 text-base">
                    {faq.question}
                  </dt>
                  <dd className="text-gray-700 leading-relaxed text-sm">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Related venues ───────────────────────────────────────────── */}
        {relatedVenues.length > 0 && (
          <section aria-labelledby="related-heading" className="bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <h2
                id="related-heading"
                className="text-2xl font-semibold text-gray-900 mb-4"
              >
                Ähnliche Locations in {venue.city}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedVenues.map((related) => (
                  <li key={related.id}>
                    <a
                      href={`/venue/${related.slug}`}
                      className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-rose-300 transition-colors"
                    >
                      <span className="font-medium text-gray-900 block">{related.name}</span>
                      <span className="text-sm text-gray-500">{related.city}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// ─── Yardımcı ────────────────────────────────────────────────────────────────

function buildBreadcrumbs(
  slug: string,
  name: string,
  city: string,
  category: string
) {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
  return [
    { position: 1, name: 'DesireMap', item: SITE_CONFIG.url },
    { position: 2, name: config.plural, item: `${SITE_CONFIG.url}/${config.slug}` },
    { position: 3, name: city, item: `${SITE_CONFIG.url}/stadt/${city.toLowerCase()}` },
    { position: 4, name: name, item: `${SITE_CONFIG.url}/venue/${slug}` },
  ]
}
