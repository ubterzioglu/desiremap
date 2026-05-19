import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Building2, Star, Shield } from 'lucide-react'
import { backendApi } from '@/lib/backend-client'
import type { PublicCity, PublicEstablishment } from '@/types'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getSearchPath, getCityPath } from '@/lib/navigation'
import {
  getFallbackPublicStadtCities,
  getFallbackPublicStadtCity,
  getPublicCityImage,
  getPublicCityVenueCount,
  selectLocalizedCityText,
} from '@/lib/public-cities'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'tr', 'ar']

async function getStadtCities(): Promise<PublicCity[]> {
  return backendApi
    .getPublicStadtCities()
    .then((response) => response.items)
    .catch(() => getFallbackPublicStadtCities())
}

async function getStadtCity(slug: string): Promise<PublicCity | null> {
  return backendApi
    .getPublicStadtCity(slug)
    .catch(() => getFallbackPublicStadtCity(slug))
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  const cities = await getStadtCities()

  return cities.flatMap((city) =>
    locales.map((locale) => ({ locale, city: city.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}): Promise<Metadata> {
  const { locale, city } = await params
  const cityData = await getStadtCity(city)
  if (!cityData) return {}

  const title =
    selectLocalizedCityText(cityData.seoTitle, locale)
    || `${cityData.name} — FKK Clubs, Laufhäuser & Studios | DesireMap`
  const description = selectLocalizedCityText(
    cityData.seoDescription,
    locale,
    selectLocalizedCityText(cityData.description, locale)
  )
  const image = getPublicCityImage(cityData)

  const canonical = locale === 'de'
    ? `/stadt/${cityData.slug}`
    : `/${locale}/stadt/${cityData.slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        de: `/stadt/${cityData.slug}`,
        en: `/en/stadt/${cityData.slug}`,
        tr: `/tr/stadt/${cityData.slug}`,
        ar: `/ar/stadt/${cityData.slug}`,
        'x-default': `/stadt/${cityData.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonical}`,
      siteName: 'DesireMap',
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}) {
  const { locale, city } = await params
  const cityData = await getStadtCity(city)

  if (!cityData) {
    notFound()
  }

  if (cityData.slug !== city) {
    redirect(getCityPath(locale, cityData.slug))
  }

  const t = await getTranslations({ locale, namespace: 'nav' })
  const allCities = await getStadtCities()
  const cityResult = await backendApi.getPublicEstablishments({ city: cityData.slug, limit: 12 }).catch(() => ({ results: [] as PublicEstablishment[], total: 0 }))
  const cityBordells = (Array.isArray(cityResult?.results) ? cityResult.results : []).map((est, index) => ({
    key: typeof est?.slug === 'string' && est.slug.length > 0 ? est.slug : `${city}-${index}`,
    city: typeof est?.city === 'string' && est.city.length > 0 ? est.city : cityData.name,
    name: typeof est?.name === 'string' && est.name.length > 0 ? est.name : 'Unbekannter Betrieb',
    priceMin: typeof est?.priceMin === 'number' ? est.priceMin : null,
    rating: typeof est?.rating === 'number' ? est.rating : null,
    typeLabel: typeof est?.type === 'string' && est.type.length > 0 ? est.type.toUpperCase() : 'BETRIEB',
  }))
  const description = selectLocalizedCityText(cityData.description, locale)
  const subtitle = selectLocalizedCityText(cityData.subtitle, locale)
  const image = getPublicCityImage(cityData)

  return (
    <main className="flex min-h-screen flex-col bg-[#0b1326]">
      <Header
        locale={locale}
        translations={{
          home: t('home'),
          discover: t('discover'),
          cities: t('cities'),
          premium: t('premium'),
          advertise: t('advertise'),
          login: t('login'),
          register: t('register'),
          myAccount: t('myAccount'),
        }}
      />

      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#0b1326]">
        <div className="absolute inset-0 z-0">
          {image ? (
            <Image
              src={image}
              alt={`${cityData.name} cityscape`}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#8b1a4a]/25 via-[#0F172A] to-[#0b1326]" />
          )}
          <div className="absolute inset-0 bg-[#0b1326]/60" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0b1326] via-[#0b1326]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0b1326]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-[20px]">
            <MapPin className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-[#dae2fd]">{subtitle || cityData.name}</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-wider text-[#dae2fd] sm:text-6xl md:text-7xl">
            {cityData.name}
          </h1>

          {description && (
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#a48a90] sm:text-lg">
              {description}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 rounded-xl border border-[#564146] bg-white/[0.03] px-4 py-3 backdrop-blur-[20px]">
              <Building2 className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-semibold text-[#dae2fd]">{getPublicCityVenueCount(cityData)}</span>
              <span className="text-sm text-[#a48a90]">Betriebe</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#564146] bg-white/[0.03] px-4 py-3 backdrop-blur-[20px]">
              <Star className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-semibold text-[#dae2fd]">4.6</span>
              <span className="text-sm text-[#a48a90]">Ø Rating</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#564146] bg-white/[0.03] px-4 py-3 backdrop-blur-[20px]">
              <Shield className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-semibold text-[#dae2fd]">100%</span>
              <span className="text-sm text-[#a48a90]">Verifiziert</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={getSearchPath(locale, { city: cityData.slug })}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8b1a4a] to-[#6b1a5c] px-8 py-4 text-sm font-semibold text-[#dae2fd] transition-all hover:from-[#a8255c] hover:to-[#7d2a6e]"
            >
              <span>Alle Betriebe in {cityData.name} durchsuchen</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-[#0F172A] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {cityBordells.length > 0 ? (
            <>
              <h2 className="mb-8 text-2xl font-bold text-[#dae2fd] sm:text-3xl">
                Top Adressen in {cityData.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {cityBordells.map((est) => (
                  <Link
                    key={est.key}
                    href={getSearchPath(locale, { q: est.name, city: est.city })}
                    className="group rounded-2xl border border-[#564146] bg-[#131b2e] p-5 transition-all hover:-translate-y-1 hover:border-[#B76E79]/60 hover:bg-[#1a2333]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-[#8b1a4a]/30 px-3 py-1 text-xs font-medium text-[#ffb1c6]">
                        {est.typeLabel}
                      </span>
                      {est.rating != null && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#D4AF37]" />
                          <span className="text-sm font-semibold text-[#dae2fd]">{est.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#dae2fd] transition-colors group-hover:text-[#ffb1c6]">
                      {est.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-[#a48a90]">
                        {est.priceMin != null ? `ab €${est.priceMin}` : 'Auf Anfrage'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <h2 className="mb-4 text-2xl font-bold text-[#dae2fd]">
                Bald verfügbar in {cityData.name}
              </h2>
              <p className="mb-8 text-[#a48a90]">
                Wir erweitern kontinuierlich unser Angebot.
              </p>
              <Link
                href={getSearchPath(locale, { city: cityData.slug })}
                className="inline-flex items-center gap-2 rounded-full border border-[#564146] bg-transparent px-6 py-3 text-sm font-medium text-[#dae2fd] transition-all hover:border-[#B76E79] hover:bg-white/[0.03]"
              >
                Stattdessen suchen
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative border-t border-[#564146] bg-[#0F172A] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-[#dae2fd] sm:text-3xl">
            Weitere Städte
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {allCities
              .filter((item) => item.slug !== cityData.slug)
              .map((item) => {
                return (
                  <Link
                    key={item.slug}
                    href={getCityPath(locale, item.slug)}
                    className="group rounded-2xl border border-[#564146] bg-[#131b2e] p-5 transition-all hover:-translate-y-1 hover:border-[#B76E79]/60 hover:bg-[#1a2333]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b1a4a]/30 to-[#6b1a5c]/30">
                        <MapPin className="h-4 w-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#dae2fd] transition-colors group-hover:text-[#ffb1c6]">
                          {item.name}
                        </div>
                        <div className="text-sm text-[#a48a90]">{getPublicCityVenueCount(item)} Betriebe</div>
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
