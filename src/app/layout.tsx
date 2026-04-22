import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap', preload: false })

const siteUrl = 'https://desiremap.de'

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a0a0f' }

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'DesireMap - Premium Erotik Guide', template: '%s ' },
  description: 'Entdecken Sie 847+ verifizierte FKK Clubs, Bordelle und Laufhäuser in ganz Deutschland.',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
    languages: { de: '/', en: '/en', tr: '/tr', ar: '/ar', 'x-default': '/' }
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteUrl,
    siteName: 'DesireMap',
    title: 'DesireMap - Premium Erotik Guide',
    description: 'Entdecken Sie 847+ verifizierte FKK Clubs, Bordelle und Laufhäuser in ganz Deutschland.',
    images: [{ url: '/hero-bg.jpg', width: 1200, height: 630 }]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
