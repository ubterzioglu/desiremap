import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, Check, MapPin, Building2, Star, Shield } from 'lucide-react'
import { blogPosts, getBlogPostBySlug, getAllBlogPostSlugs } from '@/data/blog-posts'
import { premiumErotikPazarYeriContent, premiumErotikPazarYeriFAQ } from '@/data/blog-content'
import { getBlogPostStructuredData, getBlogPostMetadata, BlogPostData } from '@/lib/structuredData'

// Blog slug'ına göre içerik eşleştirmesi
const blogContentMap: Record<string, string> = {
  'premium-erotik-pazar-yeri': premiumErotikPazarYeriContent
}

const blogFAQMap: Record<string, Array<{ question: string; answer: string }>> = {
  'premium-erotik-pazar-yeri': premiumErotikPazarYeriFAQ
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

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] to-[#1a1a24]">
        {/* Breadcrumb */}
        <nav className="py-4 px-4 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-[#b76e79]">{post.category}</span>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <header className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-[#8b1a4a] text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>

            {/* H1 - Ana Başlık */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.headline}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{post.author.name}</div>
                  <div className="text-xs">{post.author.jobTitle}</div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
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
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(post.wordCount / 200)} Min. Lesezeit</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-8 px-4">
          <div
            className="max-w-4xl mx-auto prose prose-lg prose-invert
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-white prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#8b1a4a]/30
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[#b76e79]
            prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-white
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:mb-4 prose-ol:mb-4 prose-li:text-gray-300 prose-li:mb-1
            prose-a:text-[#b76e79] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[#d48a95]
            prose-strong:text-white prose-strong:font-semibold
            prose-blockquote:border-l-[#8b1a4a] prose-blockquote:bg-[#8b1a4a]/10 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>

        {/* FAQ Section */}
        {faq.length > 0 && (
          <section className="py-12 px-4 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#8b1a4a]/20 flex items-center justify-center text-[#b76e79]">
                  ?
                </span>
                Häufig gestellte Fragen
              </h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <span className="text-lg font-semibold text-white pr-4">
                        {item.question}
                      </span>
                      <span className="text-[#b76e79] group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-400 leading-relaxed">
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
        <section className="py-12 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {post.author.name}
                  </h3>
                  <p className="text-[#b76e79] text-sm mb-3">{post.author.jobTitle}</p>
                  <p className="text-gray-400 leading-relaxed">
                    {post.author.description}
                  </p>
                  {post.author.sameAs && (
                    <div className="flex gap-4 mt-4">
                      {post.author.sameAs.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm"
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
        <section className="py-12 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Beliebte Kategorien</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href={`/${locale}/search?category=fkk`}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#b76e79]/50 transition-all"
              >
                <Building2 className="w-5 h-5 text-[#b76e79]" />
                <span className="text-white text-sm">FKK Clubs</span>
              </Link>
              <Link
                href={`/${locale}/search?category=laufhaus`}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#b76e79]/50 transition-all"
              >
                <Building2 className="w-5 h-5 text-[#b76e79]" />
                <span className="text-white text-sm">Laufhäuser</span>
              </Link>
              <Link
                href={`/${locale}/search?category=bordell`}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#b76e79]/50 transition-all"
              >
                <Building2 className="w-5 h-5 text-[#b76e79]" />
                <span className="text-white text-sm">Bordelle</span>
              </Link>
              <Link
                href={`/${locale}/search?city=Berlin`}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#b76e79]/50 transition-all"
              >
                <MapPin className="w-5 h-5 text-[#b76e79]" />
                <span className="text-white text-sm">Berlin</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 rounded-3xl p-8 md:p-12 border border-white/10">
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Jetzt auf DesireMap stöbern
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Entdecken Sie 847+ verifizierte Betriebe in ganz Deutschland.
                Qualitätsgeprüft, echt bewertet, diskret kontaktiert.
              </p>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white font-medium rounded-xl hover:from-[#a8255c] hover:to-[#7d4fb5] transition-all shadow-lg hover:shadow-xl hover:shadow-[#8b1a4a]/20"
              >
                Betriebe entdecken
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
