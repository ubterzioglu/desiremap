import type { MetadataRoute } from 'next'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  
  const localePages = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 1,
    alternates: {
      languages: locales.reduce((acc, lang) => {
        acc[lang] = `${siteUrl}/${lang}`
        return acc
      }, {} as Record<string, string>)
    }
  }))

  return localePages
}
