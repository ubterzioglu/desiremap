'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, Flame, Building2, Crown, Gem, Hand, Shield, Sparkles, Waves } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Translations } from '@/types'
import { getCategoryPath } from '@/lib/navigation'
import { usePublicServiceTypes } from '@/hooks/useQueries'

const CATEGORY_ICONS: Record<string, ReactNode> = {
  fkk: <Flame className="h-5 w-5" />,
  laufhaus: <Building2 className="h-5 w-5" />,
  bordell: <Crown className="h-5 w-5" />,
  massage: <Hand className="h-5 w-5" />,
  sauna: <Flame className="h-5 w-5" />,
  studio: <Gem className="h-5 w-5" />,
  thermal: <Waves className="h-5 w-5" />,
  privat: <Shield className="h-5 w-5" />,
  wellness: <Sparkles className="h-5 w-5" />,
}

type CategoriesProps = { translations: Translations['categories']; locale: string }

export function CategoriesSection({ translations, locale }: CategoriesProps) {
  const { data: serviceTypes = [], isLoading } = usePublicServiceTypes()

  const visibleTypes = serviceTypes.filter(
    (t) => t.venueCount === undefined || t.venueCount > 0,
  )

  if (!isLoading && visibleTypes.length === 0) return null

  return (
    <section className="relative overflow-hidden border-t border-white/6 bg-[#060e20] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0">
        <Image
          src="/categories-bg.jpg"
          alt="Kategorien von Adult-Entertainment-Etablissements: FKK Clubs, Laufhäuser, Studios und Privat-Adressen in Deutschland"
          fill
          sizes="100vw"
          className="object-cover opacity-18"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,177,198,0.16),transparent_26%),linear-gradient(180deg,rgba(6,14,32,0.84)_0%,rgba(6,14,32,0.96)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
        >
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-[#a48a90]/35 bg-[#8b1a4a]/14 px-4 py-1 text-[11px] font-bold tracking-[0.22em] text-[#ffd9e1] uppercase">
              {translations.badge ?? translations.title}
            </span>
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] text-[#dae2fd] sm:text-4xl lg:text-5xl">
              {translations.title}
            </h2>
          </div>
          <div className="rounded-[1.75rem] border border-[#334155]/55 bg-[#131b2e]/74 p-6 shadow-[0_24px_60px_rgba(6,14,32,0.28)] backdrop-blur-xl sm:p-7">
            <p className="max-w-2xl text-base leading-8 text-[#dcbfc5] sm:text-lg">
              {translations.subtitle}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[172px] animate-pulse rounded-[1.6rem] bg-[#171f33]/80"
                />
              ))
            : visibleTypes.map((category, index) => (
                <motion.a
                  key={category.id}
                  href={getCategoryPath(locale, category.slug)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className="group"
                >
                  <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-[#334155]/55 bg-[#171f33]/80 p-6 shadow-[0_24px_60px_rgba(6,14,32,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8b1a4a]/55 hover:bg-[#1b2438] hover:shadow-[0_28px_70px_rgba(139,26,74,0.18)] sm:p-7">
                    <div>
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.1rem] border border-[#564146] bg-[#0f172a] text-[#ffb1c6] transition-colors duration-300 group-hover:border-[#8b1a4a] group-hover:text-white">
                        {CATEGORY_ICONS[category.slug] ?? <Gem className="h-5 w-5" />}
                      </div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#dae2fd] transition-colors duration-300 group-hover:text-white">
                        {category.name}
                      </h3>
                    </div>
                    <div className="mt-8 flex items-center justify-between text-sm text-[#dcbfc5]">
                      <span className="tracking-[0.18em] uppercase">{translations.discover ?? 'Entdecken'}</span>
                      <ChevronRight className="h-4 w-4 text-[#e9c349] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.a>
              ))}
        </div>
      </div>
    </section>
  )
}
