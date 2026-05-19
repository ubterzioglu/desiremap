import { getAllBlogPostSlugs, getBlogPostBySlug } from '@/data/blog-posts'
import { backendApi } from '@/lib/backend-client'
import { getCityPath, getLocalizedPath, getVenuePath } from '@/lib/navigation'
import type { PublicCity } from '@/types'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr'] as const
const defaultLocale = 'de'
const maxSitemapItems = 5000

export const dynamic = 'force-dynamic'

type Locale = (typeof locales)[number]
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

type SitemapEntry = {
  url: string
  lastModified: Date | string
  changeFrequency: ChangeFrequency
  priority: number
}

function absoluteUrl(path: string) {
  return path === '/' ? siteUrl : `${siteUrl}${path}`
}

function localizedPath(locale: Locale, path: string) {
  if (path === '/') {
    return locale === defaultLocale ? '/' : `/${locale}`
  }

  return getLocalizedPath(locale, path)
}

function sitemapPriority(priority: number) {
  return Number(priority.toFixed(1))
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
  return locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    changeFrequency,
    priority: sitemapPriority(locale === defaultLocale ? priority : Math.max(priority - 0.1, 0.1)),
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

async function fetchPublicEstablishmentSlugs(): Promise<string[]> {
  const pageSize = 100
  const slugs: string[] = []
  const seen = new Set<string>()
  let offset = 0
  let total = Number.POSITIVE_INFINITY

  try {
    while (offset < total && slugs.length < maxSitemapItems) {
      const response = await backendApi.getPublicEstablishments({ limit: pageSize, offset })

      for (const e of response.results) {
        if (e.slug && e.isActive !== false && !seen.has(e.slug)) {
          seen.add(e.slug)
          slugs.push(e.slug)
        }
      }

      total = Number.isFinite(response.total) ? response.total : slugs.length

      if (response.results.length === 0) {
        break
      }

      offset += response.results.length
    }
  } catch {
    return []
  }

  return slugs
}

export async function getSitemapEntries() {
  const now = new Date()
  const [cities, establishmentSlugs] = await Promise.all([
    fetchPublicCities(),
    fetchPublicEstablishmentSlugs(),
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

  const venueEntries = establishmentSlugs.flatMap((slug) => localizedEntries({
    path: getVenuePath(defaultLocale, slug),
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastModified(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  const parsed = new Date(value)
  if (Number.isFinite(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return value.slice(0, 10)
}

function formatPriority(value: number) {
  return value.toFixed(1)
}

function sitemapEntryToXml(entry: SitemapEntry) {
  return [
    '<url>',
    `<loc>${escapeXml(entry.url)}</loc>`,
    `<lastmod>${escapeXml(formatLastModified(entry.lastModified))}</lastmod>`,
    `<changefreq>${entry.changeFrequency}</changefreq>`,
    `<priority>${formatPriority(entry.priority)}</priority>`,
    '</url>',
  ].join('\n')
}

export function buildSitemapXml(entries: SitemapEntry[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.map(sitemapEntryToXml).join('\n'),
    '</urlset>',
    '',
  ].join('\n')
}

export async function GET() {
  const entries = await getSitemapEntries()

  return new Response(buildSitemapXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
