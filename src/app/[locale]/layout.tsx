import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { getStructuredData } from '@/lib/structuredData'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap', preload: false })
const siteUrl = 'https://desiremap.de'
const locales = ['de', 'en', 'ar', 'tr']

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a0a0f' }

const localeTitles: Record<string, string> = {
  de: 'DesireMap - Premium Erotik Guide Deutschland',
  en: 'DesireMap - Premium Erotic Guide Germany',
  tr: 'DesireMap - Almanya Erotik Rehberi',
  ar: 'DesireMap - دليل الإروتيك الألماني'
}
const localeDescriptions: Record<string, string> = {
  de: 'Exklusive FKK Clubs, Bordelle und Laufhäuser in Deutschland. Diskrete, verifizierte Adressen.',
  en: 'Exclusive FKK clubs, brothels and laufhaus in Germany. Discreet, verified addresses.',
  tr: 'Almanya\'da özel FKK kulüpleri, genelevler ve laufhaus. Gizli, doğrulanmış adresler.',
  ar: 'أندية FKK حصرية وبيوت الدعارة في ألمانيا. عناوين سرية وموثقة.'
}
const ogLocales: Record<string, string> = { de: 'de_DE', en: 'en_US', ar: 'ar_SA', tr: 'tr_TR' }

function getLocaleData(locale: string) {
  return {
    title: localeTitles[locale] || localeTitles.de,
    description: localeDescriptions[locale] || localeDescriptions.de,
    ogLocale: ogLocales[locale] || ogLocales.de
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { title, description, ogLocale } = getLocaleData(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s | DesireMap' },
    description,
    icons: { icon: '/icon.svg', apple: '/icon.svg' },
    alternates: {
      canonical: `/${locale}`,
      languages: { de: '/de', en: '/en', tr: '/tr', ar: '/ar', 'x-default': '/de' }
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: `${siteUrl}/${locale}`,
      siteName: 'DesireMap',
      title,
      description,
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
  const { title, description } = getLocaleData(locale)
  const structuredData = getStructuredData(locale, title, description, locales)

  return (
    <html lang={locale} className="dark" suppressHydrationWarning dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <SessionProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
