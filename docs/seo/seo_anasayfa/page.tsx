/**
 * Ana Sayfa
 * ─────────────────────────────────────────────────────────────────────────────
 * URL:  desiremap.de/          (de — prefix yok)
 *       desiremap.de/en/       (en — prefix var)
 *
 * App Router: app/[locale]/page.tsx
 *
 * Render: ISR — revalidate 3600 (1 saat)
 *
 * SEO Yapısı:
 *   H1  → Ana değer önerisi (tek)
 *   H2  → Her ana section başlığı (6 adet)
 *   H3  → Kategori kartları, USP başlıkları, FAQ soruları
 *
 * Schema inject sırası (Google öncelik sırasına göre):
 *   1. Organization
 *   2. WebSite + SearchAction
 *   3. WebPage
 *   4. BreadcrumbList
 *   5. HowTo           ← Google rich result
 *   6. ItemList        ← Featured venues
 *   7. FAQPage         ← AI citation için kritik
 */

import type { Metadata } from 'next'
import { JsonLd } from '../../components/seo/JsonLd'
import { fetchHomePageData } from '../../lib/api/homepage'
import { SITE_CONFIG, CATEGORY_CONFIG, MAJOR_CITIES } from '../../lib/seo/utils/constants'
import {
  generateHeroDescription,
  generateHowToSteps,
  generateUspItems,
  generateCategoryIntros,
  generateTrustSection,
  generateHomeFaqs,
  buildHowToSchema,
} from '../../lib/seo/content/homepage-content'

