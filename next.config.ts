import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const indexableXRobotsValue = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const noindexXRobotsValue = 'noindex, nofollow'

function createXRobotsHeaders(sources: string[], value: string) {
  return sources.map((source) => ({
    source,
    headers: [{ key: 'X-Robots-Tag', value }]
  }))
}

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typedRoutes: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.178.160'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.desiremap.de' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i0.web.de' },
    ],
  },
  async headers() {
    const publicSources = [
      '/',
      '/blog',
      '/blog/:slug',
      '/venue/:slug',
      '/bordell/:slug',
      '/stadt/:city',
      '/:locale(en|tr|ar)',
      '/:locale(en|tr|ar)/blog',
      '/:locale(en|tr|ar)/blog/:slug',
      '/:locale(en|tr|ar)/venue/:slug',
      '/:locale(en|tr|ar)/bordell/:slug',
      '/:locale(en|tr|ar)/stadt/:city'
    ]
    const restrictedSources = [
      '/search',
      '/:locale(en|tr|ar)/search',
    ]

    const linkValue = [
      '</sitemap.xml>; rel="describedby"; type="application/xml"',
      '<https://api.desiremap.de/api>; rel="service-desc"; type="application/json"',
    ].join(', ')

    const homepageSources = ['/', '/:locale(en|tr|ar)']

    return [
      ...createXRobotsHeaders(publicSources, indexableXRobotsValue),
      ...createXRobotsHeaders(restrictedSources, noindexXRobotsValue),
      ...homepageSources.map((source) => ({
        source,
        headers: [{ key: 'Link', value: linkValue }],
      })),
    ]
  },
  typescript: {
    tsconfigPath:"tsconfig.json",
    ignoreBuildErrors:false
  }
}

export default withNextIntl(nextConfig)
