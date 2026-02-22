'use client'

import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { categories } from '@/data/mock-data'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Bordell } from '@/types'

type ListingsSectionProps = { bordells: Bordell[]; onBordellClick: (bordell: Bordell) => void }

export function ListingsSection({ bordells, onBordellClick }: ListingsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const sortedBordells = useMemo(() => {
    const filtered = selectedCategory ? bordells.filter((item) => item.type === selectedCategory) : bordells
    return [...filtered].sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || Number(b.premium) - Number(a.premium))
  }, [bordells, selectedCategory])

  return (
    <section className="relative py-24 bg-linear-to-b from-[#0f0f14] to-[#0a0a0f] overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b1a4a]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6b3fa0]/5 rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12"><span className="inline-block text-[#b76e79] text-sm font-medium tracking-widest uppercase mb-3">Empfehlungen</span><h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Ausgewaehlte Betriebe</h2><p className="text-gray-400 text-lg">{sortedBordells.length} verifizierte Betriebe</p></div>
        <div className="flex flex-wrap justify-center gap-3 mb-12"><Button onClick={() => setSelectedCategory(null)} size="sm" variant={selectedCategory === null ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === null ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white')}>Alle</Button>{categories.map((cat) => <Button key={cat.id} onClick={() => setSelectedCategory(cat.id)} size="sm" variant={selectedCategory === cat.id ? 'default' : 'outline'} className={cn('rounded-full px-5', selectedCategory === cat.id ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0' : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white')}>{cat.name}</Button>)}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{sortedBordells.map((bordell, index) => <ListingCard key={bordell.id} bordell={bordell} index={index} onDetailClick={onBordellClick} />)}</div>
        <div className="flex justify-center mt-16"><Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 px-10 rounded-full group">Mehr anzeigen<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Button></div>
      </div>
    </section>
  )
}
