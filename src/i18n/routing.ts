import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en', 'ar', 'tr'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  localeDetection: false
})
