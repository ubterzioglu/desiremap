'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Calendar, Check, Clock, Globe, Heart, MapPin, MessageCircle, Phone, Share2, Shield, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { bordells } from '@/data/mock-data'
import { ReservationModal } from '@/components/listings/ReservationModal'
import type { Bordell } from '@/types'

const typeLabels: Record<string, string> = { laufhaus: 'Laufhaus', bordell: 'Bordell', fkk: 'FKK Club', studio: 'Studio', privat: 'Privat' }

function DetailHero({ bordell, onBack, isFavorite, onFavoriteToggle, onReservationOpen }: { bordell: Bordell; onBack: () => void; isFavorite: boolean; onFavoriteToggle: () => void; onReservationOpen: () => void }) {
  return <section className="relative min-h-[60vh] overflow-hidden"><div className="absolute inset-0"><Image src={bordell.coverImage || '/hero-bg.jpg'} alt={`${bordell.name} in ${bordell.city}`} fill className="w-full h-full object-cover blur-xl scale-110 opacity-60" /><div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" /><div className="absolute inset-0 bg-linear-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20" /></div><div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16"><button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors mb-8"><ArrowLeft className="w-4 h-4" />Zurueck</button><div className="grid lg:grid-cols-2 gap-12 items-end"><div><div className="flex flex-wrap gap-2 mb-4"><Badge className="bg-[#8b1a4a]/80 text-white border-0">{typeLabels[bordell.type]}</Badge>{bordell.premium && <Badge className="bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0">Premium</Badge>}{bordell.verified && <Badge className="bg-green-500/80 text-white border-0"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}</div><h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">{bordell.name}</h1><div className="flex items-center gap-2 text-gray-300 text-lg mb-6"><MapPin className="w-5 h-5 text-[#b76e79]" /><span>{bordell.location}</span></div></div><div className="flex gap-4"><Button onClick={onReservationOpen} className="h-14 px-8 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-lg"><Calendar className="w-5 h-5 mr-2" />Reservieren</Button><Button onClick={onFavoriteToggle} variant="outline" className={cn('h-14 w-14 rounded-xl border-white/10', isFavorite && 'border-red-500/50 bg-red-500/10')}><Heart className={cn('w-6 h-6', isFavorite && 'fill-red-500 text-red-500')} /></Button></div></div></div></section>
}

function DetailContent({ bordell, similarPlaces }: { bordell: Bordell; similarPlaces: Bordell[] }) {
  return <section className="py-16 bg-black"><div className="max-w-6xl mx-auto px-6"><div className="grid lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8"><div className="bg-white/5 rounded-2xl p-6 border border-white/5"><h2 className="text-xl font-semibold text-white mb-4">Beschreibung</h2><p className="text-gray-400 leading-relaxed">{bordell.description}</p></div><div className="bg-white/5 rounded-2xl p-6 border border-white/5"><h2 className="text-xl font-semibold text-white mb-4">Services und Ausstattung</h2><div className="flex flex-wrap gap-3">{bordell.services.map((service) => <Badge key={service} variant="outline" className="border-[#8b1a4a]/30 text-[#b76e79] px-4 py-2 text-sm">{service}</Badge>)}</div></div>{similarPlaces.length > 0 && <div className="bg-white/5 rounded-2xl p-6 border border-white/5"><h2 className="text-xl font-semibold text-white mb-4">Aehnliche Betriebe in {bordell.city}</h2><div className="grid sm:grid-cols-3 gap-4">{similarPlaces.map((place) => <div key={place.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"><p className="text-white font-medium mb-1">{place.name}</p><div className="flex items-center gap-1 text-sm text-gray-400"><Star className="w-3 h-3 text-[#b76e79] fill-current" /><span>{place.rating}</span></div></div>)}</div></div>}</div><div className="space-y-6"><div className="bg-linear-to-b from-[#8b1a4a]/10 to-transparent rounded-2xl p-6 border border-[#8b1a4a]/20"><h2 className="text-xl font-semibold text-white mb-6">Kontakt</h2><div className="space-y-4"><a href={`tel:${bordell.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"><Phone className="w-5 h-5 text-[#b76e79]" /><div><p className="text-gray-400 text-sm">Telefon</p><p className="text-white font-medium">{bordell.phone}</p></div></a></div></div></div></div></div></section>
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
