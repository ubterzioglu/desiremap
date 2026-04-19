'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ListingCard } from '@/components/listings/ListingCard'
import { usePublicEstablishments, usePublicServiceTypes } from '@/hooks/useQueries'
import { useParams, useRouter } from 'next/navigation'
import { getVenuePath } from '@/lib/navigation'
import type { Bordell, BordellType, PublicEstablishment } from '@/types'

function toListingCardBordell(e: PublicEstablishment): Bordell {
  return {
    id: e.slug,
    name: e.name,
    type: e.type as BordellType,
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange: e.priceMin != null ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}` : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    maxPrice: e.priceMax ?? undefined,
    ladiesCount: 0,
    services: e.tags,
    isOpen: false,
    openHours: '',
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: '',
    description: e.description ?? '',
    coverImage: e.images?.[0],
    images: e.images,
    createdAt: '',
    updatedAt: '',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }
}

export function ListingsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'de'
  const { data: result, isLoading } = usePublicEstablishments({ limit: 12, type: selectedCategory ?? undefined })
  const { data: serviceTypes = [] } = usePublicServiceTypes()

  const bordells = useMemo(() => (result?.items ?? []).map(toListingCardBordell), [result])


  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/listing-bg.jpg" alt="" fill className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0810]/10 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8b1a4a]/10 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6b3fa0]/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[#b76e79] text-sm font-medium tracking-widest uppercase mb-3">Empfehlungen</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Ausgewaehlte Betriebe</h2>
          <p className="text-gray-400 text-lg">{isLoading ? '...' : `${result?.total ?? bordells.length} verifizierte Betriebe`}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button onClick={() => setSelectedCategory(null)} size="sm" variant={selectedCategory === null ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === null ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/20 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm')}>Alle</Button>
          {serviceTypes.map((cat) => <Button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} size="sm" variant={selectedCategory === cat.slug ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === cat.slug ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/20 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm')}>{cat.name}</Button>)}
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 h-72 animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && bordells.length === 0 && (
          <div className="text-center text-gray-500 py-16">Noch keine Betriebe vorhanden.</div>
        )}
        {!isLoading && bordells.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bordells.map((bordell, index) => <ListingCard key={bordell.id} bordell={bordell} index={index} onDetailClick={(selectedBordell) => router.push(getVenuePath(locale, selectedBordell.id))} />)}
          </div>
        )}
        <div className="flex justify-center mt-16"><Button onClick={() => router.push(`/${locale}/search`)} size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-10 rounded-full group backdrop-blur-sm">Mehr anzeigen<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Button></div>
      </div>
    </section>
  )
}
