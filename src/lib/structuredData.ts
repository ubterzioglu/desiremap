import { getCityPath, getVenuePath } from './navigation'
import { getHomeSeoExperience, getHomeSeoMetadata } from './seo/home'
import type { PublicCity } from '@/types'

const siteUrl = 'https://desiremap.de'
const companyName = 'DesireMap'
const homepagePublishedAt = '2025-01-15T08:00:00+01:00'
const homepageModifiedAt = '2025-01-15T08:00:00+01:00'

type JsonLdGraphData = {
  '@context': 'https://schema.org'
  '@graph': object[]
}

function getVenueRelativePath(locale: string, slug: string) {
  return getVenuePath(locale, slug)
}

function getVenueAbsoluteUrl(locale: string, slug: string) {
  return `${siteUrl}${getVenueRelativePath(locale, slug)}`
}

// Product Listings für Homepage - URLs point to actual product detail pages
const productListings = [
  {
    id: '1',
    name: 'Artemis Berlin',
    slug: 'artemis-berlin',
    description: 'Berlins größtes FKK Club mit exklusivem Wellness-Bereich, mehreren Saunen und einer eleganten Bar. Diskretes Ambiente mit höchsten Standards.',
    image: `${siteUrl}/covers/artemis-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'artemis-berlin'),
    ratingValue: 4.8,
    reviewCount: 1247
  },
  {
    id: '2',
    name: 'Pascha Köln',
    slug: 'pascha-koln',
    description: 'Europas größtes Laufhaus mit 7 Etagen und über 120 Damen. 24 Stunden geöffnet, perfekte Erreichbarkeit im Zentrum von Köln.',
    image: `${siteUrl}/covers/pascha-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'pascha-koln'),
    ratingValue: 4.6,
    reviewCount: 892
  },
  {
    id: '3',
    name: 'Café del Sol Hamburg',
    slug: 'cafe-del-sol-hamburg',
    description: 'Exklusives Bordell in Hamburg mit diskreter Atmosphäre, privaten Zimmern und einer gemütlichen Bar.',
    image: `${siteUrl}/covers/cafe-del-sol-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'cafe-del-sol-hamburg'),
    ratingValue: 4.5,
    reviewCount: 423
  },
  {
    id: '4',
    name: 'Paradise Stuttgart',
    slug: 'paradise-stuttgart',
    description: 'Premium FKK Club in Stuttgart mit großzügigem Außenbereich, Pool und entspannter Gartenlandschaft.',
    image: `${siteUrl}/covers/paradise-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'paradise-stuttgart'),
    ratingValue: 4.7,
    reviewCount: 678
  },
  {
    id: '5',
    name: 'Royal München',
    slug: 'royal-munchen',
    description: 'Zentrales Laufhaus in München mit 3 Etagen und einer einladenden Bar.',
    image: `${siteUrl}/covers/royal-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'royal-munchen'),
    ratingValue: 4.4,
    reviewCount: 312
  },
  {
    id: '6',
    name: 'Diamond Frankfurt',
    slug: 'diamond-frankfurt',
    description: 'Exklusives Ambiente im Herzen von Frankfurt. VIP Suiten mit höchstem Komfort und absoluter Diskretion.',
    image: `${siteUrl}/covers/diamond-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'diamond-frankfurt'),
    ratingValue: 4.6,
    reviewCount: 534
  },
  {
    id: '7',
    name: 'Flamingo FKK Club Karlsruhe',
    slug: 'flamingo-fkk-club-karlsruhe',
    description: 'Premium FKK Saunaclub in Ettlingen bei Karlsruhe mit über 4.000 m², Sauna- und Wellnessbereich, Innen- und Außenpools, Restaurant sowie großer Lounge & Bar.',
    image: `${siteUrl}/listing-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'flamingo-fkk-club-karlsruhe'),
    ratingValue: 4.6,
    reviewCount: 39
  }
]

// 1. Organization Schema
function getOrganizationSchema() {
  return {
    '@type': 'Organization' as const,
    '@id': `${siteUrl}/#organization`,
    name: companyName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject' as const,
      url: `${siteUrl}/logo.svg`,
      width: 200,
      height: 60
    },
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Kurfürstendamm 100',
      addressLocality: 'Berlin',
      postalCode: '10711',
      addressCountry: 'DE'
    },
    sameAs: [
      'https://twitter.com/desiremap',
      'https://www.instagram.com/desiremap'
    ],
    contactPoint: {
      '@type': 'ContactPoint' as const,
      telephone: '+49-30-123456',
      contactType: 'customer service',
      areaServed: {
        '@type': 'Country' as const,
        name: 'DE'
      },
      availableLanguage: ['German', 'English', 'Turkish', 'Arabic']
    }
  }
}

// 4. WebSite Schema
function getWebSiteSchema(locales: string[]) {
  return {
    '@type': 'WebSite' as const,
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: companyName,
    description: 'Verifizierte FKK Clubs, Laufhauser, Studios und Privat-Adressen in Deutschland entdecken.',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: locales,
    potentialAction: {
      '@type': 'SearchAction' as const,
      target: {
        '@type': 'EntryPoint' as const,
        urlTemplate: `${siteUrl}/de/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// 7. WebPage Schema
function getWebPageSchema(locale: string, title: string, description: string) {
  const pageUrl = `${siteUrl}/${locale}`
  return {
    '@type': 'WebPage' as const,
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: title,
    description,
    datePublished: homepagePublishedAt,
    dateModified: homepageModifiedAt,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
    inLanguage: locale,
    primaryImageOfPage: {
      '@type': 'ImageObject' as const,
      url: `${siteUrl}/hero-bg.jpg`,
      width: 1200,
      height: 630
    }
  }
}

// 8. BreadcrumbList Schema
function getBreadcrumbSchema(locale: string) {
  const pageUrl = `${siteUrl}/${locale}`
  return {
    '@type': 'BreadcrumbList' as const,
    '@id': `${pageUrl}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem' as const,
        position: 1,
        name: 'Home',
        item: pageUrl
      }
    ]
  }
}

