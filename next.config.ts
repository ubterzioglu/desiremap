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
  async headers() {
    const publicSources = [
      '/',
      '/blog',
      '/blog/:slug',
      '/bordell/:slug',
      '/:locale(en|tr|ar)',
      '/:locale(en|tr|ar)/blog',
      '/:locale(en|tr|ar)/blog/:slug',
      '/:locale(en|tr|ar)/bordell/:slug'
    ]
    const restrictedSources = [
      '/api/:path*',
      '/search',
      '/login',
      '/register',
      '/dashboard',
      '/admin',
      '/admin/:path*',
      '/:locale(en|tr|ar)/search',
      '/:locale(en|tr|ar)/login',
      '/:locale(en|tr|ar)/register',
      '/:locale(en|tr|ar)/dashboard',
      '/:locale(en|tr|ar)/admin',
      '/:locale(en|tr|ar)/admin/:path*'
    ]

    return [
      ...createXRobotsHeaders(publicSources, indexableXRobotsValue),
      ...createXRobotsHeaders(restrictedSources, noindexXRobotsValue)
    ]
  },
  typescript: {
    tsconfigPath:"tsconfig.json",
    ignoreBuildErrors:false
  }
}

export default withNextIntl(nextConfig)
