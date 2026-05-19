import type { MetadataRoute } from 'next'
import { getAllBlogPostSlugs, getBlogPostBySlug } from '@/data/blog-posts'
import { backendApi } from '@/lib/backend-client'
import { getCityPath, getLocalizedPath, getVenuePath } from '@/lib/navigation'
import type { PublicCity, PublicEstablishment } from '@/types'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr'] as const
const defaultLocale = 'de'
const maxSitemapItems = 5000

type Locale = (typeof locales)[number]
type SitemapEntry = MetadataRoute.Sitemap[number]
type ChangeFrequency = NonNullable<SitemapEntry['changeFrequency']>

function absoluteUrl(path: string) {
  return path === '/' ? siteUrl : `${siteUrl}${path}`
}

function localizedPath(locale: Locale, path: string) {
  return getLocalizedPath(locale, path)
}

function languageAlternates(path: string) {
  return locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = absoluteUrl(localizedPath(locale, path))
    return acc
  }, {})
}

function localizedEntries({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string
  lastModified: Date | string
  changeFrequency: ChangeFrequency
  priority: number
}): SitemapEntry[] {
  const alternates = languageAlternates(path)

  return locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    changeFrequency,
    priority: locale === defaultLocale ? priority : Math.max(priority - 0.1, 0.1),
    alternates: {
      languages: alternates,
    },
  }))
}

async function fetchPublicCities() {
  try {
    const response = await backendApi.getPublicStadtCities()
    return response.items.filter((city) => city.slug && city.isActive !== false)
  } catch {
    return [] satisfies PublicCity[]
  }
}

async function fetchPublicEstablishments() {
  const pageSize = 100
  const establishments: PublicEstablishment[] = []
  let offset = 0
  let total = Number.POSITIVE_INFINITY

  try {
    while (offset < total && establishments.length < maxSitemapItems) {
      const response = await backendApi.getPublicEstablishments({ limit: pageSize, offset })
      const page = response.results.filter((establishment) => (
        establishment.slug && establishment.isActive !== false
      ))

      establishments.push(...page)
      total = Number.isFinite(response.total) ? response.total : establishments.length

      if (response.results.length === 0) {
        break
      }

      offset += response.results.length
    }
  } catch {
    return []
  }

  const seen = new Set<string>()
  return establishments.filter((establishment) => {
    if (seen.has(establishment.slug)) {
      return false
    }

    seen.add(establishment.slug)
    return true
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [cities, establishments] = await Promise.all([
    fetchPublicCities(),
    fetchPublicEstablishments(),
  ])

  const staticEntries = [
    ...localizedEntries({ path: '/', lastModified: now, changeFrequency: 'daily', priority: 1 }),
    ...localizedEntries({ path: '/stadt', lastModified: now, changeFrequency: 'daily', priority: 0.8 }),
    ...localizedEntries({ path: '/blog', lastModified: now, changeFrequency: 'weekly', priority: 0.7 }),
  ]

  const cityEntries = cities.flatMap((city) => localizedEntries({
    path: getCityPath(defaultLocale, city.slug),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const venueEntries = establishments.flatMap((establishment) => localizedEntries({
    path: getVenuePath(defaultLocale, establishment.slug),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const blogEntries = getAllBlogPostSlugs().flatMap((slug) => {
    const post = getBlogPostBySlug(slug)
    return localizedEntries({
      path: `/blog/${slug}`,
      lastModified: post?.dateModified ?? now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return [
    ...staticEntries,
    ...cityEntries,
    ...venueEntries,
    ...blogEntries,
  ]
}