// 10. ItemList Schema mit venue/business Schemas
function getItemListSchema() {
  return {
    '@type': 'ItemList' as const,
    '@id': `${siteUrl}/#featured-listings`,
    name: 'Featured Listings auf DesireMap',
    description: 'Verifizierte und stark nachgefragte Adressen in Deutschland',
    numberOfItems: productListings.length,
    itemListElement: productListings.map((product, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'EntertainmentBusiness' as const,
        '@id': `${siteUrl}/#venue-${product.id}`,
        name: product.name,
        image: product.image,
        description: product.description,
        url: product.url,
        aggregateRating: {
          '@type': 'AggregateRating' as const,
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1
        }
      }
    }))
  }
}

// 24. FAQPage Schema
function getFAQPageSchema(locale: string) {
  const faq = getHomeSeoExperience(locale).faq

  return {
    '@type': 'FAQPage' as const,
    mainEntity: faq.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer
      }
    }))
  }
}

function getHomepageSpeakableSchema() {
  return {
    '@type': 'SpeakableSpecification' as const,
    '@id': `${siteUrl}/#speakable`,
    cssSelector: ['h1', '.hero-description', '.faq-section', '.how-it-works'],
    xpath: [
      '/html/head/title',
      '/html/head/meta[@name="description"]/@content'
    ]
  }
}

function getHomepageVideoSchema() {
  return {
    '@type': 'VideoObject' as const,
    '@id': `${siteUrl}/#homepage-video`,
    name: 'DesireMap - Entdecken Sie das beste Adult Entertainment in Deutschland',
    description: 'Erfahren Sie, wie DesireMap Ihnen hilft, die besten Saunaclubs, FKK-Clubs und Entertainment-Etablissements in Deutschland zu finden.',
    thumbnailUrl: `${siteUrl}/video-thumbnail.jpg`,
    uploadDate: '2025-01-15T08:00:00+01:00',
    contentUrl: `${siteUrl}/promo-video.mp4`,
    embedUrl: 'https://www.youtube.com/embed/desiremap-promo',
    duration: 'PT2M30S'
  }
}

function getHomepageHowToSchema(locale: string) {
  const steps = locale === 'de' ? [
    { name: 'Suchen', text: 'Geben Sie Ihre Stadt oder Postleitzahl ein, um Etablissements in Ihrer Nähe zu finden.' },
    { name: 'Vergleichen', text: 'Vergleichen Sie Bewertungen, Preise und Ausstattungsmerkmale verschiedener Etablissements.' },
    { name: 'Reservieren', text: 'Buchen Sie Ihren Besuch direkt online mit wenigen Klicks.' },
    { name: 'Genießen', text: 'Besuchen Sie das Etablissement und genießen Sie Ihr Erlebnis.' }
  ] : locale === 'en' ? [
    { name: 'Search', text: 'Enter your city or postal code to find establishments near you.' },
    { name: 'Compare', text: 'Compare reviews, prices, and amenities of different establishments.' },
    { name: 'Reserve', text: 'Book your visit directly online with just a few clicks.' },
    { name: 'Enjoy', text: 'Visit the establishment and enjoy your experience.' }
  ] : locale === 'tr' ? [
    { name: 'Ara', text: 'Yakınınızdaki mekânları bulmak için şehrinizi veya posta kodunuzu girin.' },
    { name: 'Karşılaştır', text: 'Farklı mekânların yorumlarını, fiyatlarını ve olanaklarını karşılaştırın.' },
    { name: 'Rezerve Et', text: 'Birkaç tıklamayla çevrimiçi ziyaretinizi ayarlayın.' },
    { name: 'Keyfini Çıkar', text: 'Mekânı ziyaret edin ve deneyiminizin tadını çıkarın.' }
  ] : [
    { name: 'بحث', text: 'أدخل مدينتك أو رمزك البريدي للعثور على المؤسسات القريبة منك.' },
    { name: 'مقارنة', text: 'قارن المراجعات والأسعار والمرافق للمؤسسات المختلفة.' },
    { name: 'حجز', text: 'احجز زيارتك مباشرة عبر الإنترنت ببضع نقرات.' },
    { name: 'استمتع', text: 'قم بزيارة المؤسسة واستمتع بتجربتك.' }
  ]

  return {
    '@type': 'HowTo' as const,
    '@id': `${siteUrl}/#howto-use-platform`,
    name: locale === 'de' ? 'So nutzen Sie DesireMap'
      : locale === 'en' ? 'How to Use DesireMap'
      : locale === 'tr' ? 'DesireMap Nasıl Kullanılır'
      : 'كيفية استخدام DesireMap',
    description: locale === 'de'
      ? 'Eine Schritt-für-Schritt-Anleitung zur Nutzung der DesireMap-Plattform'
      : 'Step-by-step guide to using the DesireMap platform',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep' as const,
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  }
}

