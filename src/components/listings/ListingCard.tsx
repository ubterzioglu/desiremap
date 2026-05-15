'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Calendar, Check, Clock, Crown, Eye, Heart, MapPin, Star, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReservationModal } from '@/components/listings/ReservationModal'
import type { Bordell } from '@/types'

type ListingCardProps = { bordell: Bordell; index: number; onDetailClickAction: (bordell: Bordell) => void }

function getPriceLabel(bordell: Bordell, fallback: string) {
  if (bordell.minPrice <= 0) return bordell.priceRange || fallback

  return `€${bordell.minPrice}${bordell.maxPrice ? ` - €${bordell.maxPrice}` : ''}`
}

export function ListingCard({ bordell, index, onDetailClickAction }: ListingCardProps) {
  const t = useTranslations('listing')
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const typeLabels = {
    laufhaus: t('types.laufhaus'),
    bordell: t('types.bordell'),
    fkk: t('types.fkk'),
    studio: t('types.studio'),
    privat: t('types.privat'),
  }
  const primaryImage = bordell.coverImage
  const priceLabel = getPriceLabel(bordell, t('priceOnRequest'))
  const detailLabel = t('actions.details', { name: bordell.name })
  const reserveLabel = t('actions.reserve', { name: bordell.name })
  const favoriteLabel = isFavorite
    ? t('actions.removeFavorite', { name: bordell.name })
    : t('actions.addFavorite', { name: bordell.name })

  return (
    <>
      <div className="group relative" style={{ animationDelay: `${index * 70}ms` }}>
        {bordell.sponsored && (
          <div className="absolute -top-2 left-4 z-10">
            <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 text-xs rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> {t('top')}
            </Badge>
          </div>
        )}
        <div
          data-testid={`listing-card-${bordell.id}`}
          className="relative bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-[#8b1a4a]/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#8b1a4a]/10"
        >
          <button
            type="button"
            onClick={() => onDetailClickAction(bordell)}
            aria-label={detailLabel}
            data-testid="listing-card-detail-surface"
            className="absolute inset-0 z-0 rounded-xl sm:rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b76e79] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          />
          <div className="relative z-10 pointer-events-none">
          <div className="relative h-44 sm:h-52 md:h-56 bg-linear-to-br from-[#1a1a24] to-[#252533] overflow-hidden">
            {primaryImage && <Image src={primaryImage} alt={bordell.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/20" /><div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
              <Badge className="bg-[#8b1a4a]/80 text-white border-0 text-xs">{typeLabels[bordell.type]}</Badge>
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
              {bordell.premium && <Badge className="bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0 text-xs"><Crown className="w-3 h-3 mr-1" />{t('premium')}</Badge>}
              {bordell.verified && <Badge className="bg-green-500/80 text-white border-0 text-xs"><Check className="w-3 h-3 mr-1" />{t('verified')}</Badge>}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setIsFavorite((value) => !value)
              }}
              aria-label={favoriteLabel}
              aria-pressed={isFavorite}
              data-testid="listing-card-favorite-button"
              className="pointer-events-auto absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-[#8b1a4a]/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b76e79] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Heart className={cn('w-4 h-4 sm:w-5 sm:h-5', isFavorite ? 'fill-red-500 text-red-500' : 'text-white')} />
            </button>
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className={cn('flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium', bordell.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400')}>
                <div className={cn('w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full', bordell.isOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400')} />
                {bordell.isOpen ? t('open') : t('closed')}
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 md:p-5"><div className="flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-0.5 sm:mb-1 group-hover:text-[#b76e79] transition-colors truncate">{bordell.name}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm"><MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#b76e79] flex-shrink-0" /><span className="truncate">{bordell.location}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0"><div className="flex items-center gap-1 text-[#b76e79]">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              <span className="font-bold text-sm sm:text-base">{bordell.rating}</span>
            </div>
              <div className="text-gray-500 text-xs hidden sm:block">{bordell.reviewCount} {t('reviews')}</div>
            </div>
          </div>
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#b76e79]" /><span>{bordell.ladiesCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 truncate">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#b76e79] flex-shrink-0" /><span className="truncate">{bordell.openHours}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">{bordell.services.slice(0, 2).map((service) => <Badge key={service} variant="outline" className="border-white/10 text-gray-400 text-xs">{service}</Badge>)}</div><div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
              <div><span className="text-gray-500 text-xs">{t('price')}</span>
                <div className="text-[#b76e79] font-bold text-sm sm:text-base">{priceLabel}
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDetailClickAction(bordell)
                  }}
                  aria-label={detailLabel}
                  data-testid="listing-card-detail-button"
                  className="pointer-events-auto border-white/10 text-gray-300 hover:bg-white/5 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    setShowReservation(true)
                  }}
                  aria-label={reserveLabel}
                  data-testid="listing-card-reserve-button"
                  className="pointer-events-auto bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {t('reserve')}
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      {showReservation && <ReservationModal open={showReservation} onOpenChange={setShowReservation} bordell={bordell} />}
    </>
  )
}
