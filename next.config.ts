import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typedRoutes: true,
  typescript: {
    tsconfigPath:"tsconfig.json",
    ignoreBuildErrors:false
  }
}

export default withNextIntl(nextConfig)
