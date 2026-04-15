/**
 * Arama Sayfası
 * ─────────────────────────────────────────────────────────────────────────────
 * URL: desiremap.de/search?q=pascha&city=Köln
 * App Router: app/[locale]/search/page.tsx
 *
 * Render: Dinamik SSR (cache: no-store)
 * Arama sonuçları her zaman taze olmalı.
 *
 * SEO Stratejisi:
 * Search sayfaları genelde "noindex" yapılır ama burada farklı:
 * Şehir + kategori kombinasyonları (örn. ?city=Berlin&category=fkk-club)
 * yüksek arama hacmli kombinasyonlardır. Bu yüzden:
 * - Tek parametre kombinasyonları: indexlenebilir (canonical ile)
 * - Çoklu parametre kombinasyonları: noindex (duplicate content riski)
 */

import type { Metadata } from 'next'
import { fetchSearch } from '../../../../lib/api/client'
import { CATEGORY_CONFIG, SITE_CONFIG } from '../../../../lib/seo/utils/constants'
import type { VenueCategory } from '../../../../types/schema.types'

// ─── Render modu: her zaman dinamik ──────────────────────────────────────────
export const dynamic = 'force-dynamic'
export const revalidate = 0

// ─── Tipler ───────────────────────────────────────────────────────────────────

interface SearchPageProps {
  params: { locale: string }
  searchParams: {
    q?: string
    city?: string
    category?: string
    page?: string
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q, city, category } = searchParams
  const paramCount = [q, city, category].filter(Boolean).length

  // Tek parametre → indexlenebilir, canonical ekle
  if (paramCount === 1) {
    let title = 'Suche – DesireMap'
    let description = 'Verifizierte Clubs und Locations auf DesireMap durchsuchen.'

    if (city && !q && !category) {
      title = `Clubs & Locations in ${city} – DesireMap`
      description = `Alle verifizierten Erwachsenenclubs in ${city}: FKK, Bordelle, Saunaclubs und mehr. Diskret, geprüft und buchbar.`
    } else if (category && !q && !city) {
      const catConfig = CATEGORY_CONFIG[category as VenueCategory]
      if (catConfig) {
        title = catConfig.metaTitle
        description = catConfig.metaDesc
      }
    } else if (q) {
      title = `„${q}" – Suchergebnisse | DesireMap`
      description = `Suchergebnisse für „${q}" auf DesireMap. Verifizierte Clubs und Locations in Deutschland.`
    }

    const canonicalParams = new URLSearchParams()
    if (q) canonicalParams.set('q', q)
    if (city) canonicalParams.set('city', city)
    if (category) canonicalParams.set('category', category)

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_CONFIG.url}/search?${canonicalParams.toString()}`,
      },
      robots: { index: true, follow: true },
    }
  }

  // Çoklu parametre → noindex (duplicate content)
  return {
    title: 'Suche – DesireMap',
    robots: { index: false, follow: true },
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, city, category, page } = searchParams
  const currentPage = Number(page ?? 1)

  // Her zaman API'dan taze veri
  const results = await fetchSearch({
    q,
    city,
    category,
    page: currentPage,
    per_page: 24,
  })

  const { venues, total, per_page } = results
  const totalPages = Math.ceil(total / per_page)

  // Başlık dinamik oluştur
  const pageTitle = buildPageTitle(q, city, category, total)

  return (
    <main>
      {/* ── Arama başlığı ────────────────────────────────────────────── */}
      <section aria-label="Suchergebnisse" className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
          <p className="text-sm text-gray-500">
            {total} Ergebnisse gefunden
            {city ? ` in ${city}` : ''}
            {category && CATEGORY_CONFIG[category as VenueCategory]
              ? ` · ${CATEGORY_CONFIG[category as VenueCategory].plural}`
              : ''}
          </p>
        </div>
      </section>

      {/* ── Filtreler ────────────────────────────────────────────────── */}
      <section aria-label="Suchfilter" className="bg-gray-50 border-b py-3">
        <div className="container mx-auto px-4">
          <SearchFilters
            currentQ={q}
            currentCity={city}
            currentCategory={category}
          />
        </div>
      </section>

      {/* ── Sonuçlar ─────────────────────────────────────────────────── */}
      <section aria-label="Ergebnisliste" className="py-8">
        <div className="container mx-auto px-4">
          {venues.length === 0 ? (
            <EmptyState q={q} city={city} />
          ) : (
            <>
              {/* Sonuç listesi — semantik <ul> SEO için */}
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                aria-label="Gefundene Locations"
              >
                {venues.map((venue) => (
                  <li key={venue.id}>
                    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-rose-300 transition-colors h-full">
                      {/* Thumbnail */}
                      {venue.thumbnail_url ? (
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                          <img
                            src={venue.thumbnail_url}
                            alt={`${venue.name} – ${venue.city}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width={400}
                            height={300}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gray-100" aria-hidden />
                      )}

                      <div className="p-4">
                        {/* Kategori tag */}
                        <span className="text-xs text-rose-600 font-medium uppercase tracking-wide">
                          {CATEGORY_CONFIG[venue.category as VenueCategory]?.label ??
                            venue.category}
                        </span>

                        {/* Venue adı — H2 semantik */}
                        <h2 className="text-base font-semibold text-gray-900 mt-1 mb-1 leading-tight">
                          <a
                            href={`/venue/${venue.slug}`}
                            className="hover:text-rose-700 transition-colors"
                          >
                            {venue.name}
                          </a>
                        </h2>

                        {/* Şehir */}
                        <p className="text-sm text-gray-500 mb-2">{venue.city}</p>

                        {/* Rating */}
                        {venue.rating_value && venue.review_count > 0 && (
                          <div
                            className="flex items-center gap-1 text-sm"
                            aria-label={`Bewertung: ${venue.rating_value} von 5`}
                          >
                            <span className="text-amber-500" aria-hidden>★</span>
                            <span className="font-medium">{venue.rating_value.toFixed(1)}</span>
                            <span className="text-gray-400">({venue.review_count})</span>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {venue.is_verified && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                              Verifiziert
                            </span>
                          )}
                          {venue.has_reservation && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              Reservierung
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={{ q, city, category }}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* ── SEO metin bloğu (sadece şehir veya kategori aramasında) ─── */}
      {(city || category) && !q && (
        <SeoTextBlock city={city} category={category as VenueCategory | undefined} />
      )}
    </main>
  )
}

