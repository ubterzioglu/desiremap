'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { categories, germanCities } from '@/data/mock-data'
import { ListingCard } from '@/components/listings/ListingCard'
import { useLocale } from 'next-intl'
import { getVenuePath } from '@/lib/navigation'
import type { Bordell } from '@/types'

type CityPageProps = { city: string; bordells: Bordell[]; onBackAction: () => void; onBordellClickAction: (bordell: Bordell) => void }

export function CityPage({ city, bordells, onBackAction, onBordellClickAction }: CityPageProps) {
  const locale = useLocale()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const cityBordells = bordells.filter((item) => item.city === city)
  const cityData = germanCities.find((item) => item.name === city)
  const filtered = useMemo(() => cityBordells.filter((item) => (!selectedCategory || item.type === selectedCategory) && (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()) || item.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase())))), [cityBordells, searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20"><div className="absolute inset-0 bg-linear-to-b from-[#8b1a4a]/20 to-transparent" /><div className="relative z-10 mx-auto max-w-7xl px-6"><button onClick={onBackAction} className="mb-8 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"><ArrowLeft className="h-5 w-5" />Zurueck zur Startseite</button><div className="mb-6 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0]"><MapPin className="h-8 w-8 text-white" /></div><div><h1 className="text-5xl font-bold text-white">{city}</h1><p className="text-gray-400">{cityData?.count || cityBordells.length} Betriebe</p></div></div><div className="max-w-2xl"><div className="relative"><Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#b76e79]" /><Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`In ${city} suchen...`} className="h-14 rounded-2xl border border-white/10 bg-white/5 pl-12 text-white backdrop-blur-xl placeholder:text-gray-500" /></div></div></div></section>
      <section className="py-12"><div className="mx-auto max-w-7xl px-6"><div className="mb-8 flex flex-wrap gap-3"><Button onClick={() => setSelectedCategory(null)} size="sm" variant={selectedCategory === null ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === null ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}>Alle</Button>{categories.map((cat) => <Button key={cat.id} onClick={() => setSelectedCategory(cat.id)} size="sm" variant={selectedCategory === cat.id ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === cat.id ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}>{cat.name}</Button>)}</div><p className="mb-6 text-gray-400">{filtered.length} Betriebe gefunden</p><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item, index) => <ListingCard key={item.id} bordell={item} detailHref={getVenuePath(locale, item.id)} index={index} onDetailClickAction={onBordellClickAction} />)}</div>{filtered.length === 0 && <div className="py-20 text-center"><p className="text-gray-400">Keine Betriebe gefunden.</p></div>}</div></section>
    </div>
  )
}
