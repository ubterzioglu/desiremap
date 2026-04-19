import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Building2, Star, Shield } from 'lucide-react'
import { getCityBySlug, citySlugs } from '@/data/cities'
import { backendApi } from '@/lib/backend-client'
import type { PublicEstablishment } from '@/types'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getSearchPath, getCityPath } from '@/lib/navigation'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'tr', 'ar']

export function generateStaticParams() {
  return citySlugs.flatMap((city) =>
    locales.map((locale) => ({ locale, city }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}): Promise<Metadata> {
  const { locale, city } = await params
  const cityData = getCityBySlug(city)
  if (!cityData) return {}

  const titles: Record<string, string> = {
    de: `${cityData.name} — FKK Clubs, Laufhäuser & Studios | DesireMap`,
    en: `${cityData.name} — FKK Clubs, Laufhaus & Studios | DesireMap`,
    tr: `${cityData.name} — FKK Kulüpleri, Laufhaus ve Stüdyolar | DesireMap`,
    ar: `${cityData.name} — نوادي FKK والاستوديوهات | DesireMap`,
  }

  const canonical = locale === 'de' ? `/stadt/${city}` : `/${locale}/stadt/${city}`

  return {
    title: titles[locale] || titles.de,
    description: cityData.descriptions[locale] || cityData.descriptions.de,
    alternates: {
      canonical,
      languages: {
        de: `/stadt/${city}`,
        en: `/en/stadt/${city}`,
        tr: `/tr/stadt/${city}`,
        ar: `/ar/stadt/${city}`,
        'x-default': `/stadt/${city}`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.de,
      description: cityData.descriptions[locale] || cityData.descriptions.de,
      url: `${siteUrl}${canonical}`,
      siteName: 'DesireMap',
      images: [{ url: cityData.image, width: 1200, height: 630 }],
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}) {
  const { locale, city } = await params
  const cityData = getCityBySlug(city)

  if (!cityData) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'nav' })
  const cityResult = await backendApi.getPublicEstablishments({ city: cityData.name, limit: 12 }).catch(() => ({ results: [] as PublicEstablishment[], total: 0 }))
  const cityBordells = (Array.isArray(cityResult?.results) ? cityResult.results : []).map((est, index) => ({
    key: typeof est?.slug === 'string' && est.slug.length > 0 ? est.slug : `${city}-${index}`,
    city: typeof est?.city === 'string' && est.city.length > 0 ? est.city : cityData.name,
    name: typeof est?.name === 'string' && est.name.length > 0 ? est.name : 'Unbekannter Betrieb',
    priceMin: typeof est?.priceMin === 'number' ? est.priceMin : null,
    rating: typeof est?.rating === 'number' ? est.rating : null,
    typeLabel: typeof est?.type === 'string' && est.type.length > 0 ? est.type.toUpperCase() : 'BETRIEB',
  }))
  const description = cityData.descriptions[locale] || cityData.descriptions.de
  const subtitle = cityData.subtitles[locale] || cityData.subtitles.de

  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header
        locale={locale}
        translations={{
          discover: t('discover'),
          cities: t('cities'),
          premium: t('premium'),
          advertise: t('advertise'),
          login: t('login'),
          register: t('register'),
          myAccount: t('myAccount'),
        }}
      />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={cityData.image}
            alt={`${cityData.name} cityscape`}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-[#b76e79]" />
            <span className="text-sm text-gray-300">{subtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-wider mb-6">
            {cityData.name}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <Building2 className="w-5 h-5 text-[#b76e79]" />
              <span className="text-white font-semibold">{cityData.count}</span>
              <span className="text-gray-400 text-sm">Betriebe</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <Star className="w-5 h-5 text-[#b76e79]" />
              <span className="text-white font-semibold">4.6</span>
              <span className="text-gray-400 text-sm">Ø Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <Shield className="w-5 h-5 text-[#b76e79]" />
              <span className="text-white font-semibold">100%</span>
              <span className="text-gray-400 text-sm">Verifiziert</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={getSearchPath(locale, { city: cityData.name })}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] px-8 py-4 text-sm font-semibold text-white transition-all"
            >
              <span>Alle Betriebe in {cityData.name} durchsuchen</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-[#050507] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {cityBordells.length > 0 ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Top Adressen in {cityData.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cityBordells.map((est) => (
                  <Link
                    key={est.key}
                    href={getSearchPath(locale, { q: est.name, city: est.city })}
                    className="group rounded-2xl border border-white/10 bg-white/3 p-5 transition-all hover:-translate-y-1 hover:border-[#b76e79]/40 hover:bg-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex rounded-full bg-[#8b1a4a]/20 px-3 py-1 text-xs font-medium text-[#f0bec6]">
                        {est.typeLabel}
                      </span>
                      {est.rating != null && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white text-sm font-semibold">{est.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-[#b76e79] transition-colors">
                      {est.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-500 text-sm">
                        {est.priceMin != null ? `ab €${est.priceMin}` : 'Auf Anfrage'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">
                Bald verfügbar in {cityData.name}
              </h2>
              <p className="text-gray-400 mb-8">
                Wir erweitern kontinuierlich unser Angebot.
              </p>
              <Link
                href={getSearchPath(locale, { city: cityData.name })}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
              >
                Stattdessen suchen
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-[#050507] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Weitere Städte
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {citySlugs
              .filter((s) => s !== city)
              .map((slug) => {
                const c = getCityBySlug(slug)!
                return (
                  <Link
                    key={slug}
                    href={getCityPath(locale, slug)}
                    className="group rounded-2xl border border-white/10 bg-white/3 p-5 transition-all hover:-translate-y-1 hover:border-[#b76e79]/40 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8b1a4a]/30 to-[#6b3fa0]/30 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#b76e79]" />
                      </div>
                      <div>
                        <div className="text-white font-semibold group-hover:text-[#b76e79] transition-colors">
                          {c.name}
                        </div>
                        <div className="text-gray-400 text-sm">{c.count} Betriebe</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
