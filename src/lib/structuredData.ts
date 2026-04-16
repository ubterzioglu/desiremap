import { getVenuePath } from './navigation'
import { getHomeSeoExperience, getHomeSeoMetadata } from './seo/home'

const siteUrl = 'https://desiremap.de'
const companyName = 'DesireMap'

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
    slug: 'pascha-koln',
    description: 'Europas größtes Laufhaus mit 7 Etagen und über 120 Damen. 24 Stunden geöffnet, perfekte Erreichbarkeit im Zentrum von Köln.',
    image: `${siteUrl}/covers/pascha-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'pascha-koln'),
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
    slug: 'cafe-del-sol-hamburg',
    description: 'Exklusives Bordell in Hamburg mit diskreter Atmosphäre, privaten Zimmern und einer gemütlichen Bar.',
    image: `${siteUrl}/covers/cafe-del-sol-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'cafe-del-sol-hamburg'),
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
    slug: 'paradise-stuttgart',
    description: 'Premium FKK Club in Stuttgart mit großzügigem Außenbereich, Pool und entspannter Gartenlandschaft.',
    image: `${siteUrl}/covers/paradise-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'paradise-stuttgart'),
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
    slug: 'royal-munchen',
    description: 'Zentrales Laufhaus in München mit 3 Etagen und einer einladenden Bar.',
    image: `${siteUrl}/covers/royal-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'royal-munchen'),
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
    slug: 'diamond-frankfurt',
    description: 'Exklusives Ambiente im Herzen von Frankfurt. VIP Suiten mit höchstem Komfort und absoluter Diskretion.',
    image: `${siteUrl}/covers/diamond-bg.jpg`,
    url: getVenueAbsoluteUrl('de', 'diamond-frankfurt'),
    brand: companyName,
    sku: 'BORD-FRANKFURT-001',
    mpn: 'DIAMOND-001',
    price: '50.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
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
    brand: companyName,
    sku: 'FKK-KARLSRUHE-001',
    mpn: 'FLAMINGO-001',
    price: '54.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
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
    name: 'Featured Listings auf DesireMap',
    description: 'Verifizierte und stark nachgefragte Adressen in Deutschland',
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
  const productUrl = getVenueAbsoluteUrl('de', product.slug)
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
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
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
  return {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: product.openingHours.days,
    opens: product.openingHours.opens,
    closes: product.openingHours.closes
  }
}

// LocalBusiness Schema (additional for product pages)
function getLocalBusinessSchema(product: ProductDetailData) {
  const productUrl = getVenueAbsoluteUrl('de', product.slug)
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
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`

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

// Helper function to generate metadata for product pages
export function getProductMetadata(product: ProductDetailData, locale: string) {
  const productUrl = getVenueAbsoluteUrl(locale, product.slug)
  const title = `${product.name} - ${product.type} in ${product.city} | Bordellmarkt`
  const description = `${product.name} in ${product.city}. ${product.description.substring(0, 120)}... Verifiziert auf dem Bordellmarkt.`

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
      languages: {
        de: getVenueRelativePath('de', product.slug),
        en: getVenueRelativePath('en', product.slug),
        tr: getVenueRelativePath('tr', product.slug),
        ar: getVenueRelativePath('ar', product.slug)
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
