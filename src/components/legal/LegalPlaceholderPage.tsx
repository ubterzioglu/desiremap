import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getLocalizedPath } from '@/lib/navigation'

type LegalPlaceholderPageProps = {
  locale: string
  title: string
  message: string
  eyebrow?: string
  children?: ReactNode
}

export function getLegalPlaceholderMetadata(locale: string, slug: string, title: string, message: string): Metadata {
  const canonicalPath = getLocalizedPath(locale, `/${slug}`)
  const absoluteUrl = `https://desiremap.de${canonicalPath}`

  return {
    title: `${title} | DesireMap`,
    description: `${title} – ${message}`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: absoluteUrl,
      title: `${title} | DesireMap`,
      description: `${title} – ${message}`,
      siteName: 'DesireMap',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export async function LegalPlaceholderPage({ locale, title, message, eyebrow = 'Legal', children }: LegalPlaceholderPageProps) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const homePath = getLocalizedPath(locale, '/')

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0F172A] to-[#0b1326]">
      <Header
        locale={locale}
        translations={{
          home: t('home'),
          discover: t('discover'),
          cities: t('cities'),
          premium: t('premium'),
          advertise: t('advertise'),
          login: t('login'),
          register: t('register'),
          myAccount: t('myAccount'),
        }}
      />
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#564146] bg-[#131b2e]/88 p-8 shadow-[0_24px_60px_rgba(6,14,32,0.28)] backdrop-blur-sm sm:p-10">
          <span className="inline-flex rounded-full border border-[#8b1a4a]/45 bg-[#8b1a4a]/12 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-[#ffb1c6] uppercase">
            {eyebrow}
          </span>
          <h1 className="mt-6 text-3xl font-bold text-[#dae2fd] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-[#a48a90]">
            {message}
          </p>
          {children ? (
            <div className="mt-8 space-y-8 text-sm leading-7 text-[#c4cede]">{children}</div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[#8fa3bf]">
              Inhalte folgen bald. Sobald die finalen Rechtstexte bereit sind, werden sie hier veröffentlicht.
            </p>
          )}
          <div className="mt-8">
            <Link
              href={homePath}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b1a4a] to-[#6b1a5c] px-6 py-3 font-medium text-[#dae2fd] transition-all hover:from-[#a8255c] hover:to-[#7d2a6e]"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
