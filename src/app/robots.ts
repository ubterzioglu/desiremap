import type { MetadataRoute } from 'next'

const siteUrl = 'https://desiremap.de'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/'
      },
      {
        userAgent: 'Bingbot',
        allow: '/'
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  }
}