function getHomepagePersonSchema() {
  return {
    '@type': 'Person' as const,
    '@id': `${siteUrl}/#person-desiremap`,
    name: 'DesireMap',
    url: siteUrl,
    image: {
      '@type': 'ImageObject' as const,
      url: `${siteUrl}/og-image.png`
    },
    jobTitle: 'Adult Entertainment Platform',
    description: 'Deutschlands führende Plattform für Adult-Entertainment-Etablissements. Bewertungen, Reservierungen und Empfehlungen.',
    sameAs: [
      'https://twitter.com/desiremap',
      'https://instagram.com/desiremap'
    ],
    worksFor: {
      '@type': 'Organization' as const,
      '@id': `${siteUrl}/#organization`
    }
  }
}

export function getStructuredData(locale: string, title: string, description: string, locales: string[]) {
  const homeMetadata = getHomeSeoMetadata(locale)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(locales),
      getWebPageSchema(locale, title || homeMetadata.title, description || homeMetadata.description),
      getBreadcrumbSchema(locale),
      getItemListSchema(),
      getFAQPageSchema(locale),
      getHomepageSpeakableSchema(),
      getHomepageVideoSchema(),
      getHomepageHowToSchema(locale),
      getHomepagePersonSchema()
    ]
  }
}

// ============================================
// STADT INDEX PAGE SCHEMAS (stadt-seo.md)
// ============================================

const defaultStadtSeoMetadata = {
  title: 'FKK Clubs & Studios nach Stadt finden in DE | DesireMap',
  description: 'FKK Clubs, Laufhäuser und Studios nach Stadt finden: geprüfte Adressen in Berlin, Hamburg, München und weiteren deutschen Städten auf DesireMap entdecken.',
}

const stadtSeoMetadata: Record<string, { title: string; description: string }> = {
  de: defaultStadtSeoMetadata,
  en: {
    title: 'Find FKK Clubs & Studios by City in DE | DesireMap',
    description: 'Find FKK clubs, laufhaus venues and studios by city: explore verified addresses in Berlin, Hamburg, Munich and more German cities on DesireMap.',
  },
  tr: {
    title: 'Şehre Göre FKK Club ve Stüdyo Bul | DesireMap',
    description: 'Şehre göre FKK club, laufhaus ve stüdyo bul: Berlin, Hamburg, Münih ve diğer Alman şehirlerindeki doğrulanmış adresleri keşfet.',
  },
  ar: {
    title: 'ابحث عن نوادي FKK والاستوديوهات حسب المدينة | DesireMap',
    description: 'ابحث عن نوادي FKK وlaufhaus والاستوديوهات حسب المدينة، واكتشف عناوين موثوقة في برلين وهامبورغ وميونخ ومدن ألمانية أخرى.',
  },
}

export function getStadtSeoMetadata(locale: string) {
  return stadtSeoMetadata[locale] ?? defaultStadtSeoMetadata
}

function getStadtRelativePath(locale: string) {
  return locale === 'de' ? '/stadt' : `/${locale}/stadt`
}

function getStadtAbsoluteUrl(locale: string) {
  return `${siteUrl}${getStadtRelativePath(locale)}`
}

function getLocalizedCityText(
  content: Record<string, string | null> | undefined,
  locale: string,
  fallback: string
) {
  return content?.[locale] || content?.de || fallback
}

function getStadtImageSchemas(locale: string, cities: PublicCity[]) {
  const pageUrl = getStadtAbsoluteUrl(locale)
  const primaryImageUrl = cities.find((city) => city.image)?.image ?? `${siteUrl}/og-image.png`
  const seenImageUrls = new Set<string>()
  const cityImages = cities.flatMap((city) => {
    if (!city.image || seenImageUrls.has(city.image)) {
      return []
    }

    seenImageUrls.add(city.image)

    return [{
      '@type': 'ImageObject' as const,
      '@id': `${pageUrl}/#city-image-${city.slug}`,
      url: city.image,
      width: 1920,
      height: 1080,
      caption: `${city.name} auf DesireMap`,
    }]
  })

  return [
    {
      '@type': 'ImageObject' as const,
      '@id': `${pageUrl}/#primary-image`,
      url: primaryImageUrl,
      width: 1200,
      height: 630,
      caption: getStadtSeoMetadata(locale).title,
    },
    ...cityImages,
  ]
}

function getStadtWebPageSchema(locale: string, cities: PublicCity[]) {
  const metadata = getStadtSeoMetadata(locale)
  const pageUrl = getStadtAbsoluteUrl(locale)

  return {
    '@type': 'WebPage' as const,
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: metadata.title,
    description: metadata.description,
    datePublished: homepagePublishedAt,
    dateModified: homepageModifiedAt,
    isPartOf: { '@id': `${siteUrl}/#website` },
    breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
    inLanguage: locale,
    primaryImageOfPage: { '@id': `${pageUrl}/#primary-image` },
    speakable: { '@id': `${pageUrl}/#speakable` },
    mainEntity: { '@id': `${pageUrl}/#city-list` },
    about: [
      { '@id': `${siteUrl}/#organization` },
      { '@id': `${pageUrl}/#service` },
    ],
    significantLink: cities.map((city) => `${siteUrl}${getCityPath(locale, city.slug)}`),
  }
}

