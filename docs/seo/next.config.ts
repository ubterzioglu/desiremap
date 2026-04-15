import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ─── i18n locale routing ────────────────────────────────────────────────────
  // `de` default locale → prefix yok  →  desiremap.de/venue/pascha-koln
  // `en` locale         → prefix var  →  desiremap.de/en/venue/pascha-koln
  // Next.js App Router'da bu middleware ile yönetilir (aşağıya bakın)

  // ─── ISR revalidation süresi ────────────────────────────────────────────────
  // Venue sayfaları: 24 saat (mekan bilgisi sık değişmez)
  // Search sayfaları: her zaman dinamik (no-store)

  // ─── Image domains ──────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.desiremap.de',
        pathname: '/venues/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── TypeScript strict ──────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── SEO: trailing slash tutarsızlığını önler ───────────────────────────────
  trailingSlash: false,

  // ─── Güvenlik headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // JMStV adult content label — tüm sayfalarda
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
