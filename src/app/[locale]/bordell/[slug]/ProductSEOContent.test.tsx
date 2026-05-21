import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { ProductSEOContent } from './ProductSEOContent'
import type { ProductDetailData } from '@/lib/structuredData'

describe('ProductSEOContent', () => {
  test('does not generate venue-specific SEO copy when public sections are empty', () => {
    const productData: ProductDetailData = {
      id: 'empty-content-venue',
      name: 'Empty Content Venue',
      slug: 'empty-content-venue',
      description: '',
      image: 'https://desiremap.de/listing-bg.jpg',
      images: [],
      type: 'fkk',
      detailContent: null,
      city: 'Berlin',
      address: 'Berlin',
      price: 0,
      ratingValue: 0,
      reviewCount: 0,
      reviews: [],
      openingHours: { days: [], opens: '', closes: '' },
      services: [],
      ladiesCount: 0,
      verified: false,
      premium: false,
      relatedProducts: [],
      faq: [],
      datePublished: '2025-01-01T00:00:00.000Z',
      dateModified: '2025-01-01T00:00:00.000Z',
    }

    const html = renderToStaticMarkup(<ProductSEOContent productData={productData} locale="de" />)

    expect(html).not.toContain('renommierter')
    expect(html).not.toContain('umfangreiches Serviceportfolio')
    expect(html).not.toContain('Die Preise in Empty Content Venue')
    expect(html).not.toContain('zentral gelegen')
    expect(html).not.toContain('Das Ambiente in Empty Content Venue')
    expect(html).not.toContain('Online-Reservierung')
  })
})