function getStadtSpeakableSchema(locale: string) {
  const pageUrl = getStadtAbsoluteUrl(locale)

  return {
    '@type': 'SpeakableSpecification' as const,
    '@id': `${pageUrl}/#speakable`,
    cssSelector: ['h1', 'section p', 'a h2'],
  }
}

function getStadtBreadcrumbSchema(locale: string) {
  const pageUrl = getStadtAbsoluteUrl(locale)
  const homeUrl = locale === 'de' ? siteUrl : `${siteUrl}/${locale}`
  const labels = locale === 'de'
    ? { home: 'Startseite', cities: 'Städte' }
    : locale === 'tr'
      ? { home: 'Ana sayfa', cities: 'Şehirler' }
      : locale === 'ar'
        ? { home: 'الرئيسية', cities: 'المدن' }
        : { home: 'Home', cities: 'Cities' }

  return {
    '@type': 'BreadcrumbList' as const,
    '@id': `${pageUrl}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem' as const,
        position: 1,
        name: labels.home,
        item: homeUrl,
      },
      {
        '@type': 'ListItem' as const,
        position: 2,
        name: labels.cities,
        item: pageUrl,
      },
    ],
  }
}

function getStadtItemListSchema(locale: string, cities: PublicCity[]) {
  const pageUrl = getStadtAbsoluteUrl(locale)

  return {
    '@type': 'ItemList' as const,
    '@id': `${pageUrl}/#city-list`,
    name: 'DesireMap Städteverzeichnis',
    numberOfItems: cities.length,
    itemListElement: cities.map((city, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: city.name,
      item: `${siteUrl}${getCityPath(locale, city.slug)}`,
      description: getLocalizedCityText(
        city.description,
        locale,
        `${city.name} FKK Clubs, Laufhäuser und Studios auf DesireMap entdecken.`
      ),
    })),
  }
}

export function getStadtFAQItems(locale: string): Array<{ question: string; answer: string }> {
  if (locale === 'de') {
    return [
      {
        question: 'Welche Städte finde ich auf DesireMap?',
        answer: 'DesireMap listet wichtige deutsche Städte wie Berlin, Hamburg, München, Köln, Frankfurt und weitere Standorte mit passenden FKK Clubs, Laufhäusern und Studios.',
      },
      {
        question: 'Wie wähle ich eine Stadt aus?',
        answer: 'Wähle auf der Städteübersicht eine Stadtkarte aus, um die jeweilige Stadtseite mit verfügbaren Betrieben und lokalen Informationen zu öffnen.',
      },
      {
        question: 'Sind alle Betriebe auf DesireMap verifiziert?',
        answer: 'Ja – alle auf DesireMap gelisteten Betriebe durchlaufen einen Prüfprozess. Verifizierte Adressen sind entsprechend gekennzeichnet, sodass du dir sicher sein kannst.',
      },
      {
        question: 'Wie oft werden die Stadtseiten aktualisiert?',
        answer: 'Die Stadtseiten und Betriebsprofile werden regelmäßig aktualisiert, um korrekte Öffnungszeiten, Preise und Verfügbarkeiten zu gewährleisten.',
      },
    ]
  }
  if (locale === 'tr') {
    return [
      {
        question: "DesireMap'de hangi şehirleri bulabilirim?",
        answer: "DesireMap, Berlin, Hamburg, Münih, Köln, Frankfurt ve daha fazlası gibi önemli Alman şehirlerini FKK club'ları, laufhaus mekanları ve stüdyolarla listeler.",
      },
      {
        question: 'Bir şehri nasıl seçerim?',
        answer: 'Şehir dizininde bir şehir kartı seçerek mevcut mekanlar ve yerel bilgilerle ilgili şehir sayfasını açın.',
      },
      {
        question: "DesireMap'deki tüm mekanlar doğrulanmış mı?",
        answer: "Evet – DesireMap'de listelenen tüm mekanlar bir doğrulama sürecinden geçer. Doğrulanmış adresler işaretlenerek güvenle ziyaret edebilirsiniz.",
      },
      {
        question: 'Şehir sayfaları ne sıklıkla güncellenir?',
        answer: 'Şehir sayfaları ve mekan profilleri, doğru çalışma saatleri, fiyatlar ve müsaitliği sağlamak için düzenli olarak güncellenir.',
      },
    ]
  }
  if (locale === 'ar') {
    return [
      {
        question: 'ما المدن المتاحة على DesireMap؟',
        answer: 'يضم DesireMap مدنًا ألمانية رئيسية مثل برلين وهامبورغ وميونخ وكولونيا وفرانكفورت وغيرها مع نوادي FKK ومنشآت laufhaus والاستوديوهات.',
      },
      {
        question: 'كيف أختار مدينة؟',
        answer: 'حدد بطاقة مدينة في فهرس المدن لفتح صفحة المدينة المقابلة مع المنشآت المتاحة والمعلومات المحلية.',
      },
      {
        question: 'هل جميع المنشآت موثوقة على DesireMap؟',
        answer: 'نعم – تخضع جميع المنشآت المدرجة في DesireMap لعملية تحقق. العناوين الموثوقة مميزة حتى تتمكن من الزيارة بثقة.',
      },
      {
        question: 'كم مرة يتم تحديث صفحات المدن؟',
        answer: 'يتم تحديث صفحات المدن وملفات المنشآت بانتظام لضمان دقة ساعات العمل والأسعار والتوافر.',
      },
    ]
  }
  return [
    {
      question: 'Which cities are available on DesireMap?',
      answer: 'DesireMap lists major German cities such as Berlin, Hamburg, Munich, Cologne, Frankfurt and more locations with relevant FKK clubs, laufhaus venues and studios.',
    },
    {
      question: 'How do I choose a city?',
      answer: 'Select a city card on the city index to open the matching city page with available venues and local information.',
    },
    {
      question: 'Are all venues on DesireMap verified?',
      answer: 'Yes – all venues listed on DesireMap go through a verification process. Verified addresses are marked so you can visit with confidence.',
    },
    {
      question: 'How often are city pages updated?',
      answer: 'City pages and venue profiles are regularly updated to keep opening hours, price notes, and listing information current.',
    },
  ]
}

