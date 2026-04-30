import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LocaleInit } from '@/components/layout/LocaleInit'
import { getHomeSeoMetadata } from '@/lib/seo/home'

const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a0a0f' }

const ogLocales: Record<string, string> = { de: 'de_DE', en: 'en_US', ar: 'ar_SA', tr: 'tr_TR' }

function getLocaleData(locale: string) {
  const homeMetadata = getHomeSeoMetadata(locale)

  return {
    title: homeMetadata.title,
    description: homeMetadata.description,
    ogLocale: ogLocales[locale] || ogLocales.de
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { title, description, ogLocale } = getLocaleData(locale)
  const canonical = locale === 'de' ? '/' : `/${locale}`
  const publishedTime = '2025-01-15T08:00:00+01:00'
  const modifiedTime = new Date().toISOString()

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s ' },
    description,
    icons: { icon: '/icon.svg', apple: '/icon.svg' },
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    alternates: {
      canonical,
      languages: { de: '/', en: '/en', tr: '/tr', ar: '/ar', 'x-default': '/' }
    },
    openGraph: {
      type: 'article',
      locale: ogLocale,
      url: `${siteUrl}${canonical}`,
      siteName: 'DesireMap',
      title,
      description,
      publishedTime,
      modifiedTime,
      images: [{ url: '/hero-bg.jpg', width: 1200, height: 630 }]
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/hero-bg.jpg'] }
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <>
      <LocaleInit locale={locale} />
      <QueryProvider>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </SessionProvider>
      </QueryProvider>
    </>
  )
}
