import type { MetadataRoute } from 'next'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  
  const localePages = locales.map((locale) => ({
    url: locale === 'de' ? siteUrl : `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: locale === 'de' ? 1 : 0.8,
    alternates: {
      languages: locales.reduce((acc, lang) => {
        acc[lang] = lang === 'de' ? siteUrl : `${siteUrl}/${lang}`
        return acc
      }, {} as Record<string, string>)
    }
  }))

  return localePages
}