function getStadtFAQPageSchema(locale: string) {
  const pageUrl = getStadtAbsoluteUrl(locale)

  return {
    '@type': 'FAQPage' as const,
    '@id': `${pageUrl}/#faq`,
    mainEntity: getStadtFAQItems(locale).map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  }
}

function getStadtServiceSchema(locale: string, cities: PublicCity[]) {
  const pageUrl = getStadtAbsoluteUrl(locale)
  const metadata = getStadtSeoMetadata(locale)

  return {
    '@type': 'Service' as const,
    '@id': `${pageUrl}/#service`,
    name: locale === 'de'
      ? 'Städtebasierte FKK Club- und Studio-Suche'
      : 'City-based FKK club and studio discovery',
    serviceType: 'Adult entertainment directory city search',
    description: metadata.description,
    url: pageUrl,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: {
      '@type': 'Country' as const,
      name: 'DE',
    },
    availableChannel: {
      '@type': 'ServiceChannel' as const,
      serviceUrl: pageUrl,
    },
    serviceOutput: `${cities.length} city landing pages for venue discovery`,
  }
}

function getStadtHowToSchema(locale: string) {
  const pageUrl = getStadtAbsoluteUrl(locale)
  const steps = locale === 'de' ? [
    { name: 'Stadt auswählen', text: 'Wähle eine Stadtkarte in der DesireMap Städteübersicht aus.' },
    { name: 'Lokale Auswahl prüfen', text: 'Öffne die Stadtseite und prüfe verfügbare FKK Clubs, Laufhäuser und Studios.' },
    { name: 'Betrieb vergleichen', text: 'Vergleiche Detailseiten, Beschreibungen, Bilder und verfügbare Informationen.' },
  ] : [
    { name: 'Choose a city', text: 'Select a city card in the DesireMap city index.' },
    { name: 'Review local options', text: 'Open the city page and review available FKK clubs, laufhaus venues and studios.' },
    { name: 'Compare venues', text: 'Compare detail pages, descriptions, images and available information.' },
  ]

  return {
    '@type': 'HowTo' as const,
    '@id': `${pageUrl}/#how-to-use-city-index`,
    name: locale === 'de'
      ? 'So findest du Betriebe nach Stadt auf DesireMap'
      : 'How to find venues by city on DesireMap',
    description: locale === 'de'
      ? 'Kurze Anleitung zur Nutzung der DesireMap Städteübersicht.'
      : 'Short guide for using the DesireMap city index.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep' as const,
      position: index + 1,
      name: step.name,
      text: step.text,
      url: pageUrl,
    })),
  }
}

export function getStadtStructuredData(
  locale: string,
  cities: PublicCity[],
  locales: string[]
): JsonLdGraphData {
  const activeCities = cities.filter((city) => city.slug && city.isActive !== false)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(locales),
      ...getStadtImageSchemas(locale, activeCities),
      getStadtWebPageSchema(locale, activeCities),
      getStadtSpeakableSchema(locale),
      getStadtBreadcrumbSchema(locale),
      getStadtItemListSchema(locale, activeCities),
      getStadtFAQPageSchema(locale),
      getStadtServiceSchema(locale, activeCities),
      getStadtHowToSchema(locale),
    ],
  }
}

// ============================================
// PRODUCT DETAIL PAGE SCHEMAS (urun-seo.md)
// ============================================

export interface ProductDetailData {
  id: string
  name: string
  slug: string
  description: string
  image: string
  images?: string[]
  type: string // FKK, Laufhaus, Bordell, Studio, Privat
  detailContent?: {
    aboutText: string | null
    servicesText: string | null
    ladiesAtmosphereText: string | null
    faq: Array<{
      question: string
      answer: string
    }>
  } | null
  city: string
  address: string
  phone?: string
  email?: string
  website?: string
  price: number
  ratingValue: number
  reviewCount: number
  reviews: Array<{
    id: string
    authorName: string
    rating: number
    date: string
    content: string
  }>
  openingHours: {
    days: string[]
    opens: string
    closes: string
  }
  services: string[]
  ladiesCount: number
  verified: boolean
  premium: boolean
  relatedProducts: Array<{
    id: string
    name: string
    slug: string
    type: string
    city: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
  datePublished: string
  dateModified: string
}

// Review Schema (19-21)
function getReviewSchemas(reviews: ProductDetailData['reviews'], productUrl: string) {
  return reviews.map((review) => ({
    '@type': 'Review' as const,
    '@id': `${productUrl}/#review-${review.id}`,
    author: {
      '@type': 'Person' as const,
      name: review.authorName
    },
    datePublished: review.date,
    reviewBody: review.content,
    reviewRating: {
      '@type': 'Rating' as const,
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    }
  }))
}

// Venue business Schema for Detail Page (7)
function getProductDetailSchema(product: ProductDetailData) {
  const productUrl = getVenueAbsoluteUrl('de', product.slug)
  const openingHours = getProductOpeningHoursSchema(product)
  return {
    '@type': 'EntertainmentBusiness' as const,
    '@id': `${productUrl}/#venue`,
    name: product.name,
    image: product.images ? [product.image, ...product.images] : product.image,
    description: product.description,
    url: productUrl,
    telephone: product.phone,
    email: product.email,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: product.address,
      addressLocality: product.city,
      addressCountry: 'DE'
    },
    ...(openingHours ? { openingHoursSpecification: openingHours } : {}),
    ...(product.ratingValue > 0 ? { aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    } } : {}),
    sameAs: product.website ? [product.website] : [],
    review: getReviewSchemas(product.reviews, productUrl)
  }
}

