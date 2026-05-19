'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Calendar, Check, Heart, MapPin, Phone, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { bordells } from '@/data/mock-data'
import { ReservationModal } from '@/components/listings/ReservationModal'
import type { Bordell } from '@/types'

const typeLabels: Record<string, string> = { laufhaus: 'Laufhaus', bordell: 'Bordell', fkk: 'FKK Club', studio: 'Studio', privat: 'Privat' }

function DetailHero({ bordell, onBack, isFavorite, onFavoriteToggle, onReservationOpen }: { bordell: Bordell; onBack: () => void; isFavorite: boolean; onFavoriteToggle: () => void; onReservationOpen: () => void }) {
  return <section className="relative min-h-[60vh] overflow-hidden"><div className="absolute inset-0"><Image src={bordell.coverImage || '/hero-bg.jpg'} alt={`${bordell.name} in ${bordell.city}`} fill className="h-full w-full scale-110 object-cover opacity-60 blur-xl" /><div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" /><div className="absolute inset-0 bg-linear-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20" /></div><div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-16"><button onClick={onBack} className="mb-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"><ArrowLeft className="h-4 w-4" />Zurueck</button><div className="grid items-end gap-12 lg:grid-cols-2"><div><div className="mb-4 flex flex-wrap gap-2"><Badge className="border-0 bg-[#8b1a4a]/80 text-white">{typeLabels[bordell.type]}</Badge>{bordell.premium && <Badge className="border-0 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white">Premium</Badge>}{bordell.verified && <Badge className="border-0 bg-green-500/80 text-white"><Check className="mr-1 h-3 w-3" />Verifiziert</Badge>}</div><h1 className="mb-4 text-5xl font-bold text-white lg:text-6xl">{bordell.name}</h1><div className="mb-6 flex items-center gap-2 text-lg text-gray-300"><MapPin className="h-5 w-5 text-[#b76e79]" /><span>{bordell.location}</span></div></div><div className="flex gap-4"><Button onClick={onReservationOpen} className="h-14 rounded-xl border-0 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] px-8 text-lg text-white hover:from-[#a8255c] hover:to-[#7d4fb5]"><Calendar className="mr-2 h-5 w-5" />Reservieren</Button><Button onClick={onFavoriteToggle} variant="outline" className={cn('h-14 w-14 rounded-xl border-white/10', isFavorite && 'border-red-500/50 bg-red-500/10')}><Heart className={cn('w-6 h-6', isFavorite && 'fill-red-500 text-red-500')} /></Button></div></div></div></section>
}

function DetailContent({ bordell, similarPlaces }: { bordell: Bordell; similarPlaces: Bordell[] }) {
  return <section className="bg-black py-16"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-8 lg:grid-cols-3"><div className="space-y-8 lg:col-span-2"><div className="rounded-2xl border border-white/5 bg-white/5 p-6"><h2 className="mb-4 text-xl font-semibold text-white">Beschreibung</h2><p className="leading-relaxed text-gray-400">{bordell.description}</p></div><div className="rounded-2xl border border-white/5 bg-white/5 p-6"><h2 className="mb-4 text-xl font-semibold text-white">Services und Ausstattung</h2><div className="flex flex-wrap gap-3">{bordell.services.map((service) => <Badge key={service} variant="outline" className="border-[#8b1a4a]/30 px-4 py-2 text-sm text-[#b76e79]">{service}</Badge>)}</div></div>{similarPlaces.length > 0 && <div className="rounded-2xl border border-white/5 bg-white/5 p-6"><h2 className="mb-4 text-xl font-semibold text-white">Aehnliche Betriebe in {bordell.city}</h2><div className="grid gap-4 sm:grid-cols-3">{similarPlaces.map((place) => <div key={place.id} className="cursor-pointer rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"><p className="mb-1 font-medium text-white">{place.name}</p><div className="flex items-center gap-1 text-sm text-gray-400"><Star className="h-3 w-3 fill-current text-[#b76e79]" /><span>{place.rating}</span></div></div>)}</div></div>}</div><div className="space-y-6"><div className="rounded-2xl border border-[#8b1a4a]/20 bg-linear-to-b from-[#8b1a4a]/10 to-transparent p-6"><h2 className="mb-6 text-xl font-semibold text-white">Kontakt</h2><div className="space-y-4"><a href={`tel:${bordell.phone}`} className="flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"><Phone className="h-5 w-5 text-[#b76e79]" /><div><p className="text-sm text-gray-400">Telefon</p><p className="font-medium text-white">{bordell.phone}</p></div></a></div></div></div></div></div></section>
}

type DetailPageProps = { bordell: Bordell; onBack: () => void }

export function DetailPage({ bordell, onBack }: DetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const similarPlaces = bordells.filter((item) => item.city === bordell.city && item.id !== bordell.id).slice(0, 3)
  return (
    <div className="min-h-screen bg-black">
      <DetailHero bordell={bordell} onBack={onBack} isFavorite={isFavorite} onFavoriteToggle={() => setIsFavorite((v) => !v)} onReservationOpen={() => setShowReservation(true)} />
      <DetailContent bordell={bordell} similarPlaces={similarPlaces} />
      <ReservationModal open={showReservation} onOpenChange={setShowReservation} bordell={bordell} />
    </div>
  )
}
