import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { blogPosts } from '@/data/blog-posts'
import { Calendar, Clock, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { getLocalizedPath } from '@/lib/navigation'
import { ORG_ID, WEBSITE_ID } from '@/lib/seo/schema'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = 'https://desiremap.de'
  const blogUrl = locale === 'de' ? `${siteUrl}/blog` : `${siteUrl}/${locale}/blog`

  return {
    title: 'Blog | DesireMap - Premium Erotik Guide',
    description: 'Der DesireMap Blog bietet Guides, Tipps und Informationen zu FKK Clubs, Laufhäusern und Bordellen in Deutschland. Entdecken Sie verifizierte Premium-Betriebe.',
    alternates: {
      canonical: blogUrl,
      languages: {
        de: '/blog',
        en: '/en/blog',
        tr: '/tr/blog',
        ar: '/ar/blog'
      }
    },
    openGraph: {
      type: 'website',
      url: blogUrl,
      title: 'Blog | DesireMap',
      description: 'Guides und Tipps zu erotischen Dienstleistungen in Deutschland.',
      siteName: 'DesireMap',
      images: [{ url: `${siteUrl}/hero-bg.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | DesireMap',
      description: 'Guides und Tipps zu erotischen Dienstleistungen in Deutschland.',
      images: [`${siteUrl}/hero-bg.jpg`],
    },
  }
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const siteUrl = 'https://desiremap.de'
  const blogUrl = locale === 'de' ? `${siteUrl}/blog` : `${siteUrl}/${locale}/blog`
  const homePath = getLocalizedPath(locale, '/')

  const blogSchemas = [
    {
      '@type': 'Blog',
      '@id': `${blogUrl}#blog`,
      url: blogUrl,
      name: 'DesireMap Blog',
      description: 'Guides und Tipps zu FKK Clubs, Laufhäusern und Bordellen in Deutschland.',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
      inLanguage: locale,
      blogPost: blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.headline,
        url: locale === 'de' ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/${locale}/blog/${post.slug}`,
        datePublished: post.datePublished,
        author: { '@type': 'Person', name: post.author.name },
        description: post.description,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: locale === 'de' ? siteUrl : `${siteUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: blogUrl },
      ],
    },
  ]

  return (
    <>
      <JsonLd schemas={blogSchemas} />
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
        <main className="flex-1">
          <section className="relative px-4 py-20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#8b1a4a]/15 to-transparent" />
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-[#dae2fd] md:text-5xl">
                DesireMap Blog
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-[#a48a90]">
                Guides, Tipps und Einblicke zu FKK Clubs, Laufhäusern und Bordellen in Deutschland
              </p>
            </div>
          </section>

          <section className="px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-2xl border border-[#564146] bg-[#131b2e] backdrop-blur-sm transition-all duration-300 hover:border-[#B76E79]/60"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-[#8b1a4a]/25 to-[#6b1a5c]/25">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📝</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-[#8b1a4a] px-3 py-1 text-xs font-medium text-[#dae2fd]">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="mb-3 text-xl font-semibold text-[#dae2fd] transition-colors group-hover:text-[#ffb1c6]">
                        <Link href={getLocalizedPath(locale, `/blog/${post.slug}`)}>
                          {post.headline}
                        </Link>
                      </h2>

                      <p className="mb-4 line-clamp-3 text-sm text-[#a48a90]">
                        {post.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-[#a48a90]">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-[#D4AF37]" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#D4AF37]" />
                          <span>
                            {new Date(post.datePublished).toLocaleDateString('de-DE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-[#D4AF37]" />
                          <span>{Math.ceil(post.wordCount / 200)} Min.</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[#8b1a4a]/20 px-2 py-1 text-xs text-[#ffb1c6]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-[#564146] px-4 py-16">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-[#dae2fd]">
                Betriebe entdecken
              </h2>
              <p className="mb-8 text-[#a48a90]">
                Stöbern Sie durch 847+ verifizierte Premium-Betriebe in ganz Deutschland
              </p>
              <Link
                href={homePath}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b1a4a] to-[#6b1a5c] px-6 py-3 font-medium text-[#dae2fd] transition-all hover:from-[#a8255c] hover:to-[#7d2a6e]"
              >
                Jetzt stöbern →
              </Link>
            </div>
          </section>
        </main>
        <Footer locale={locale} />
      </div>
    </>
  )
}