// WebPage Schema for Detail Page (22)
function getProductWebPageSchema(product: ProductDetailData, locale: string) {
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
  return {
    '@type': 'WebPage' as const,
    '@id': `${productUrl}/#webpage`,
    url: productUrl,
    name: `${product.name} | ${venueTypeLabel(product.type)} in ${product.city} | DesireMap`,
    description: product.description,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    breadcrumb: { '@id': `${productUrl}/#breadcrumb` },
    inLanguage: locale,
    datePublished: product.datePublished,
    dateModified: product.dateModified,
    primaryImageOfPage: {
      '@type': 'ImageObject' as const,
      url: product.image,
      width: 1200,
      height: 630
    },
    speakable: {
      '@type': 'SpeakableSpecification' as const,
      cssSelector: ['.speakable-description', '.speakable-services', '.speakable-faq']
    },
    mainEntity: { '@id': `${productUrl}/#venue` }
  }
}

// BreadcrumbList Schema for Detail Page (24-25)
function getProductBreadcrumbSchema(product: ProductDetailData, locale: string) {
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
  return {
    '@type': 'BreadcrumbList' as const,
    '@id': `${productUrl}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem' as const,
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${locale}`
      },
      {
        '@type': 'ListItem' as const,
        position: 2,
        name: product.city,
        item: `${siteUrl}/${locale}/search?city=${encodeURIComponent(product.city)}`
      },
      {
        '@type': 'ListItem' as const,
        position: 3,
        name: product.type.charAt(0).toUpperCase() + product.type.slice(1),
        item: `${siteUrl}/${locale}/search?category=${product.type}`
      },
      {
        '@type': 'ListItem' as const,
        position: 4,
        name: product.name
      }
    ]
  }
}

// FAQPage Schema for Detail Page (26-28)
function getProductFAQSchema(product: ProductDetailData) {
  if (product.faq.length === 0) {
    return null
  }

  const productUrl = getVenueAbsoluteUrl('de', product.slug)
  return {
    '@type': 'FAQPage' as const,
    '@id': `${productUrl}/#faq`,
    mainEntity: product.faq.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer
      }
    }))
  }
}

// OpeningHours Schema for Detail Page (17)
function getProductOpeningHoursSchema(product: ProductDetailData) {
  if (
    product.openingHours.days.length === 0 ||
    !product.openingHours.opens ||
    !product.openingHours.closes
  ) {
    return null
  }

  return {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: product.openingHours.days,
    opens: product.openingHours.opens,
    closes: product.openingHours.closes
  }
}

// Related Products ItemList Schema
function getRelatedProductsSchema(product: ProductDetailData, locale: string) {
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
  return {
    '@type': 'ItemList' as const,
    '@id': `${productUrl}/#related-products`,
    name: `Ähnliche ${product.type} in ${product.city}`,
    numberOfItems: product.relatedProducts.length,
    itemListElement: product.relatedProducts.map((related, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: related.name,
      url: getVenueAbsoluteUrl(locale, related.slug)
    }))
  }
}