// ─── Alt component'ler ────────────────────────────────────────────────────────

function buildPageTitle(
  q?: string,
  city?: string,
  category?: string,
  total?: number
): string {
  if (q && city) return `„${q}" in ${city}`
  if (q) return `Suchergebnisse für „${q}"`
  if (city && category && CATEGORY_CONFIG[category as VenueCategory]) {
    return `${CATEGORY_CONFIG[category as VenueCategory].plural} in ${city}`
  }
  if (city) return `Clubs & Locations in ${city}`
  if (category && CATEGORY_CONFIG[category as VenueCategory]) {
    return CATEGORY_CONFIG[category as VenueCategory].plural
  }
  return 'Alle Locations'
}

function SearchFilters({
  currentQ,
  currentCity,
  currentCategory,
}: {
  currentQ?: string
  currentCity?: string
  currentCategory?: string
}) {
  // Client component değil — form action ile çalışır, JS olmadan da işler
  return (
    <form method="GET" action="/search" className="flex flex-wrap gap-3 items-center">
      <input
        type="search"
        name="q"
        defaultValue={currentQ}
        placeholder="Suchen..."
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
      <input
        type="text"
        name="city"
        defaultValue={currentCity}
        placeholder="Stadt"
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
      <select
        name="category"
        defaultValue={currentCategory}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      >
        <option value="">Alle Kategorien</option>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>
            {config.plural}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
      >
        Suchen
      </button>
      {(currentQ || currentCity || currentCategory) && (
        <a href="/search" className="text-sm text-gray-500 hover:text-gray-700">
          Zurücksetzen
        </a>
      )}
    </form>
  )
}

function EmptyState({ q, city }: { q?: string; city?: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 text-lg mb-2">Keine Ergebnisse gefunden</p>
      <p className="text-gray-400 text-sm">
        {q && `Für „${q}" `}
        {city && `in ${city} `}
        wurden keine verifizierten Locations gefunden.
      </p>
      <a href="/search" className="mt-4 inline-block text-rose-600 text-sm hover:underline">
        Alle Locations anzeigen
      </a>
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', String(page))
    return `/search?${params.toString()}`
  }

  return (
    <nav aria-label="Seitennavigation" className="flex justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <a
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          rel="prev"
        >
          ← Zurück
        </a>
      )}
      <span className="px-4 py-2 text-sm text-gray-500">
        Seite {currentPage} von {totalPages}
      </span>
      {currentPage < totalPages && (
        <a
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          rel="next"
        >
          Weiter →
        </a>
      )}
    </nav>
  )
}

// ─── SEO metin bloğu (şehir/kategori aramasında) ─────────────────────────────
// Google bu metni category/city landing page gibi değerlendirir.

function SeoTextBlock({
  city,
  category,
}: {
  city?: string
  category?: VenueCategory
}) {
  const catConfig = category ? CATEGORY_CONFIG[category] : null

  const text =
    city && catConfig
      ? `${catConfig.plural} in ${city} auf DesireMap – alle aufgeführten Betriebe sind verifiziert und erfüllen die Anforderungen des deutschen Prostitutionsschutzgesetzes. ` +
        `Nutzen Sie die Filteroptionen, um nach Öffnungszeiten, Ausstattung und Reservierbarkeit zu filtern.`
      : city
      ? `Alle verifizierten Erwachsenenlocations in ${city} auf einen Blick. DesireMap zeigt ausschließlich Betriebe, die legal tätig sind und transparente Informationen bereitstellen.`
      : catConfig
      ? `${catConfig.plural} in Deutschland – verifiziert, diskret und direkt buchbar. DesireMap verzichtet bewusst auf explizite Inhalte und setzt auf sachliche, geprüfte Informationen.`
      : null

  if (!text) return null

  return (
    <section aria-label="Informationen" className="bg-gray-50 border-t py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    </section>
  )
}
