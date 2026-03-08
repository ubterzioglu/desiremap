const siteUrl = 'https://desiremap.de'
const companyName = 'DesireMap'

// Product Listings für Homepage
const productListings = [
  {
    id: '1',
    name: 'Artemis Berlin',
    description: 'Berlins größtes FKK Club mit exklusivem Wellness-Bereich, mehreren Saunen und einer eleganten Bar. Diskretes Ambiente mit höchsten Standards.',
    image: `${siteUrl}/covers/artemis-bg.jpg`,
    url: `${siteUrl}/de/search?category=fkk`,
    brand: companyName,
    sku: 'FKK-BERLIN-001',
    mpn: 'ARTEMIS-001',
    price: '80.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: 4.8,
    reviewCount: 1247
  },
  {
    id: '2',
    name: 'Pascha Köln',
    description: 'Europas größtes Laufhaus mit 7 Etagen und über 120 Damen. 24 Stunden geöffnet, perfekte Erreichbarkeit im Zentrum von Köln.',
    image: `${siteUrl}/covers/pascha-bg.jpg`,
    url: `${siteUrl}/de/search?category=laufhaus`,
    brand: companyName,
    sku: 'LAUF-KOELN-001',
    mpn: 'PASCHA-001',
    price: '30.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: 4.6,
    reviewCount: 892
  },
  {
    id: '3',
    name: 'Café del Sol Hamburg',
    description: 'Exklusives Bordell in Hamburg mit diskreter Atmosphäre, privaten Zimmern und einer gemütlichen Bar.',
    image: `${siteUrl}/covers/cafe-del-sol-bg.jpg`,
    url: `${siteUrl}/de/search?category=bordell`,
    brand: companyName,
    sku: 'BORD-HAMBURG-001',
    mpn: 'CAFE-001',
    price: '50.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: 4.5,
    reviewCount: 423
  },
  {
    id: '4',
    name: 'Paradise Stuttgart',
    description: 'Premium FKK Club in Stuttgart mit großzügigem Außenbereich, Pool und entspannter Gartenlandschaft.',
    image: `${siteUrl}/covers/paradise-bg.jpg`,
    url: `${siteUrl}/de/search?category=fkk`,
    brand: companyName,
    sku: 'FKK-STUTTGART-001',
    mpn: 'PARADISE-001',
    price: '60.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: 4.7,
    reviewCount: 678
  },
  {
    id: '5',
    name: 'Royal München',
    description: 'Zentrales Laufhaus in München mit 3 Etagen und einer einladenden Bar.',
    image: `${siteUrl}/covers/royal-bg.jpg`,
    url: `${siteUrl}/de/search?category=laufhaus`,
    brand: companyName,
    sku: 'LAUF-MUENCHEN-001',
    mpn: 'ROYAL-001',
    price: '40.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/LimitedAvailability',
    ratingValue: 4.4,
    reviewCount: 312
  },
  {
    id: '6',
    name: 'Diamond Frankfurt',
    description: 'Exklusives Ambiente im Herzen von Frankfurt. VIP Suiten mit höchstem Komfort und absoluter Diskretion.',
    image: `${siteUrl}/covers/diamond-bg.jpg`,
    url: `${siteUrl}/de/search?category=bordell`,
    brand: companyName,
    sku: 'BORD-FRANKFURT-001',
    mpn: 'DIAMOND-001',
    price: '50.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: 4.6,
    reviewCount: 534
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
    description: 'Deutschlands führender Bordellmarkt für exklusive Erotik-Clubs, Bordelle und FKK-Saunen',
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

// 10. ItemList Schema mit Product Schemas
function getItemListSchema() {
  return {
    '@type': 'ItemList' as const,
    '@id': `${siteUrl}/#featured-listings`,
    name: 'Featured Listings auf dem Bordellmarkt',
    description: 'Die besten Erotik-Etablissements in Deutschland',
    numberOfItems: productListings.length,
    itemListElement: productListings.map((product, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'Product' as const,
        '@id': `${siteUrl}/#product-${product.id}`,
        name: product.name,
        image: product.image,
        description: product.description,
        brand: {
          '@type': 'Brand' as const,
          name: product.brand
        },
        url: product.url,
        sku: product.sku,
        mpn: product.mpn,
        offers: {
          '@type': 'Offer' as const,
          url: product.url,
          priceCurrency: product.priceCurrency,
          price: product.price,
          priceValidUntil: '2026-12-31',
          availability: product.availability,
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization' as const,
            name: companyName
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy' as const,
            applicableCountry: {
              '@type': 'Country' as const,
              name: 'DE'
            },
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn'
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails' as const,
            shippingRate: {
              '@type': 'MonetaryAmount' as const,
              value: '0.00',
              currency: 'EUR'
            },
            shippingDestination: {
              '@type': 'DefinedRegion' as const,
              addressCountry: 'DE'
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime' as const,
              handlingTime: {
                '@type': 'QuantitativeValue' as const,
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY'
              },
              transitTime: {
                '@type': 'QuantitativeValue' as const,
                minValue: 0,
                maxValue: 0,
                unitCode: 'DAY'
              }
            }
          }
        },
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
function getFAQPageSchema() {
  return {
    '@type': 'FAQPage' as const,
    mainEntity: [
      {
        '@type': 'Question' as const,
        name: 'Was kostet die Nutzung des Bordellmarkt?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'Die grundlegende Nutzung des Bordellmarkt ist kostenlos. Premium-Funktionen wie Prioritäts-Reservierung und exklusive Rabatte erfordern eine Mitgliedschaft.'
        }
      },
      {
        '@type': 'Question' as const,
        name: 'Wie werden Betriebe auf dem Bordellmarkt verifiziert?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'Jeder Betrieb durchläuft einen mehrstufigen Verifizierungsprozess. Das Team prüft Existenz, Aktualität und Qualität der angebotenen Services.'
        }
      },
      {
        '@type': 'Question' as const,
        name: 'Kann ich anonym bleiben?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'Ja, der Bordellmarkt schützt Ihre Privatsphäre. Sie können diskret nach Adressen suchen und Reservierungen tätigen ohne persönliche Daten preiszugeben.'
        }
      },
      {
        '@type': 'Question' as const,
        name: 'Welche Städte deckt der Bordellmarkt ab?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'Der Bordellmarkt ist in allen wichtigen deutschen Städten vertreten: Berlin, Hamburg, München, Köln, Frankfurt, Düsseldorf, Stuttgart und Nürnberg mit über 847 gelisteten Betrieben.'
        }
      }
    ]
  }
}

// OpeningHoursSpecification Schema
function getOpeningHoursSchema() {
  return {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ],
    opens: '00:00',
    closes: '23:59'
  }
}

