import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import type { PublicCity } from '@/types'
import { backendApi } from '@/lib/backend-client'
import { getCityPath } from '@/lib/navigation'
import {
  getFallbackPublicStadtCities,
  getPublicCityImage,
  getPublicCityVenueCount,
  selectLocalizedCityText,
} from '@/lib/public-cities'
import { getStadtSeoMetadata, getStadtStructuredData, getStadtFAQItems } from '@/lib/structuredData'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

type StadtSeoContent = {
  heading: string
  heroTitle: string
  heroSummary: string
  introParagraphs: string[]
  whyHeading: string
  whyParagraphs: string[]
  citySearchHeading: string
  citySearchParagraphs: string[]
  checklistHeading: string
  checklistItems: string[]
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

const defaultStadtSeoContent: StadtSeoContent = {
  heading: 'FKK Clubs & Laufhäuser in deutschen Städten',
  heroTitle: 'FKK Clubs, Bordelle, Laufhäuser & Studios nach Stadt finden',
  heroSummary: 'Finde FKK Clubs, Laufhäuser und Studios nach Stadt mit weniger Suchaufwand und schnellerem Zugriff auf geprüfte Adressen, aktuelle Infos und passende Ergebnisse.',
  introParagraphs: [
    'Wer in Deutschland nach FKK Clubs, Laufhäusern oder Studios sucht, landet oft zuerst bei verstreuten Einzelquellen, veralteten Branchenbüchern oder Foren ohne klare Struktur. Genau dort entsteht der größte Zeitverlust: Du klickst dich durch viele Tabs, vergleichst unklare Adressen und weißt am Ende trotzdem nicht, ob ein Betrieb noch aktiv ist oder ob die Angaben überhaupt zur gesuchten Stadt passen. Die Städteübersicht auf DesireMap reduziert diesen Aufwand, weil sie das Thema von Anfang an lokal ordnet und dir geprüfte Einträge dort zeigt, wo du tatsächlich suchst.',
    'Statt dieselbe Recherche für Berlin, Hamburg, München oder andere Städte immer wieder neu zu beginnen, nutzt du eine zentrale Einstiegsseite mit klarer Navigationslogik. Du startest bei der Stadt, wechselst anschließend in die Detailseite und bekommst dort schneller einen Überblick über verfügbare Betriebe, Bildmaterial, Standortkontext und weiterführende Informationen. Dadurch entsteht ein Suchprozess, der weniger Reibung erzeugt: weniger Umwege, weniger unbrauchbare Treffer und mehr direkte Wege zu den Adressen, die für deine aktuelle Region oder Reiseplanung relevant sind.',
    'DesireMap ist deshalb nicht einfach nur ein Verzeichnis mit Städtenamen, sondern eine praktische Suchoberfläche für Nutzer, die mit möglichst wenig Klicks zu mehr verwertbaren Ergebnissen kommen möchten. Gerade bei sensiblen oder diskret gesuchten Themen ist das wichtig: Je klarer die Struktur, desto leichter kannst du Angebote nach Ort einordnen, Karten und Slugs wiederfinden und aus einem allgemeinen Interesse schneller zu einer konkreten, passenden Auswahl wechseln. Die Stadtseite funktioniert damit als Orientierungspunkt für den gesamten lokalen Einstieg in die Plattform.',
  ],
  whyHeading: 'Warum die Städteübersicht den Suchaufwand spürbar reduziert',
  whyParagraphs: [
    'Der wichtigste Vorteil liegt in der Sortierung nach tatsächlicher Nutzungsabsicht. Viele Besucher wissen nicht sofort, welcher einzelne Betrieb interessant ist, sie wissen aber sehr genau, in welcher Stadt sie suchen wollen. Wenn diese erste Entscheidung sauber unterstützt wird, spart das Zeit bei jedem weiteren Schritt. DesireMap setzt genau dort an: Die Städteübersicht bündelt die relevanten deutschen Standorte in einem einheitlichen Format und hilft dir, die Suche sofort auf Berlin, Hamburg, München, Köln, Frankfurt oder weitere Städte einzugrenzen, ohne erst über allgemeine Suchbegriffe oder irrelevante Landingpages zu gehen.',
    'Hinzu kommt der Qualitätsaspekt. Adressen, Kategorien und Stadtbezüge sind auf DesireMap nicht bloß zufällig zusammengewürfelt, sondern für die Plattform strukturiert aufbereitet. Das stärkt die Wahrscheinlichkeit, dass du weniger doppelte oder veraltete Treffer siehst und schneller erkennst, welche Ergebnisse zur jeweiligen Stadt gehören. Für Nutzer bedeutet das ganz praktisch: weniger manuelle Vorprüfung im Kopf, weniger Copy-Paste zwischen Karten-Apps und Browserfenstern und mehr Fokus auf die Betriebe, die in der gewählten Stadt tatsächlich in Betracht kommen.',
    'Ein weiterer Vorteil ist die Wiederverwendbarkeit deiner Recherche. Wenn du regelmäßig zwischen mehreren Städten vergleichst, etwa zwischen Berlin, Hamburg und München, brauchst du keinen neuen Suchworkflow zu lernen. Die Stadtseiten folgen demselben Muster, die Links bleiben konsistent und die Navigation zwischen den lokalen Übersichten ist bewusst einfach gehalten. Das führt nicht nur zu mehr Komfort, sondern auch zu besseren Entscheidungen, weil du Angebote, Dichte und Relevanz von Städten deutlich schneller gegeneinander abwägen kannst.',
  ],
  citySearchHeading: 'So kommst du mit weniger Klicks zu mehr passenden Treffern',
  citySearchParagraphs: [
    'Ein effizienter Ablauf beginnt damit, zuerst die Stadt zu wählen und erst danach tiefer in einzelne Betriebe einzusteigen. Genau dafür ist `/stadt` ausgelegt. Du erkennst schon auf der Übersichtsseite, welche Städte aktuell auf DesireMap abgedeckt sind, öffnest gezielt die gewünschte Region und erhältst anschließend einen fokussierten Einstieg in die lokalen Angebote. Das ist vor allem dann wertvoll, wenn du nicht nur allgemein nach FKK Clubs, Laufhäusern oder Studios suchst, sondern einen konkreten Aufenthaltsort im Blick hast und ohne große Umwege zu brauchbaren Ergebnissen gelangen möchtest.',
    'Die stärkere Description und der ausführliche SEO-Text unterstützen dieses Ziel auch inhaltlich: Die Seite erklärt nicht nur, was du finden kannst, sondern auch, warum der Städteinstieg der schnellere Weg zu mehr Ergebnisqualität ist. Nutzer sollen bereits auf der Übersichtsseite verstehen, dass DesireMap ihnen Arbeit abnimmt – durch gebündelte Städteinstiege, klarere Orientierung und eine Suchstruktur, die lokale Relevanz voranstellt. So wird aus einer allgemeinen Suche nach adult directories ein konkreter Stadt-Workflow, der schneller zum passenden Treffer führt.',
  ],
  checklistHeading: 'Was du auf DesireMap nach Stadt konkret schneller erreichst',
  checklistItems: [
    'Du gelangst direkt von der Städteübersicht zu lokalen Ergebnissen, ohne zuerst allgemeine Sammelseiten durchsuchen zu müssen.',
    'Du vergleichst Berlin, Hamburg, München und weitere Städte in derselben Struktur statt auf mehreren unverbundenen Webseiten.',
    'Du arbeitest mit geprüften Adressen und reduzierst damit das Risiko, Zeit in unklare oder veraltete Treffer zu investieren.',
    'Du findest FKK Clubs, Laufhäuser und Studios nach Stadt deutlich zielgerichteter, weil der Ort von Anfang an die Suche steuert.',
    'Du erzielst mit weniger Klicks mehr verwertbare Resultate, weil Navigation, Inhalte und Betriebe lokal zusammengeführt werden.',
  ],
}

const stadtSeoContent: Record<string, StadtSeoContent> = {
  de: defaultStadtSeoContent,
  en: {
    heading: 'FKK Clubs & Laufhaus Venues by City in Germany',
    heroTitle: 'Find FKK Clubs, Bordells, Laufhaus Venues & Studios by City',
    heroSummary: 'Find verified FKK clubs, laufhaus venues and studios by city with less effort and a faster route to relevant local results.',
    introParagraphs: [
      'DesireMap helps visitors start with the city first, then move into the venues that matter locally. That saves time compared with scanning generic result pages or fragmented sources.',
    ],
    whyHeading: 'Why DesireMap?',
    whyParagraphs: [
      'All venues go through a manual verification process. Verified listings are clearly marked, and key venue information is updated regularly.',
    ],
    citySearchHeading: 'Find local results faster',
    citySearchParagraphs: [
      'Use the city overview to move directly into Berlin, Hamburg, Munich and other German city pages, then continue to venue-level details with fewer unnecessary steps.',
    ],
    checklistHeading: 'What the city index improves',
    checklistItems: [
      'Less search friction',
      'More city-specific results',
      'Verified venue discovery',
    ],
  },
  tr: {
    heading: "Almanya'da Şehirlere Göre FKK Club'ları ve Laufhaus Mekanları",
    heroTitle: "Şehre Göre FKK Club, Bordell, Laufhaus ve Stüdyo Bul",
    heroSummary: "Şehre göre doğrulanmış FKK club, laufhaus ve stüdyo sonuçlarına daha az çabayla ve daha hızlı ulaşın.",
    introParagraphs: [
      "DesireMap, genel sonuçlar arasında kaybolmadan önce şehri seçmenizi sağlar; böylece yerel sonuçlara daha hızlı ulaşırsınız.",
    ],
    whyHeading: 'Neden DesireMap?',
    whyParagraphs: [
      'Tüm mekanlar manuel doğrulamadan geçer ve bilgiler düzenli olarak güncellenir.',
    ],
    citySearchHeading: 'Yerel sonuçlara daha hızlı ulaşın',
    citySearchParagraphs: [
      'Berlin, Hamburg, Münih ve diğer şehir sayfalarına doğrudan giderek daha az adımla uygun mekanları görebilirsiniz.',
    ],
    checklistHeading: 'Şehir dizininin avantajı',
    checklistItems: [
      'Daha az arama çabası',
      'Daha yerel sonuçlar',
      'Doğrulanmış adresler',
    ],
  },
  ar: {
    heading: 'نوادي FKK ومنشآت Laufhaus حسب المدينة في ألمانيا',
    heroTitle: 'اعثر على نوادي FKK وBordell وLaufhaus والاستوديوهات حسب المدينة',
    heroSummary: 'اعثر على نوادي FKK والاستوديوهات والمنشآت حسب المدينة بجهد أقل وطريق أسرع إلى النتائج المحلية المناسبة.',
    introParagraphs: [
      'يبدأ DesireMap بالمدينة أولاً حتى تصل إلى النتائج المحلية المناسبة بسرعة أكبر وبدون تشتيت غير ضروري.',
    ],
    whyHeading: 'لماذا DesireMap؟',
    whyParagraphs: [
      'تخضع جميع المنشآت لعملية تحقق يدوية ويتم تحديث المعلومات الأساسية بانتظام.',
    ],
    citySearchHeading: 'نتائج محلية أسرع',
    citySearchParagraphs: [
      'افتح صفحات برلين وهامبورغ وميونخ وغيرها من المدن مباشرة للوصول إلى النتائج المناسبة بخطوات أقل.',
    ],
    checklistHeading: 'ما الذي تحسنه صفحة المدن',
    checklistItems: [
      'جهد أقل في البحث',
      'نتائج محلية أكثر',
      'عناوين موثوقة',
    ],
  },
}

export function getStadtSeoContent(locale: string): StadtSeoContent {
  return stadtSeoContent[locale] ?? defaultStadtSeoContent
}

export function getStadtCardCopy(city: PublicCity, locale: string) {
  return {
    subtitle: selectLocalizedCityText(city.subtitle, locale, ''),
    description: selectLocalizedCityText(city.description, locale, ''),
  }
}

export function getStadtSeoWordCount(locale: string) {
  const content = getStadtSeoContent(locale)
  const faqItems = getStadtFAQItems(locale)
  const textBlocks = [
    content.heading,
    content.heroTitle,
    content.heroSummary,
    ...content.introParagraphs,
    content.whyHeading,
    ...content.whyParagraphs,
    content.citySearchHeading,
    ...content.citySearchParagraphs,
    content.checklistHeading,
    ...content.checklistItems,
    ...faqItems.flatMap((item) => [item.question, item.answer]),
  ]

  return textBlocks.reduce((total, text) => total + countWords(text), 0)
}

function StadtSeoSection({ locale }: { locale: string }) {
  const content = getStadtSeoContent(locale)
  const faqItems = getStadtFAQItems(locale)
  const faqHeading = locale === 'de' ? 'Häufig gestellte Fragen' : locale === 'tr' ? 'Sıkça Sorulan Sorular' : locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'

  return (
    <section className="border-t border-white/6 bg-[#0b1326] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl space-y-14">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#dae2fd] sm:text-3xl">
            {content.heading}
          </h2>
          {content.introParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-[#a48a90]">{paragraph}</p>
          ))}
          <h3 className="pt-2 text-lg font-semibold text-[#dae2fd]">{content.whyHeading}</h3>
          {content.whyParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-[#a48a90]">{paragraph}</p>
          ))}
          <h3 className="pt-2 text-lg font-semibold text-[#dae2fd]">{content.citySearchHeading}</h3>
          {content.citySearchParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-[#a48a90]">{paragraph}</p>
          ))}
          <h3 className="pt-2 text-lg font-semibold text-[#dae2fd]">{content.checklistHeading}</h3>
          <ul className="space-y-3 text-base leading-relaxed text-[#a48a90]">
            {content.checklistItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
    robots: { index: true, follow: true },
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
  const seoContent = getStadtSeoContent(locale)
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
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#0b1326]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-[20px] sm:mb-14 sm:p-10">
            <span className="mb-4 inline-block text-xs font-bold tracking-[0.05em] text-[#D4AF37] uppercase sm:text-sm">
              Deutschland
            </span>
            <h1 className="mb-4 max-w-4xl text-3xl font-bold text-[#dae2fd] sm:text-5xl">{seoContent.heroTitle}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-[#a48a90] sm:text-base">
              {seoContent.heroSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => {
              const image = getPublicCityImage(city)
              const cardCopy = getStadtCardCopy(city, locale)

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
                  <div className="relative z-10 flex min-h-[220px] items-end justify-between p-6">
                    <div className="max-w-[calc(100%-2rem)]">
                      <div className="mb-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span className="text-xs text-[#a48a90]">{getPublicCityVenueCount(city)} Betriebe</span>
                      </div>
                      {cardCopy.subtitle ? (
                        <p className="mb-2 text-xs font-medium tracking-[0.03em] text-[#dcbfc5]">{cardCopy.subtitle}</p>
                      ) : null}
                      <h2 className="text-xl font-bold text-[#dae2fd] transition-colors duration-300 group-hover:text-[#ffb1c6] sm:text-2xl">
                        {city.name}
                      </h2>
                      {cardCopy.description ? (
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#c6b6ba]">{cardCopy.description}</p>
                      ) : null}
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#564146] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#B76E79]" />
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
