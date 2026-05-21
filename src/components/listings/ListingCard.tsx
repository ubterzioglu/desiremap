'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Calendar, Check, Clock, Crown, Eye, Heart, MapPin, Star, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReservationModal } from '@/components/listings/ReservationModal'
import type { Bordell } from '@/types'

type ListingCardProps = { bordell: Bordell; detailHref: string; index: number; onDetailClickAction: (bordell: Bordell) => void }

type ListingCardLabels = {
  detailLabel: string
  favoriteLabel: string
  reserveLabel: string
}

type ListingCardMediaProps = {
  bordell: Bordell
  favoriteLabel: string
  isFavorite: boolean
  onToggleFavorite: () => void
  premiumLabel: string
  typeLabel: string
  verifiedLabel: string
  openLabel: string
  closedLabel: string
}

type ListingCardContentProps = {
  bordell: Bordell
  detailHref: string
  detailLabel: string
  onDetailClickAction: (bordell: Bordell) => void
  onReserve: () => void
  priceCaption: string
  priceLabel: string
  reserveButtonText: string
  reserveLabel: string
  reviewsLabel: string
}

function getPriceLabel(bordell: Bordell, fallback: string) {
  if (bordell.minPrice <= 0) return bordell.priceRange || fallback

  return `€${bordell.minPrice}${bordell.maxPrice ? ` - €${bordell.maxPrice}` : ''}`
}

function getListingCardLabels(bordell: Bordell, isFavorite: boolean, t: ReturnType<typeof useTranslations>): ListingCardLabels {
  return {
    detailLabel: t('actions.details', { name: bordell.name }),
    reserveLabel: t('actions.reserve', { name: bordell.name }),
    favoriteLabel: isFavorite
      ? t('actions.removeFavorite', { name: bordell.name })
      : t('actions.addFavorite', { name: bordell.name }),
  }
}

function ListingCardMedia({
  bordell,
  favoriteLabel,
  isFavorite,
  onToggleFavorite,
  premiumLabel,
  typeLabel,
  verifiedLabel,
  openLabel,
  closedLabel,
}: ListingCardMediaProps) {
  const primaryImage = bordell.coverImage

  return (
    <div className="relative h-56 overflow-hidden bg-[#0f172a]">
      {primaryImage ? (
        <Image
          src={primaryImage}
          alt={bordell.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.16)_0%,rgba(15,23,42,0.84)_100%)]" />

      <div className="absolute top-4 left-4 flex gap-2">
        <Badge className="border border-white/12 bg-black/25 text-xs text-white backdrop-blur-sm">{typeLabel}</Badge>
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {bordell.premium ? (
          <Badge className="border-0 bg-[#8b1a4a] text-xs text-white shadow-[0_10px_24px_rgba(139,26,74,0.28)]">
            <Crown className="mr-1 h-3 w-3" />
            {premiumLabel}
          </Badge>
        ) : null}
        {bordell.verified ? (
          <Badge className="border border-[#D4AF37]/55 bg-[#3c2f00]/55 text-xs text-[#ffe088] backdrop-blur-sm">
            <Check className="mr-1 h-3 w-3" />
            {verifiedLabel}
          </Badge>
        ) : null}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggleFavorite()
        }}
        aria-label={favoriteLabel}
        aria-pressed={isFavorite}
        data-testid="listing-card-favorite-button"
        className="pointer-events-auto absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/30 backdrop-blur-sm transition-all hover:bg-[#8b1a4a]/50 focus-visible:ring-2 focus-visible:ring-[#ffb1c6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1326] focus-visible:outline-none"
      >
        <Heart className={cn('h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-white')} />
      </button>

      <div className="absolute bottom-4 left-4">
        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm', bordell.isOpen ? 'border border-sky-400/35 bg-sky-500/15 text-sky-200' : 'border border-white/10 bg-black/20 text-slate-300')}>
          <div className={cn('h-2 w-2 rounded-full', bordell.isOpen ? 'bg-sky-300 animate-pulse' : 'bg-slate-400')} />
          {bordell.isOpen ? openLabel : closedLabel}
        </div>
      </div>

    </div>
  )
}