// Main export function for Homepage
export function getStructuredData(locale: string, title: string, description: string, locales: string[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(locales),
      getWebPageSchema(locale, title, description),
      getBreadcrumbSchema(locale),
      getItemListSchema(),
      getFAQPageSchema(),
      getOpeningHoursSchema()
    ]
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
  city: string
  address: string
  phone?: string
  email?: string
  website?: string
  price: number
  priceCurrency: string
  availability: string
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

// Product Schema for Detail Page (7)
function getProductDetailSchema(product: ProductDetailData) {
  const productUrl = `${siteUrl}/de/bordell/${product.slug}`
  return {
    '@type': 'Product' as const,
    '@id': `${productUrl}/#product`,
    name: product.name,
    image: product.images ? [product.image, ...product.images] : product.image,
    description: product.description,
    brand: {
      '@type': 'Brand' as const,
      name: companyName
    },
    url: productUrl,
    sku: `${product.type.toUpperCase()}-${product.city.toUpperCase()}-${product.id}`,
    mpn: `${product.name.toUpperCase().replace(/\s+/g, '-')}-${product.id}`,
    offers: {
      '@type': 'Offer' as const,
      url: productUrl,
      priceCurrency: product.priceCurrency,
      price: product.price.toFixed(2),
      priceValidUntil: '2026-12-31',
      availability: product.availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization' as const,
        name: companyName
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy' as const,
        applicableCountry: {
          '@type': 'Country' as const,
          name: 'DE'
        },
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails' as const,
        shippingRate: {
          '@type': 'MonetaryAmount' as const,
          value: '0.00',
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion' as const,
          addressCountry: 'DE'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime' as const,
          handlingTime: {
            '@type': 'QuantitativeValue' as const,
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue' as const,
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    },
    review: getReviewSchemas(product.reviews, productUrl)
  }
}

// WebPage Schema for Detail Page (22)
function getProductWebPageSchema(product: ProductDetailData, locale: string) {
  const productUrl = `${siteUrl}/${locale}/bordell/${product.slug}`
  return {
    '@type': 'WebPage' as const,
    '@id': `${productUrl}/#webpage`,
    url: productUrl,
    name: `${product.name} - ${product.type} in ${product.city} | Bordellmarkt`,
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
    mainEntity: { '@id': `${productUrl}/#product` }
  }
}

// BreadcrumbList Schema for Detail Page (24-25)
function getProductBreadcrumbSchema(product: ProductDetailData, locale: string) {
  const productUrl = `${siteUrl}/${locale}/bordell/${product.slug}`
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
  const productUrl = `${siteUrl}/de/bordell/${product.slug}`
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
  return {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: product.openingHours.days,
    opens: product.openingHours.opens,
    closes: product.openingHours.closes
  }
}

// LocalBusiness Schema (additional for product pages)
function getLocalBusinessSchema(product: ProductDetailData) {
  const productUrl = `${siteUrl}/de/bordell/${product.slug}`
  return {
    '@type': 'LocalBusiness' as const,
    '@id': `${productUrl}/#localbusiness`,
    name: product.name,
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
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: '52.5200', // Default - should be dynamic
      longitude: '13.4050'
    },
    openingHoursSpecification: getProductOpeningHoursSchema(product),
    priceRange: `€${product.price}`,
    aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount
    },
    image: product.image,
    sameAs: product.website ? [product.website] : []
  }
}

// Related Products ItemList Schema
function getRelatedProductsSchema(product: ProductDetailData, locale: string) {
  const productUrl = `${siteUrl}/${locale}/bordell/${product.slug}`
  return {
    '@type': 'ItemList' as const,
    '@id': `${productUrl}/#related-products`,
    name: `Ähnliche ${product.type} in ${product.city}`,
    numberOfItems: product.relatedProducts.length,
    itemListElement: product.relatedProducts.map((related, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: related.name,
      url: `${siteUrl}/${locale}/bordell/${related.slug}`
    }))
  }
}