// ─── ISR ─────────────────────────────────────────────────────────────────────
export const revalidate = 3600

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const title = `DesireMap – Verifizierte Clubs & Locations in Deutschland`
  const description =
    `${Object.keys(MAJOR_CITIES).length}+ Städte, geprüfte Adressen, direkte Reservierung. ` +
    `FKK Clubs, Bordelle, Saunaclubs – sachlich, diskret, ohne explizite Inhalte.`

  return {
    title,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: { 'de-DE': SITE_CONFIG.url, 'en': `${SITE_CONFIG.url}/en` },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      url: SITE_CONFIG.url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@desiremapde',
    },
    other: {
      // JMStV + RTA adult content label — tüm sayfalarda
      rating: 'adult',
      RATING: 'RTA-5042-1996-1400-1577-RTA',
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const api = await fetchHomePageData()
  const currentYear = new Date().getFullYear()

  const contentVars = {
    totalVenueCount: api.stats.total_venues,
    totalCityCount: api.stats.total_cities,
    currentYear,
  }

  // İçerik üretimi
  const heroDescription  = generateHeroDescription(contentVars)
  const howToSteps       = generateHowToSteps()
  const uspItems         = generateUspItems()
  const categoryIntros   = generateCategoryIntros()
  const trustText        = generateTrustSection(contentVars)
  const faqs             = generateHomeFaqs(contentVars)

  // Schema'lar
  const schemas = buildHomePageSchemas(api, faqs, contentVars.totalVenueCount)

  return (
    <>
      <JsonLd schemas={schemas} />

      <main id="main-content">

        {/* ══════════════════════════════════════════════════════════════
            HERO — H1 + direkt cevap paragrafı
            Google ve AI bu section'ı ilk indexler.
            İlk 40 kelime snippet olarak kullanılır.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="hero-heading" className="bg-white pt-16 pb-12 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">

            {/* H1 — ana keyword: kategori + ülke */}
            <h1
              id="hero-heading"
              className="text-4xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Verifizierte Clubs &amp; Locations in Deutschland
            </h1>

            {/* Direkt cevap paragrafı — min 40 kelime, AI snippet için */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-8">
              {heroDescription}
            </p>

            {/* City search — kullanıcı ilk etkileşim noktası */}
            <form
              method="GET"
              action="/search"
              className="flex gap-3 max-w-xl"
              role="search"
              aria-label="Stadtsuche"
            >
              <label htmlFor="city-search" className="sr-only">
                Stadt eingeben
              </label>
              <input
                id="city-search"
                type="text"
                name="city"
                placeholder="Stadt eingeben, z. B. Berlin..."
                autoComplete="address-level2"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base
                           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-rose-600 text-white px-6 py-3 rounded-xl font-medium
                           hover:bg-rose-700 transition-colors whitespace-nowrap"
              >
                Suchen
              </button>
            </form>

            {/* Stats bar */}
            <div
              className="flex flex-wrap gap-6 mt-8 text-sm text-gray-500"
              aria-label="Plattform-Statistiken"
            >
              <span>
                <strong className="text-gray-800 font-semibold">
                  {api.stats.total_venues.toLocaleString('de-DE')}
                </strong>{' '}
                Locations
              </span>
              <span>
                <strong className="text-gray-800 font-semibold">
                  {api.stats.total_cities}
                </strong>{' '}
                Städte
              </span>
              <span>
                <strong className="text-gray-800 font-semibold">
                  {api.stats.total_verified.toLocaleString('de-DE')}
                </strong>{' '}
                verifiziert
              </span>
              <span>
                <strong className="text-gray-800 font-semibold">
                  {api.stats.total_with_reservation.toLocaleString('de-DE')}
                </strong>{' '}
                mit Reservierung
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            KATEGORIEN — H2 + H3 hiyerarşisi
            ItemList schema ile eşleştirilmiş.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="categories-heading" className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2
              id="categories-heading"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Kategorien
            </h2>
            <p className="text-gray-500 mb-8 text-base">
              Alle Betriebe auf DesireMap sind einer Kategorie zugeordnet
              und erfüllen die entsprechenden gesetzlichen Anforderungen.
            </p>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              aria-label="Verfügbare Kategorien"
            >
              {categoryIntros.map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={`/${cat.slug}`}
                    className="group block p-6 rounded-2xl border border-gray-200
                               hover:border-rose-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-700 transition-colors">
                      {cat.plural}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cat.intro}
                    </p>
                    <span className="inline-block mt-4 text-sm text-rose-600 font-medium">
                      Alle {cat.plural} →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            EMPFOHLENE LOCATIONS — Featured venues
            ItemList schema ile eşleştirilmiş.
        ══════════════════════════════════════════════════════════════ */}
        {api.featured_venues.length > 0 && (
          <section aria-labelledby="featured-heading" className="py-14 bg-gray-50">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2
                id="featured-heading"
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Empfohlene Locations
              </h2>
              <p className="text-gray-500 mb-8 text-base">
                Manuell ausgewählte, verifizierte Betriebe aus verschiedenen Kategorien und Städten.
              </p>

              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                aria-label="Empfohlene Locations"
              >
                {api.featured_venues.slice(0, 9).map((venue) => {
                  const catConfig = CATEGORY_CONFIG[venue.category as keyof typeof CATEGORY_CONFIG]
                  return (
                    <li key={venue.id}>
                      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden
                                          hover:border-rose-300 hover:shadow-sm transition-all h-full flex flex-col">
                        {/* Thumbnail */}
                        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                          {venue.thumbnail_url ? (
                            <img
                              src={venue.thumbnail_url}
                              alt={`${venue.name} – ${venue.city}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              width={480}
                              height={270}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" aria-hidden />
                          )}
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          {/* Kategori */}
                          <span className="text-xs font-medium text-rose-600 uppercase tracking-wide mb-1">
                            {catConfig?.label ?? venue.category}
                          </span>

                          {/* H3 — mekan adı */}
                          <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1">
                            <a
                              href={`/venue/${venue.slug}`}
                              className="hover:text-rose-700 transition-colors"
                            >
                              {venue.name}
                            </a>
                          </h3>

                          {/* Şehir */}
                          <p className="text-sm text-gray-500 mb-3">{venue.city}</p>

                          {/* Rating */}
                          {venue.rating_value && venue.review_count > 0 && (
                            <div
                              className="flex items-center gap-1 text-sm mb-3"
                              aria-label={`${venue.rating_value.toFixed(1)} von 5 Sternen`}
                            >
                              <span className="text-amber-400" aria-hidden>★</span>
                              <span className="font-medium text-gray-800">
                                {venue.rating_value.toFixed(1)}
                              </span>
                              <span className="text-gray-400 text-xs">
                                ({venue.review_count})
                              </span>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="flex gap-2 mt-auto flex-wrap">
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
                  )
                })}
              </ul>

              <div className="mt-8 text-center">
                <a
                  href="/search"
                  className="inline-block border border-gray-300 text-gray-700 px-6 py-3
                             rounded-xl text-sm font-medium hover:border-rose-300 hover:text-rose-700 transition-colors"
                >
                  Alle Locations anzeigen
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TOP STÄDTE — Şehir bazlı navigasyon
            GEO sinyali için şehir adları ve linkleri burada.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="cities-heading" className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2
              id="cities-heading"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Locations nach Stadt
            </h2>
            <p className="text-gray-500 mb-8 text-base">
              DesireMap ist in allen großen deutschen Städten vertreten.
              Wählen Sie eine Stadt, um alle verifizierten Locations in Ihrer Nähe zu sehen.
            </p>

            <ul
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              aria-label="Städte"
            >
              {api.top_cities.map((cityItem) => (
                <li key={cityItem.slug}>
                  <a
                    href={`/stadt/${cityItem.slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl
                               border border-gray-200 hover:border-rose-300 hover:bg-rose-50
                               transition-all text-sm"
                  >
                    <span className="font-medium text-gray-800">{cityItem.city}</span>
                    <span className="text-xs text-gray-400 ml-2">{cityItem.venue_count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            WIE ES FUNKTIONIERT — HowTo schema
            Google "How to" rich result için.
            3 adım — sıralı liste (ol) zorunlu.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="howto-heading" id="wie-es-funktioniert" className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2
              id="howto-heading"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Wie funktioniert DesireMap?
            </h2>
            <p className="text-gray-500 mb-10 text-base">
              In drei Schritten zur passenden Location – diskret, informiert, ohne Umwege.
            </p>

            <ol
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              aria-label="Schritte zur Nutzung von DesireMap"
            >
              {howToSteps.map((step) => (
                <li
                  key={step.position}
                  id={`schritt-${step.position}`}
                  className="flex flex-col"
                >
                  <div
                    className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold
                                flex items-center justify-center text-lg mb-4 shrink-0"
                    aria-hidden
                  >
                    {step.position}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {step.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            WARUM DESIREMAP — USP / E-E-A-T
            "Pornografi yok" differentiator burada açıkça belirtilir.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="usp-heading" className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2
              id="usp-heading"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Warum DesireMap?
            </h2>
            <p className="text-gray-500 mb-10 text-base max-w-2xl">
              {trustText}
            </p>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              aria-label="Vorteile von DesireMap"
            >
              {uspItems.map((usp) => (
                <li
                  key={usp.title}
                  className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50"
                >
                  {/* Icon placeholder — projenizin icon sistemine göre değiştirin */}
                  <div
                    className="w-8 h-8 rounded-lg bg-rose-100 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {usp.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {usp.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FAQ — FAQPage schema + GEO citation
            Her soru min 40 kelime cevap içerir.
            <dl> yerine <section>+<dl> — semantik doğru.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="faq-heading" className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2
              id="faq-heading"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Häufige Fragen
            </h2>
            <p className="text-gray-500 mb-10 text-base">
              Antworten auf die häufigsten Fragen zur Nutzung von DesireMap.
            </p>

            <dl className="space-y-0 divide-y divide-gray-200">
              {faqs.map((faq, i) => (
                <div key={i} className="py-6">
                  <dt className="text-base font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </dt>
                  <dd className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            RECHTLICHES — Legal footer bölümü (impressum linki dahil)
            JMStV uyumu için görünür legal metin zorunlu.
        ══════════════════════════════════════════════════════════════ */}
        <section aria-label="Rechtliche Hinweise" className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
              DesireMap ist ein Informationsportal für volljährige Nutzer ab 18 Jahren.
              Alle gelisteten Betriebe sind behördlich zugelassen und erfüllen die Anforderungen
              des deutschen Prostitutionsschutzgesetzes (ProstSchG). DesireMap zeigt ausschließlich
              sachliche, nicht-explizite Informationen.{' '}
              <a href="/impressum" className="underline hover:text-gray-600">Impressum</a>
              {' · '}
              <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutz</a>
              {' · '}
              <a href="/nutzungsbedingungen" className="underline hover:text-gray-600">Nutzungsbedingungen</a>
            </p>
          </div>
        </section>

      </main>
    </>
  )
}

// ─── Schema builder (inline — sadece bu sayfaya özel) ────────────────────────

function buildHomePageSchemas(
  api: Awaited<ReturnType<typeof fetchHomePageData>>,
  faqs: ReturnType<typeof generateHomeFaqs>,
  totalVenueCount: number
): object[] {
  const siteUrl = SITE_CONFIG.url

  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.organization.legalName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logo.png`,
      width: 300,
      height: 60,
    },
    foundingYear: SITE_CONFIG.foundingYear,
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.organization.email,
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
      areaServed: ['DE'],
    },
    sameAs: [SITE_CONFIG.social.twitter, SITE_CONFIG.social.instagram],
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_CONFIG.name,
    description:
      'Deutschlands führendes Verzeichnis für verifizierte Erwachsenenclubs, FKK-Anlagen und diskrete Locations – mit direkter Reservierung.',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'de',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: siteUrl,
    name: 'DesireMap – Verifizierte Clubs & Locations in Deutschland',
    description:
      'Alle verifizierten Erwachsenenlocations in Deutschland: FKK Clubs, Bordelle, Saunaclubs. Sachlich, diskret, direkt buchbar.',
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: 'de',
    breadcrumb: { '@id': `${siteUrl}/#breadcrumb` },
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'DesireMap',
        item: siteUrl,
      },
    ],
  }

  const howTo = buildHowToSchema(siteUrl)

  const itemList = {
    '@type': 'ItemList',
    name: `Empfohlene Locations auf DesireMap – ${totalVenueCount.toLocaleString('de-DE')} verifizierte Betriebe`,
    numberOfItems: api.featured_venues.length,
    itemListElement: api.featured_venues.slice(0, 9).map((venue, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': CATEGORY_CONFIG[venue.category as keyof typeof CATEGORY_CONFIG]?.schemaType ?? 'LocalBusiness',
        '@id': `${siteUrl}/venue/${venue.slug}#venue`,
        name: venue.name,
        url: `${siteUrl}/venue/${venue.slug}`,
        ...(venue.thumbnail_url && {
          image: { '@type': 'ImageObject', url: venue.thumbnail_url },
        }),
        ...(venue.rating_value && venue.review_count > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: venue.rating_value,
            reviewCount: venue.review_count,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
    })),
  }

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return [organization, website, webpage, breadcrumb, howTo, itemList, faqSchema]
}

