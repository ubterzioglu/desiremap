'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ListingCard } from '@/components/listings/ListingCard'
import { usePublicEstablishments, usePublicServiceTypes } from '@/hooks/useQueries'
import { useParams, useRouter } from 'next/navigation'
import { toBordellType } from '@/lib/bordell-type'
import { getCategoryPath, getSearchPath, getVenuePath } from '@/lib/navigation'
import type { Bordell, PublicEstablishment } from '@/types'

const LOADING_SKELETON_KEYS = [
  'listing-card-skeleton-1',
  'listing-card-skeleton-2',
  'listing-card-skeleton-3',
  'listing-card-skeleton-4',
  'listing-card-skeleton-5',
  'listing-card-skeleton-6',
]

function toListingCardBordell(e: PublicEstablishment): Bordell {
  const bordell: Bordell = {
    id: e.slug,
    name: e.name,
    type: toBordellType(e.type),
    location: e.city,
    city: e.city,
    distance: '',
    rating: e.rating ?? 0,
    reviewCount: e.reviewCount,
    priceRange: e.priceMin != null ? `€${e.priceMin}${e.priceMax ? ` - €${e.priceMax}` : ''}` : 'Auf Anfrage',
    minPrice: e.priceMin ?? 0,
    ladiesCount: 0,
    services: e.tags,
    isOpen: e.isActive ?? false,
    openHours: '',
    verified: e.verified,
    premium: false,
    sponsored: false,
    phone: '',
    description: e.description ?? '',
    coverImage: e.image || '/listing-bg.jpg',
    images: e.images,
    createdAt: '',
    updatedAt: '',
    views: 0,
    bookings: 0,
    revenue: 0,
    status: 'active',
  }

  if (e.priceMax != null) bordell.maxPrice = e.priceMax

  return bordell
}

function ListingsHeader({ resultCount: _resultCount }: { resultCount: number | undefined }) {
  return (
    <div className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-[#564146] bg-[#8b1a4a]/12 px-4 py-1 text-[11px] font-bold tracking-[0.22em] text-[#ffd9e1] uppercase">
          Empfehlungen
        </span>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#dae2fd] sm:text-4xl lg:text-5xl">
          Ausgewählte Betriebe
        </h2>
      </div>
      {/* <div className="rounded-[1.75rem] border border-[#334155]/55 bg-[#131b2e]/74 p-6 shadow-[0_24px_60px_rgba(6,14,32,0.28)] backdrop-blur-xl sm:p-7">
        <p className="text-base leading-8 text-[#dcbfc5] sm:text-lg">
          {resultCount ? `${resultCount} verifizierte Betriebe` : '...' }
        </p>
      </div> */}
    </div>
  )
}

export function ListingsSection() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'de'
  const establishmentParams = { limit: 12 }
  const { data: result, isLoading } = usePublicEstablishments(establishmentParams)
  const { data: serviceTypes = [] } = usePublicServiceTypes()
  const bordells = useMemo(() => (result?.items ?? []).map(toListingCardBordell), [result])

  return (
    <section className="relative overflow-hidden border-t border-white/6 bg-[#060e20] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0">
        <Image src="/listing-bg.jpg" alt="Hintergrundbild der Veranstaltungsübersicht" fill sizes="100vw" className="object-cover opacity-18" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,rgba(255,177,198,0.1),transparent_22%),radial-gradient(circle_at_right_top,rgba(212,175,55,0.08),transparent_18%),linear-gradient(180deg,rgba(6,14,32,0.84)_0%,rgba(6,14,32,0.96)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <ListingsHeader resultCount={result?.total ?? bordells.length} />

        <div className="mb-10 flex flex-wrap gap-3 rounded-[1.6rem] border border-[#334155]/55 bg-[#131b2e]/72 p-4 shadow-[0_20px_50px_rgba(6,14,32,0.22)] backdrop-blur-xl">
          <Link
            href={getSearchPath(locale)}
              className={cn(
                'inline-flex rounded-full px-5 py-2 text-sm',
                'border-0 bg-[#8b1a4a] text-white shadow-[0_14px_28px_rgba(139,26,74,0.28)]'
              )}
            >
              Alle
          </Link>
          {serviceTypes.map((cat) => (
            <Link
              key={cat.id}
              href={getCategoryPath(locale, cat.slug)}
                className={cn(
                  'inline-flex rounded-full px-5 py-2 text-sm',
                  'border border-[#334155] bg-transparent text-[#dcbfc5] hover:bg-[#171f33] hover:text-white'
                )}
              >
                {cat.name}
            </Link>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LOADING_SKELETON_KEYS.map((key) => (
              <div key={key} className="h-72 animate-pulse rounded-[1.6rem] border border-[#334155]/55 bg-[#171f33]/72" />
            ))}
          </div>
        )}

        {!isLoading && bordells.length === 0 && (
          <div className="rounded-[1.6rem] border border-[#334155]/55 bg-[#131b2e]/72 px-6 py-16 text-center text-[#dcbfc5]">
            Noch keine Betriebe vorhanden.
          </div>
        )}

        {!isLoading && bordells.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {bordells.map((bordell, index) => (
              <ListingCard
                key={bordell.id}
                bordell={bordell}
                detailHref={getVenuePath(locale, bordell.id)}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Button
            onClick={() => router.push(`/${locale}/search`)}
            size="lg"
            variant="outline"
            className="group rounded-full border-[#334155] bg-[#131b2e]/72 px-10 text-white backdrop-blur-xl hover:bg-[#171f33]"
          >
            Mehr anzeigen
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