// Main export function for Product Detail Page
export function getProductDetailStructuredData(
  product: ProductDetailData,
  locale: string,
  locales: string[]
) {
  const productUrl = `${siteUrl}/${locale}/bordell/${product.slug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(locales),
      getProductDetailSchema(product),
      getProductWebPageSchema(product, locale),
      getProductBreadcrumbSchema(product, locale),
      getLocalBusinessSchema(product),
      getProductFAQSchema(product),
      getProductOpeningHoursSchema(product),
      getRelatedProductsSchema(product, locale)
    ]
  }
}

// Helper function to generate metadata for product pages
export function getProductMetadata(product: ProductDetailData, locale: string) {
  const productUrl = `${siteUrl}/${locale}/bordell/${product.slug}`
  const title = `${product.name} - ${product.type} in ${product.city} | Bordellmarkt`
  const description = `${product.name} in ${product.city}. ${product.description.substring(0, 120)}... Verifiziert auf dem Bordellmarkt.`

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
      languages: {
        de: `/de/bordell/${product.slug}`,
        en: `/en/bordell/${product.slug}`,
        tr: `/tr/bordell/${product.slug}`,
        ar: `/ar/bordell/${product.slug}`
      }
    },
    openGraph: {
      type: 'website',
      url: productUrl,
      title,
      description,
      images: [{ url: product.image, width: 1200, height: 630 }],
      siteName: 'DesireMap'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image]
    }
  }
}
