import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Calendar, Clock, User, ArrowLeft, Check, MapPin, Building2, Star, Shield } from 'lucide-react'
import { getBlogPostBySlug, getAllBlogPostSlugs } from '@/data/blog-posts'
import { premiumErotikPlattformContent, premiumErotikPlattformFAQ } from '@/data/blog-content'
import { getBlogPostStructuredData, getBlogPostMetadata, BlogPostData } from '@/lib/structuredData'
import { getSearchPath } from '@/lib/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Blog slug'ına göre içerik eşleştirmesi
const blogContentMap: Record<string, string> = {
  'premium-erotik-plattform': premiumErotikPlattformContent
}

const blogFAQMap: Record<string, Array<{ question: string; answer: string }>> = {
  'premium-erotik-plattform': premiumErotikPlattformFAQ
}

export async function generateStaticParams() {
  return getAllBlogPostSlugs().map((slug) => ({
    slug
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Beitrag nicht gefunden | DesireMap'
    }
  }

  return getBlogPostMetadata(post, locale)
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Blog içeriğini al
  const content = blogContentMap[slug] || '<p>Inhalt wird geladen...</p>'
  const faq = blogFAQMap[slug] || post.faq || []

  // Schema.org data hazırla
  const blogPostData: BlogPostData = {
    ...post,
    content: content.replace(/<[^>]*>/g, ''),
    faq
  }

  const structuredData = getBlogPostStructuredData(blogPostData, locale, ['de', 'en', 'tr', 'ar'])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
        {/* Breadcrumb */}
        <nav className="border-b border-[#564146] px-4 py-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-[#a48a90]">
              <Link href={`/${locale}`} className="transition-colors hover:text-[#dae2fd]">
                Home
              </Link>
              <span>/</span>
              <Link href={`/${locale}/blog`} className="transition-colors hover:text-[#dae2fd]">
                Blog
              </Link>
              <span>/</span>
              <span className="text-[#ffb1c6]">{post.category}</span>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <header className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Category */}
            <div className="mb-4">
              <span className="rounded-full bg-[#8b1a4a] px-3 py-1 text-sm font-medium text-[#dae2fd]">
                {post.category}
              </span>
            </div>

            {/* H1 - Ana Başlık */}
            <h1 className="mb-6 text-3xl leading-tight font-bold text-[#dae2fd] md:text-4xl lg:text-5xl">
              {post.headline}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-[#a48a90]">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b1a5c]">
                  <User className="h-5 w-5 text-[#ffb1c6]" />
                </div>
                <div>
                  <div className="font-medium text-[#dae2fd]">{post.author.name}</div>
                  <div className="text-xs">{post.author.jobTitle}</div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <span>
                  {new Date(post.datePublished).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Reading Time */}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#D4AF37]" />
                <span>{Math.ceil(post.wordCount / 200)} Min. Lesezeit</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#564146] bg-[#8b1a4a]/20 px-3 py-1 text-sm text-[#ffb1c6]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="px-4 py-8">
          <div
            className="mx-auto prose prose-lg max-w-4xl prose-invert
            prose-headings:font-bold prose-headings:text-[#dae2fd]
            prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#8b1a4a]/40 prose-h2:pb-2 prose-h2:text-2xl prose-h2:text-[#dae2fd]
            prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:text-[#ffb1c6]
            prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-lg prose-h4:text-[#dae2fd]
            prose-p:mb-4 prose-p:leading-relaxed prose-p:text-[#a48a90]
            prose-a:text-[#ffb1c6] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[#e8a0b0]
            prose-blockquote:rounded-r-xl prose-blockquote:border-l-[#8b1a4a] prose-blockquote:bg-[#8b1a4a]/15 prose-blockquote:px-6
            prose-blockquote:py-4 prose-blockquote:not-italic
            prose-strong:font-semibold prose-strong:text-[#dae2fd] prose-ol:mb-4 prose-ul:mb-4 prose-li:mb-1 prose-li:text-[#a48a90]
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>

        {/* FAQ Section */}
        {faq.length > 0 && (
          <section className="border-t border-[#564146] px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-[#dae2fd]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b1a4a]/25 text-[#D4AF37]">
                  ?
                </span>
                Häufig gestellte Fragen
              </h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group overflow-hidden rounded-xl border border-[#564146] bg-[#131b2e] backdrop-blur-sm transition-all hover:border-[#B76E79]/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                      <span className="pr-4 text-lg font-semibold text-[#dae2fd]">
                        {item.question}
                      </span>
                      <span className="text-[#D4AF37] transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="leading-relaxed text-[#a48a90]">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Author Box */}
        <section className="border-t border-[#564146] px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-[#564146] bg-[#131b2e] p-8 backdrop-blur-sm">
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b1a5c]">
                  <User className="h-10 w-10 text-[#ffb1c6]" />
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-[#dae2fd]">
                    {post.author.name}
                  </h3>
                  <p className="mb-3 text-sm text-[#ffb1c6]">{post.author.jobTitle}</p>
                  <p className="leading-relaxed text-[#a48a90]">
                    {post.author.description}
                  </p>
                  {post.author.sameAs && (
                    <div className="mt-4 flex gap-4">
                      {post.author.sameAs.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#a48a90] transition-colors hover:text-[#ffb1c6]"
                        >
                          {url.includes('linkedin') ? 'LinkedIn' : url.includes('twitter') ? 'Twitter' : 'Profil'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="border-t border-[#564146] px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-xl font-bold text-[#dae2fd]">Beliebte Kategorien</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Link
                href={getSearchPath(locale, { category: 'fkk' })}
                className="flex items-center gap-3 rounded-xl border border-[#564146] bg-[#131b2e] p-4 transition-all hover:border-[#B76E79]/60"
              >
                <Building2 className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-sm text-[#dae2fd]">FKK Clubs</span>
              </Link>
              <Link
                href={getSearchPath(locale, { category: 'laufhaus' })}
                className="flex items-center gap-3 rounded-xl border border-[#564146] bg-[#131b2e] p-4 transition-all hover:border-[#B76E79]/60"
              >
                <Building2 className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-sm text-[#dae2fd]">Laufhäuser</span>
              </Link>
              <Link
                href={getSearchPath(locale, { category: 'bordell' })}
                className="flex items-center gap-3 rounded-xl border border-[#564146] bg-[#131b2e] p-4 transition-all hover:border-[#B76E79]/60"
              >
                <Building2 className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-sm text-[#dae2fd]">Bordelle</span>
              </Link>
              <Link
                href={getSearchPath(locale, { city: 'Berlin' })}
                className="flex items-center gap-3 rounded-xl border border-[#564146] bg-[#131b2e] p-4 transition-all hover:border-[#B76E79]/60"
              >
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-sm text-[#dae2fd]">Berlin</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-[#564146] px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl border border-[#564146] bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b1a5c]/20 p-8 md:p-12">
              <div className="mb-6 flex justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b1a4a]/30">
                  <Check className="h-6 w-6 text-[#38BDF8]" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b1a4a]/30">
                  <Star className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b1a4a]/30">
                  <Shield className="h-6 w-6 text-[#ffb1c6]" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#dae2fd] md:text-3xl">
                Jetzt auf DesireMap stöbern
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-[#a48a90]">
                Entdecken Sie 847+ verifizierte Betriebe in ganz Deutschland.
                Qualitätsgeprüft, echt bewertet, diskret kontaktiert.
              </p>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b1a4a] to-[#6b1a5c] px-8 py-4 font-medium text-[#dae2fd] shadow-lg transition-all hover:from-[#a8255c] hover:to-[#7d2a6e] hover:shadow-xl hover:shadow-[#8b1a4a]/25"
              >
                Betriebe entdecken
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
        </main>
        <Footer locale={locale} />
      </div>
    </>
  )
}
