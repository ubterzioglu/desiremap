'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePublicStadtCities } from '@/hooks/useQueries'
import { getCityPath } from '@/lib/navigation'
import { getPublicCityImage, getPublicCityVenueCount } from '@/lib/public-cities'
import type { PublicCity, Translations } from '@/types'
import { cn } from '@/lib/utils'

type FeaturedCity = {
  count: number
  image?: string | null
  name: string
  slug: string
}

type FeaturedCitiesProps = {
  translations: Translations['cities']
}

function getCityCardStyle(city: FeaturedCity): { backgroundImage?: string } | undefined {
  if (typeof city.image !== 'string' || city.image.length === 0) {
    return undefined
  }

  return { backgroundImage: `url("${city.image}")` }
}

export function FeaturedCities({ translations }: FeaturedCitiesProps) {
  const locale = useLocale()
  const { data: backendCities } = usePublicStadtCities()

  const cities = useMemo<FeaturedCity[]>(() => {
    return (backendCities ?? [])
      .filter((city) => getPublicCityVenueCount(city) > 0)
      .map((city: PublicCity) => ({
        slug: city.slug,
        name: city.name,
        count: getPublicCityVenueCount(city),
        image: getPublicCityImage(city),
      }))
  }, [backendCities])

  return (
    <section className="relative overflow-hidden border-t border-white/6 bg-[#0b1326] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(212,175,55,0.12),transparent_20%),linear-gradient(180deg,rgba(11,19,38,0.82)_0%,rgba(6,14,32,0.96)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-[#564146] bg-[#8b1a4a]/12 px-4 py-1 text-[11px] font-bold tracking-[0.22em] text-[#ffd9e1] uppercase">
              {translations.subtitle}
            </span>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#dae2fd] sm:text-4xl lg:text-5xl">
              {translations.title}
            </h2>
          </div>
          <div className="rounded-[1.75rem] border border-[#334155]/55 bg-[#131b2e]/74 p-6 shadow-[0_24px_60px_rgba(6,14,32,0.28)] backdrop-blur-xl sm:p-7">
            <p className="max-w-2xl text-base leading-8 text-[#dcbfc5] sm:text-lg">
              Deutschlands wichtigste Stadtcluster mit direktem Einstieg in verifizierte Angebote, klarer Orientierung und diskretem Fokus.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cities.map((city, index) => (
            <motion.div
              key={city.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link
                href={getCityPath(locale, city.slug)}
                className="group relative block overflow-hidden rounded-[1.6rem] border border-[#334155]/55 bg-[#171f33]/80 shadow-[0_24px_60px_rgba(6,14,32,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8b1a4a]/55 hover:shadow-[0_28px_70px_rgba(139,26,74,0.18)]"
              >
                <div className="relative min-h-[220px]">
                  <div
                    className={cn(
                      'absolute inset-0 bg-[#131b2e]',
                      city.image ? 'bg-cover bg-center opacity-65' : 'bg-[radial-gradient(circle_at_top,rgba(255,177,198,0.22),transparent_25%),linear-gradient(180deg,#171f33_0%,#0f172a_100%)]'
                    )}
                    style={getCityCardStyle(city)}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,38,0.1)_0%,rgba(11,19,38,0.88)_100%)]" />
                  <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:p-7">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-[#e9c349] uppercase backdrop-blur-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      Stadt
                    </div>
                    <div className="space-y-3">
                      <div className="text-2xl font-semibold tracking-[-0.02em] text-white">
                        {city.name}
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm text-[#dcbfc5]">
                        <span>{city.count} Betriebe</span>
                        <ChevronRight className="h-4 w-4 text-[#ffb1c6] transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