function ListingCardContent({
  bordell,
  detailHref,
  detailLabel,
  onDetailClickAction,
  onReserve,
  priceCaption,
  priceLabel,
  reserveButtonText,
  reserveLabel,
  reviewsLabel,
}: ListingCardContentProps) {
  return (
    <div className="p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={detailHref}
            aria-label={detailLabel}
            onClick={() => onDetailClickAction(bordell)}
            className="block truncate text-xl font-semibold tracking-[-0.02em] text-[#dae2fd] transition-colors duration-300 group-hover:text-white hover:text-white"
          >
            {bordell.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-[#dcbfc5]">
            <MapPin className="h-4 w-4 flex-shrink-0 text-[#ffb1c6]" />
            <span className="truncate">{bordell.location}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center gap-1 text-[#e9c349]">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-base font-bold">{bordell.rating}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">{bordell.reviewCount} {reviewsLabel}</div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#ffb1c6]" />
          <span>{bordell.ladiesCount}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 truncate">
          <Clock className="h-4 w-4 flex-shrink-0 text-[#ffb1c6]" />
          <span className="truncate">{bordell.openHours}</span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {bordell.services.slice(0, 2).map((service) => (
          <Badge key={service} variant="outline" className="border-[#334155] bg-[#0f172a] text-xs text-[#dcbfc5]">
            {service}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#334155]/45 pt-4">
        <div>
          <span className="text-xs tracking-[0.18em] text-slate-500 uppercase">{priceCaption}</span>
          <div className="mt-1 text-base font-bold text-[#e9c349]">{priceLabel}</div>
        </div>
        <div className="flex gap-2">
          <Link
            href={detailHref}
            aria-label={detailLabel}
            onClick={() => onDetailClickAction(bordell)}
            data-testid="listing-card-detail-link"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#334155] bg-transparent p-0 text-[#dcbfc5] transition-colors hover:bg-[#0f172a] hover:text-white"
          ><Eye className="h-4 w-4" /></Link>
          <Button
            type="button"
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              onReserve()
            }}
            aria-label={reserveLabel}
            data-testid="listing-card-reserve-button"
            className="pointer-events-auto h-9 border-0 bg-[#8b1a4a] text-white shadow-[0_12px_24px_rgba(139,26,74,0.24)] hover:bg-[#a11f57]"
          >
            <Calendar className="mr-1 h-4 w-4" />
            {reserveButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ListingCard({ bordell, detailHref, index, onDetailClickAction }: ListingCardProps) {
  const t = useTranslations('listing')
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const labels = getListingCardLabels(bordell, isFavorite, t)
  const priceLabel = getPriceLabel(bordell, t('priceOnRequest'))
  const typeLabels = {
    laufhaus: t('types.laufhaus'),
    bordell: t('types.bordell'),
    fkk: t('types.fkk'),
    studio: t('types.studio'),
    privat: t('types.privat'),
  }

  return (
    <>
      <div className="group relative" style={{ animationDelay: `${index * 70}ms` }}>
        {bordell.sponsored ? (
          <div className="absolute -top-2 left-5 z-10">
            <Badge className="rounded-full border-0 bg-linear-to-r from-amber-500 to-orange-500 text-xs text-white">
              <TrendingUp className="mr-1 h-3 w-3" />
              {t('top')}
            </Badge>
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[1.6rem] border border-[#334155]/60 bg-[#171f33]/80 shadow-[0_24px_60px_rgba(6,14,32,0.24)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#8b1a4a]/45 group-hover:shadow-[0_28px_70px_rgba(139,26,74,0.16)]">
          <div className="relative z-10">
            <ListingCardMedia
              bordell={bordell}
              favoriteLabel={labels.favoriteLabel}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite((value) => !value)}
              typeLabel={typeLabels[bordell.type]}
              premiumLabel={t('premium')}
              verifiedLabel={t('verified')}
              openLabel={t('open')}
              closedLabel={t('closed')}
            />
            <ListingCardContent
              bordell={bordell}
              detailHref={detailHref}
              detailLabel={labels.detailLabel}
              onDetailClickAction={onDetailClickAction}
              onReserve={() => setShowReservation(true)}
              priceCaption={t('price')}
              priceLabel={priceLabel}
              reserveButtonText={t('reserve')}
              reserveLabel={labels.reserveLabel}
              reviewsLabel={t('reviews')}
            />
          </div>
        </div>
      </div>
      {showReservation ? <ReservationModal open={showReservation} onOpenChange={setShowReservation} bordell={bordell} /> : null}
    </>
  )
}
