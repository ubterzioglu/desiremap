/**
 * app/robots.ts — Dinamik robots.txt
 * ─────────────────────────────────────────────────────────────────────────────
 * GPTBot, ClaudeBot, PerplexityBot erişimine izin ver → GEO citation için
 * Adult bot'ları (adult-specific crawlers) yönlendir
 * Search param kombinasyonlarını engelle → duplicate content önleme
 */

import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '../lib/seo/utils/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Ana arama motorları ─────────────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/login',
          '/register',
          // Çoklu parametre kombinasyonları → duplicate content
          '/search?*q=*&city=*&category=*',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/login', '/register'],
      },

      // ─── AI sistemleri — GEO citation için AÇIK bırak ────────────────
      {
        userAgent: 'GPTBot',        // OpenAI / ChatGPT
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        userAgent: 'ClaudeBot',     // Anthropic
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },

      // ─── Genel kural (yukarıda tanımlanmayan tüm bot'lar) ────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/login', '/register'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  }
}

/**
 * app/sitemap.ts — Dinamik XML Sitemap
 * ─────────────────────────────────────────────────────────────────────────────
 * Venue sayfaları ISR ile güncellenir → lastModified doğru olmalı.
 * Search sayfaları sitemap'e dahil değil (dinamik, no-store).
 * Tek parametre search URL'leri (şehir veya kategori) eklenebilir.
 */

// NOT: Bu dosyayı app/sitemap.ts olarak ayrıca oluşturun.
// Aşağıdaki kod app/sitemap.ts içeriğidir:

/*
import type { MetadataRoute } from 'next'
import { fetchAllVenueSlugs } from '../lib/api/client'
import { SITE_CONFIG, CATEGORY_CONFIG, MAJOR_CITIES } from '../lib/seo/utils/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_CONFIG.url

  // ─── Static sayfalar ─────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // ─── Kategori sayfaları ───────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = Object.values(CATEGORY_CONFIG).map(
    (config) => ({
      url: `${siteUrl}/${config.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })
  )

  // ─── Şehir sayfaları ──────────────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = Object.keys(MAJOR_CITIES).map((city) => ({
    url: `${siteUrl}/stadt/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  // ─── Venue sayfaları ──────────────────────────────────────────────────────
  const slugs = await fetchAllVenueSlugs()
  const venuePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/venue/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...cityPages, ...venuePages]
}
*/