function getProductServiceSchema(product: ProductDetailData) {
  const productUrl = getVenueAbsoluteUrl('de', product.slug)
  const typeLabel = venueTypeLabel(product.type)
  return {
    '@type': 'Service' as const,
    '@id': `${productUrl}/#service`,
    name: `${product.name} – ${typeLabel} in ${product.city}`,
    serviceType: typeLabel,
    description: product.description || `${typeLabel} in ${product.city} auf DesireMap`,
    url: productUrl,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: {
      '@type': 'City' as const,
      name: product.city,
      containedInPlace: { '@type': 'Country' as const, name: 'DE' },
    },
    availableChannel: {
      '@type': 'ServiceChannel' as const,
      serviceUrl: productUrl,
    },
    ...(product.ratingValue > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating' as const,
        ratingValue: product.ratingValue,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  }
}

function getProductHowToSchema(product: ProductDetailData) {
  const productUrl = getVenueAbsoluteUrl('de', product.slug)
  const typeLabel = venueTypeLabel(product.type)
  return {
    '@type': 'HowTo' as const,
    '@id': `${productUrl}/#howto`,
    name: `So besuchst du ${product.name}`,
    description: `Schritt-für-Schritt Anleitung zum Besuch von ${product.name}, ${typeLabel} in ${product.city}.`,
    step: [
      {
        '@type': 'HowToStep' as const,
        position: 1,
        name: 'Profil prüfen',
        text: `Alle Informationen zu ${product.name} auf DesireMap prüfen: Öffnungszeiten, Preise, Leistungen und Bewertungen.`,
        url: productUrl,
      },
      {
        '@type': 'HowToStep' as const,
        position: 2,
        name: 'Kontakt aufnehmen',
        text: product.phone
          ? `${product.name} direkt anrufen unter ${product.phone} oder online reservieren.`
          : 'Online reservieren oder den Betrieb über die angegebenen Kontaktdaten erreichen.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 3,
        name: 'Besuch genießen',
        text: `${product.name} in ${product.city} besuchen und das Angebot vor Ort erleben.`,
      },
    ],
  }
}

// Main export function for Product Detail Page
export function getProductDetailStructuredData(
  product: ProductDetailData,
  locale: string,
  locales: string[]
) {
  const graph = [
    getOrganizationSchema(),
    getWebSiteSchema(locales),
    getProductDetailSchema(product),
    getProductWebPageSchema(product, locale),
    getProductBreadcrumbSchema(product, locale),
    getProductServiceSchema(product),
    getProductHowToSchema(product),
    getProductFAQSchema(product),
    getProductOpeningHoursSchema(product),
    getRelatedProductsSchema(product, locale),
  ].filter((node): node is NonNullable<typeof node> => node !== null)

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
}

// ============================================
// BLOG PAGE SCHEMAS (blog-seo.md)
// ============================================

export interface BlogPostData {
  id: string
  slug: string
  title: string
  headline: string
  description: string
  content?: string
  image: string
  images?: string[]
  datePublished: string
  dateModified: string
  author: {
    name: string
    url?: string
    image?: string
    sameAs?: string[]
    jobTitle?: string
    description?: string
  }
  wordCount: number
  keywords: string[]
  inLanguage: string
  category: string
  tags: string[]
  faq?: Array<{
    question: string
    answer: string
  }>
  mentions?: Array<{
    name: string
    url: string
    type: 'Product' | 'Service' | 'Thing'
  }>
  commentCount?: number
  video?: {
    name: string
    description: string
    thumbnailUrl: string
    uploadDate: string
    contentUrl?: string
    embedUrl?: string
  }
}

// 1. Article Schema
function getArticleSchema(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'Article' as const,
    '@id': `${postUrl}/#article`,
    headline: post.headline,
    image: post.images ? [post.image, ...post.images] : post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person' as const,
      '@id': `${siteUrl}/#author-${post.author.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: post.author.name,
      url: post.author.url,
      image: post.author.image ? {
        '@type': 'ImageObject' as const,
        url: post.author.image
      } : undefined,
      sameAs: post.author.sameAs,
      jobTitle: post.author.jobTitle,
      description: post.author.description
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': postUrl
    },
    description: post.description,
    articleBody: post.content,
    keywords: post.keywords.join(', '),
    wordCount: post.wordCount,
    inLanguage: post.inLanguage,
    about: post.mentions?.map((mention) => ({
      '@type': mention.type,
      name: mention.name,
      url: mention.url
    })),
    mentions: post.mentions?.map((mention) => ({
      '@type': mention.type,
      name: mention.name,
      url: mention.url
    }))
  }
}

// 2. BlogPosting Schema (Article'ın blog versiyonu)
function getBlogPostingSchema(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'BlogPosting' as const,
    '@id': `${postUrl}/#blogposting`,
    headline: post.headline,
    image: post.images ? [post.image, ...post.images] : post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@id': `${siteUrl}/#author-${post.author.name.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': postUrl
    },
    description: post.description,
    articleBody: post.content,
    wordCount: post.wordCount,
    inLanguage: post.inLanguage,
    commentCount: post.commentCount || 0,
    interactionStatistic: post.commentCount ? {
      '@type': 'InteractionCounter' as const,
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: post.commentCount
    } : undefined
  }
}

// 3. Author Schema (Person)
function getAuthorSchema(post: BlogPostData) {
  return {
    '@type': 'Person' as const,
    '@id': `${siteUrl}/#author-${post.author.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: post.author.name,
    url: post.author.url,
    image: post.author.image ? {
      '@type': 'ImageObject' as const,
      url: post.author.image
    } : undefined,
    sameAs: post.author.sameAs,
    jobTitle: post.author.jobTitle,
    description: post.author.description
  }
}

// 4. Organization Schema (Publisher) - reuse from getOrganizationSchema

// 5. BreadcrumbList Schema for Blog
function getBlogBreadcrumbSchema(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'BreadcrumbList' as const,
    '@id': `${postUrl}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem' as const,
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${locale}`
      },
      {
        '@type': 'ListItem' as const,
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/${locale}/blog`
      },
      {
        '@type': 'ListItem' as const,
        position: 3,
        name: post.category,
        item: `${siteUrl}/${locale}/blog?category=${encodeURIComponent(post.category)}`
      },
      {
        '@type': 'ListItem' as const,
        position: 4,
        name: post.headline
      }
    ]
  }
}

// 6. FAQPage Schema for Blog
function getBlogFAQSchema(post: BlogPostData, locale: string) {
  if (!post.faq || post.faq.length === 0) return null
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'FAQPage' as const,
    '@id': `${postUrl}/#faq`,
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer
      }
    }))
  }
}

// 7. ImageObject Schema
function getBlogImageSchema(post: BlogPostData) {
  return {
    '@type': 'ImageObject' as const,
    '@id': `${siteUrl}/#blog-image-${post.slug}`,
    url: post.image,
    width: 1200,
    height: 630,
    caption: post.headline
  }
}

// 8. SpeakableSpecification Schema
function getBlogSpeakableSchema(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'SpeakableSpecification' as const,
    '@id': `${postUrl}/#speakable`,
    cssSelector: ['.blog-intro', '.blog-content h2', '.blog-faq']
  }
}

