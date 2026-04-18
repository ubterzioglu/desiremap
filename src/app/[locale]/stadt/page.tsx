import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { citiesData } from '@/data/cities'
import { getCityPath } from '@/lib/navigation'
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

      <section className="relative pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a14] to-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <span className="inline-block text-[#b76e79] text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">
              Deutschland
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Städte</h1>
            <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Entdecke FKK Clubs, Laufhäuser und Studios in den größten Städten Deutschlands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {citiesData.map((city) => (
              <Link
                key={city.slug}
                href={getCityPath(locale, city.slug)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#8b1a4a]/50 transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="relative z-10 p-6 flex items-end justify-between min-h-[160px]">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b76e79]" />
                      <span className="text-xs text-gray-400">{city.count} Betriebe</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#e8a0b0] transition-colors duration-300">
                      {city.name}
                    </h2>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#b76e79] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
