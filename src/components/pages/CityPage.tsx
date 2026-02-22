'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { categories, germanCities } from '@/data/mock-data'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Bordell } from '@/types'

type CityPageProps = { city: string; bordells: Bordell[]; onBack: () => void; onBordellClick: (bordell: Bordell) => void }

export function CityPage({ city, bordells, onBack, onBordellClick }: CityPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const cityBordells = bordells.filter((item) => item.city === city)
  const cityData = germanCities.find((item) => item.name === city)
  const filtered = useMemo(() => cityBordells.filter((item) => (!selectedCategory || item.type === selectedCategory) && (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()) || item.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase())))), [cityBordells, searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative py-20 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-[#8b1a4a]/20 to-transparent" /><div className="relative z-10 max-w-7xl mx-auto px-6"><button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"><ArrowLeft className="w-5 h-5" />Zurueck zur Startseite</button><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center"><MapPin className="w-8 h-8 text-white" /></div><div><h1 className="text-5xl font-bold text-white">{city}</h1><p className="text-gray-400">{cityData?.count || cityBordells.length} Betriebe</p></div></div><div className="max-w-2xl"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" /><Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`In ${city} suchen...`} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 h-14 text-white placeholder:text-gray-500" /></div></div></div></section>
      <section className="py-12"><div className="max-w-7xl mx-auto px-6"><div className="flex flex-wrap gap-3 mb-8"><Button onClick={() => setSelectedCategory(null)} size="sm" variant={selectedCategory === null ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === null ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}>Alle</Button>{categories.map((cat) => <Button key={cat.id} onClick={() => setSelectedCategory(cat.id)} size="sm" variant={selectedCategory === cat.id ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === cat.id ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5')}>{cat.name}</Button>)}</div><p className="text-gray-400 mb-6">{filtered.length} Betriebe gefunden</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((item, index) => <ListingCard key={item.id} bordell={item} index={index} onDetailClick={onBordellClick} />)}</div>{filtered.length === 0 && <div className="text-center py-20"><p className="text-gray-400">Keine Betriebe gefunden.</p></div>}</div></section>
    </div>
  )
}