// 9. WebPage Schema for Blog
function getBlogWebPageSchema(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  return {
    '@type': 'WebPage' as const,
    '@id': `${postUrl}/#webpage`,
    url: postUrl,
    name: post.title,
    description: post.description,
    isPartOf: {
      '@id': `${siteUrl}/${locale}/blog/#blog-section`
    },
    breadcrumb: {
      '@id': `${postUrl}/#breadcrumb`
    },
    inLanguage: post.inLanguage,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    primaryImageOfPage: {
      '@id': `${siteUrl}/#blog-image-${post.slug}`
    },
    speakable: {
      '@id': `${postUrl}/#speakable`
    },
    mainEntity: {
      '@id': `${postUrl}/#article`
    }
  }
}

// 10. WebSite Schema - reuse from getWebSiteSchema

// 11. Blog Section Schema (isPartOf)
function getBlogSectionSchema(locale: string) {
  return {
    '@type': 'Blog' as const,
    '@id': `${siteUrl}/${locale}/blog/#blog-section`,
    name: 'DesireMap Blog',
    description: 'Premium Erotik Hizmetler Pazar Yeri - DesireMap Blog',
    url: `${siteUrl}/${locale}/blog`,
    inLanguage: locale,
    publisher: {
      '@id': `${siteUrl}/#organization`
    }
  }
}

// 15. VideoObject Schema (optional)
function getBlogVideoSchema(post: BlogPostData) {
  if (!post.video) return null
  return {
    '@type': 'VideoObject' as const,
    '@id': `${siteUrl}/#blog-video-${post.slug}`,
    name: post.video.name,
    description: post.video.description,
    thumbnailUrl: post.video.thumbnailUrl,
    uploadDate: post.video.uploadDate,
    contentUrl: post.video.contentUrl,
    embedUrl: post.video.embedUrl
  }
}

// Main export function for Blog Post
export function getBlogPostStructuredData(
  post: BlogPostData,
  locale: string,
  locales: string[]
) {
  const schemas: object[] = [
    getOrganizationSchema(),
    getWebSiteSchema(locales),
    getAuthorSchema(post),
    getArticleSchema(post, locale),
    getBlogPostingSchema(post, locale),
    getBlogBreadcrumbSchema(post, locale),
    getBlogImageSchema(post),
    getBlogSpeakableSchema(post, locale),
    getBlogWebPageSchema(post, locale),
    getBlogSectionSchema(locale)
  ]

  // Optional schemas
  const faqSchema = getBlogFAQSchema(post, locale)
  if (faqSchema) schemas.push(faqSchema)

  const videoSchema = getBlogVideoSchema(post)
  if (videoSchema) schemas.push(videoSchema)

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  }
}

// Helper function to generate metadata for blog posts
export function getBlogPostMetadata(post: BlogPostData, locale: string) {
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
  const title = `${post.headline} | DesireMap Blog`
  const description = post.description

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
      languages: {
        de: `/de/blog/${post.slug}`,
        en: `/en/blog/${post.slug}`,
        tr: `/tr/blog/${post.slug}`,
        ar: `/ar/blog/${post.slug}`
      }
    },
    openGraph: {
      type: 'article',
      url: postUrl,
      title,
      description,
      images: [{ url: post.image, width: 1200, height: 630 }],
      siteName: 'DesireMap',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author.name]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image]
    }
  }
}

const VENUE_TYPE_LABELS: Record<string, string> = {
  fkk: 'FKK Club',
  laufhaus: 'Laufhaus',
  bordell: 'Bordell',
  studio: 'Studio',
  privat: 'Privat',
}

function venueTypeLabel(type: string): string {
  return VENUE_TYPE_LABELS[type] ?? type
}

// Helper function to generate metadata for product pages
export function getProductMetadata(product: ProductDetailData, locale: string) {
  const productRelativePath = getVenueRelativePath(locale, product.slug)
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
  const typeLabel = venueTypeLabel(product.type)

  const title = `${product.name} | ${typeLabel} in ${product.city} | DesireMap`

  const descSnippet = product.description?.trim()
    ? product.description.substring(0, 100).trimEnd() + (product.description.length > 100 ? '…' : '')
    : `${typeLabel} in ${product.city} – verifizierte Adresse auf DesireMap.`
  const rawDescription = `${product.name} – ${typeLabel} in ${product.city}. ${descSnippet} Jetzt entdecken.`
  const description = rawDescription.length > 160 ? rawDescription.substring(0, 157) + '…' : rawDescription

  const imageUrl = product.image || `${siteUrl}/og-image.png`
  const ogLocale = locale === 'en' ? 'en_GB' : locale === 'tr' ? 'tr_TR' : locale === 'ar' ? 'ar_SA' : 'de_DE'

  return {
    title,
    description,
    alternates: {
      canonical: productRelativePath,
      languages: {
        de: getVenueRelativePath('de', product.slug),
        en: getVenueRelativePath('en', product.slug),
        tr: getVenueRelativePath('tr', product.slug),
        ar: getVenueRelativePath('ar', product.slug),
        'x-default': getVenueRelativePath('de', product.slug),
      },
    },
    openGraph: {
      type: 'website' as const,
      url: productUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${product.name} – ${typeLabel} in ${product.city}` }],
      siteName: 'DesireMap',
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [imageUrl],
    },
  }
}
