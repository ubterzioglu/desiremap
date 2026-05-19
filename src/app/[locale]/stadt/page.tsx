import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { backendApi } from '@/lib/backend-client'
import { getCityPath } from '@/lib/navigation'
import {
  getFallbackPublicStadtCities,
  getPublicCityImage,
  getPublicCityVenueCount,
} from '@/lib/public-cities'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    de: 'Städte — FKK Clubs & Studios in Deutschland | DesireMap',
    en: 'Cities — FKK Clubs & Studios in Germany | DesireMap',
    tr: 'Şehirler — Almanya\'da FKK Kulüpleri & Stüdyolar | DesireMap',
    ar: 'المدن — نوادي FKK والاستوديوهات في ألمانيا | DesireMap',
  }
  const canonical = locale === 'de' ? '/stadt' : `/${locale}/stadt`
  return {
    title: titles[locale] || titles.de,
    alternates: {
      canonical,
      languages: {
        de: '/stadt',
        en: '/en/stadt',
        tr: '/tr/stadt',
        ar: '/ar/stadt',
        'x-default': '/stadt',
      },
    },
  }
}

export default async function StadtIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const cities = await backendApi
    .getPublicStadtCities()
    .then((response) => response.items)
    .catch(() => getFallbackPublicStadtCities())

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

      <section className="relative px-4 pt-20 pb-16 sm:px-6">
        {/* Glassmorphic header section */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#0b1326]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header with glassmorphic background */}
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-[20px] sm:mb-14 sm:p-10">
            <span className="mb-4 inline-block text-xs font-bold tracking-[0.05em] text-[#D4AF37] uppercase sm:text-sm">
              Deutschland
            </span>
            <h1 className="mb-4 text-3xl font-bold text-[#dae2fd] sm:text-5xl">Städte</h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#a48a90] sm:text-base">
              Entdecke FKK Clubs, Laufhäuser und Studios in den größten Städten Deutschlands.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => {
              const image = getPublicCityImage(city)

              return (
              <Link
                key={city.slug}
                href={getCityPath(locale, city.slug)}
                className="group relative overflow-hidden rounded-2xl border border-[#564146] bg-[#131b2e] transition-all duration-300 hover:border-[#B76E79] hover:bg-[#1a2333]"
              >
                <div className="absolute inset-0">
                  {image ? (
                    <Image
                      src={image}
                      alt={city.name}
                      fill
                      className="object-cover opacity-25 transition-opacity duration-300 group-hover:opacity-40"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b1a4a]/20 via-[#0F172A] to-[#0b1326]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/70 to-transparent" />
                </div>
                <div className="relative z-10 flex min-h-[160px] items-end justify-between p-6">
                  <div>
                    <div className="mb-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span className="text-xs text-[#a48a90]">{getPublicCityVenueCount(city)} Betriebe</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#dae2fd] transition-colors duration-300 group-hover:text-[#ffb1c6] sm:text-2xl">
                      {city.name}
                    </h2>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#564146] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#B76E79]" />
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
