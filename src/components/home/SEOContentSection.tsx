'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Compass, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react'
import {
  getHomeSeoExperience,
  type HomeSeoCluster,
  type HomeSeoExperience,
} from '@/lib/seo/home'

type SEOContentSectionProps = {
  locale: string
}

const clusterIcons = {
  fkk: Sparkles,
  laufhaus: Compass,
  studio: Star,
  privat: ShieldCheck,
} as const

function SeoIntro({ seo }: { seo: HomeSeoExperience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]"
    >
      <div className="rounded-4xl border border-white/10 bg-white/[0.035] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
        <span className="inline-flex rounded-full border border-[#b76e79]/35 bg-[#b76e79]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#f0bec6]">
          {seo.eyebrow}
        </span>
        <h2 className="mt-6 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
          {seo.title}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
          {seo.lead}
        </p>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
          {seo.supportingCopy}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {seo.clusters.map((cluster) => (
            <Link
              key={cluster.id}
              href={cluster.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-[#b76e79]/40 hover:bg-[#b76e79]/10"
            >
              <span>{cluster.label}</span>
              <ArrowRight className="h-4 w-4 text-[#f0bec6]" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {seo.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6"
          >
            <div className="text-3xl font-semibold text-white">{stat.value}</div>
            <div className="mt-2 text-sm leading-6 text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SeoClusterCard({ cluster }: { cluster: HomeSeoCluster }) {
  const Icon = clusterIcons[cluster.id]

  return (
    <Link
      href={cluster.href}
      className="group rounded-[1.75rem] border border-white/10 bg-white/3 p-6 transition-all hover:-translate-y-1 hover:border-[#b76e79]/40 hover:bg-white/4.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f0bec6]">
            {cluster.label}
          </span>
          <h4 className="mt-4 text-xl font-semibold leading-tight text-white">
            {cluster.title}
          </h4>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[#f0bec6]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-gray-400">
        {cluster.description}
      </p>

      <ul className="mt-5 space-y-2">
        {cluster.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#f0bec6]" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
        <span>Cluster öffnen</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

function SeoClusterAtlas({ seo }: { seo: HomeSeoExperience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f0bec6]">
          Kategorien im Überblick
        </p>
        <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Die wichtigsten Einstiege für die Startseite
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-8 text-gray-400">
          {seo.sectionIntro}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {seo.clusters.map((cluster) => (
          <SeoClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </motion.div>
  )
}

function SeoTrustAndCities({ seo }: { seo: HomeSeoExperience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(183,110,121,0.12),rgba(255,255,255,0.03))] p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f0bec6]">
          Warum DesireMap
        </p>
        <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Vertrauen, Aktualität und klare Orientierung
        </h3>
        <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">
          {seo.trustIntro}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {seo.trustPoints.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <p className="mt-3 text-sm leading-7 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-4xl border border-white/10 bg-white/3 p-8 sm:p-10">
        <div className="flex items-center gap-3 text-[#f0bec6]">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.28em]">Stadtcluster</span>
        </div>
        <h3 className="mt-4 text-3xl font-semibold text-white">
          Deutschlands wichtigste Nachfragezentren
        </h3>
        <p className="mt-5 text-sm leading-7 text-gray-400">
          {seo.cityIntro}
        </p>

        <div className="mt-8 grid gap-3">
          {seo.cityLinks.map((city) => (
            <Link
              key={city.name}
              href={city.href}
              className="rounded-[1.35rem] border border-white/10 bg-black/20 px-5 py-4 transition-all hover:border-[#b76e79]/40 hover:bg-[#b76e79]/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-white">{city.name}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-400">{city.hint}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#f0bec6]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SeoFaqAndCta({ seo }: { seo: HomeSeoExperience }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f0bec6]">
            Häufige Fragen
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Antworten auf die wichtigsten Fragen vor der Suche
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-400">
            {seo.faqIntro}
          </p>
        </div>

        <div className="space-y-4">
          {seo.faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-3xl border border-white/10 bg-white/3 p-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h4 className="text-lg font-semibold text-white">{item.question}</h4>
                <span className="text-[#f0bec6] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-4xl border border-[#b76e79]/20 bg-[linear-gradient(135deg,rgba(183,110,121,0.18),rgba(90,63,126,0.12),rgba(0,0,0,0.4))] p-8 sm:p-10"
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f0bec6]">
              Weiter zur Suche
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {seo.ctaTitle}
            </h3>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">
              {seo.ctaBody}
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              href={seo.ctaHref}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-black/40"
            >
              <span>{seo.ctaLabel}</span>
              <ArrowRight className="h-4 w-4 text-[#f0bec6]" />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function SEOContentSection({ locale }: SEOContentSectionProps) {
  const seo = getHomeSeoExperience(locale)

  return (
    <section className="relative overflow-hidden bg-[#050507] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,110,121,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(102,74,144,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <SeoIntro seo={seo} />
        <SeoClusterAtlas seo={seo} />
        <SeoTrustAndCities seo={seo} />
        <SeoFaqAndCta seo={seo} />
      </div>
    </section>
  )
}
