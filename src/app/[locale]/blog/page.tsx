import { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/data/blog-posts'
import { Calendar, Clock, User } from 'lucide-react'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = 'https://desiremap.de'

  return {
    title: 'Blog | DesireMap - Premium Erotik Hizmetler Pazar Yeri',
    description: 'DesireMap blogunda erotik sektörü hakkında makaleler, rehberler ve ipuçları bulabilirsiniz. FKK Club, Laufhaus ve Bordell mekanları hakkında detaylı bilgiler.',
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        de: '/de/blog',
        en: '/en/blog',
        tr: '/tr/blog',
        ar: '/ar/blog'
      }
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}/blog`,
      title: 'Blog | DesireMap',
      description: 'DesireMap blogunda erotik sektörü hakkında makaleler, rehberler ve ipuçları.',
      siteName: 'DesireMap'
    }
  }
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] to-[#1a1a24]">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            DesireMap Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Erotik sektörü hakkında rehberler, incelemeler ve en güncel bilgiler
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#b76e79]/50 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📝</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#8b1a4a] text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-[#b76e79] transition-colors">
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      {post.headline}
                    </Link>
                  </h2>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.datePublished).toLocaleDateString('de-DE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.ceil(post.wordCount / 200)} dk</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
