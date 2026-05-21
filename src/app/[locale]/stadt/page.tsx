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
import { getStadtSeoMetadata, getStadtStructuredData, getStadtFAQItems } from '@/lib/structuredData'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

const stadtIntro: Record<string, { heading: string; lead: string; why: string; whyText: string }> = {
  de: {
    heading: 'FKK Clubs & Laufhäuser in deutschen Städten',
    lead: 'DesireMap verzeichnet Deutschlands größte Sammlung geprüfter Bordelle, FKK Clubs und Laufhäuser. Ob FKK Club, Laufhaus, Studio oder Privatadresse – hier findest du verifizierte Adressen sortiert nach Stadt.',
    why: 'Warum DesireMap?',
    whyText: 'Alle Betriebe durchlaufen einen manuellen Prüfprozess. Verifizierte Einträge sind gekennzeichnet. Informationen zu Preisen, Öffnungszeiten und Angeboten werden regelmäßig aktualisiert. Die Plattform ist 24/7 verfügbar und in vier Sprachen nutzbar.',
  },
  en: {
    heading: 'FKK Clubs & Laufhaus Venues by City in Germany',
    lead: 'DesireMap is Germany\'s comprehensive directory for verified adult entertainment venues. From FKK clubs and laufhaus establishments to studios and private addresses – find verified listings sorted by city.',
    why: 'Why DesireMap?',
    whyText: 'All venues go through a manual verification process. Verified listings are clearly marked. Information on prices, opening hours and services is regularly updated. The platform is available 24/7 in four languages.',
  },
  tr: {
    heading: "Almanya'da Şehirlere Göre FKK Club'ları ve Laufhaus Mekanları",
    lead: "DesireMap, doğrulanmış yetişkin eğlence mekanları için Almanya'nın kapsamlı rehberidir. FKK club'larından laufhaus mekanlarına, stüdyolara ve özel adreslere kadar – şehirlere göre sıralanmış doğrulanmış listeler bulun.",
    why: 'Neden DesireMap?',
    whyText: 'Tüm mekanlar manuel bir doğrulama sürecinden geçer. Doğrulanmış listeler açıkça işaretlenir. Fiyatlar, çalışma saatleri ve hizmetler hakkındaki bilgiler düzenli olarak güncellenir.',
  },
  ar: {
    heading: 'نوادي FKK ومنشآت Laufhaus حسب المدينة في ألمانيا',
    lead: 'DesireMap هو الدليل الشامل في ألمانيا للمنشآت الترفيهية للبالغين الموثوقة. من نوادي FKK إلى منشآت laufhaus والاستوديوهات والعناوين الخاصة – اعثر على قوائم موثوقة مرتبة حسب المدينة.',
    why: 'لماذا DesireMap؟',
    whyText: 'تخضع جميع المنشآت لعملية تحقق يدوية. القوائم الموثوقة مميزة بوضوح. يتم تحديث معلومات الأسعار وساعات العمل والخدمات بانتظام.',
  },
}

function StadtSeoSection({ locale }: { locale: string }) {
  const content = (stadtIntro[locale] ?? stadtIntro.de)!
  const faqItems = getStadtFAQItems(locale)
  const faqHeading = locale === 'de' ? 'Häufig gestellte Fragen' : locale === 'tr' ? 'Sıkça Sorulan Sorular' : locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'

  return (
    <section className="border-t border-white/6 bg-[#0b1326] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl space-y-14">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#dae2fd] sm:text-3xl">
            {content.heading}
          </h2>
          <p className="text-base leading-relaxed text-[#a48a90]">{content.lead}</p>
          <h3 className="pt-2 text-lg font-semibold text-[#dae2fd]">{content.why}</h3>
          <p className="text-base leading-relaxed text-[#a48a90]">{content.whyText}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#dae2fd] sm:text-2xl">{faqHeading}</h2>
          <dl className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <dt className="mb-2 font-semibold text-[#dae2fd]">{item.question}</dt>
                <dd className="text-sm leading-relaxed text-[#a48a90]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const metadata = getStadtSeoMetadata(locale)
  const canonical = locale === 'de' ? '/stadt' : `/${locale}/stadt`
  const canonicalUrl = `https://desiremap.de${canonical}`

  return {
    title: metadata.title,
    description: metadata.description,
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
    openGraph: {
      type: 'website',
      siteName: 'DesireMap',
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      images: [{ url: 'https://desiremap.de/hero-bg.jpg', width: 1200, height: 630 }],
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
  const structuredData = getStadtStructuredData(locale, cities, ['de', 'en', 'tr', 'ar'])
  const schemas = structuredData['@graph']

  return (
    <main className="flex min-h-screen flex-col bg-[#0b1326]">
      <JsonLd schemas={schemas} />
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

      <StadtSeoSection locale={locale} />
      <Footer locale={locale} />
    </main>
  )
}
