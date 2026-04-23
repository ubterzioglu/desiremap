'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, MapPin, Search, Shield, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePublicCities } from '@/hooks/useQueries'
import type { Translations } from '@/types'
import { getSearchPath } from '@/lib/navigation'

const starPositions = [{ left: 12, top: 15 }, { left: 25, top: 8 }, { left: 38, top: 22 }, { left: 52, top: 5 }, { left: 67, top: 18 }, { left: 80, top: 12 }, { left: 92, top: 25 }, { left: 8, top: 42 }, { left: 22, top: 55 }, { left: 35, top: 38 }, { left: 48, top: 62 }, { left: 62, top: 45 }, { left: 75, top: 58 }, { left: 88, top: 35 }, { left: 5, top: 72 }, { left: 18, top: 85 }, { left: 32, top: 68 }, { left: 45, top: 92 }, { left: 58, top: 75 }, { left: 72, top: 88 }]

type HeroProps = { 
  translations: Translations['hero']
  stats: Translations['stats']
  locale: string
}

export function HeroSection({ translations, stats, locale }: HeroProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const { data: cities = [] } = usePublicCities()
  const statItems = [{ icon: <Building2 />, value: '847+', label: stats.establishments }, { icon: <Users />, value: '12.000+', label: stats.ladies }, { icon: <Star />, value: '4.6', label: stats.rating }, { icon: <Shield />, value: '100%', label: stats.verified }]

  const handleSearch = () => {
    const path = getSearchPath(locale, { q: searchQuery, city: location })
    router.push(path)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0"><Image src="/hero-bg.jpg" alt="Verifizierte Clubs und Locations in Deutschland – DesireMap Plattform Übersicht" fill priority className="absolute inset-0 w-full h-full object-cover md:object-contain md:object-top" /><div className="absolute inset-0 bg-black/40" /><div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" /><div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/60" /></div>
      <div className="absolute inset-0 overflow-hidden">{starPositions.map((pos, index) => <motion.div key={index} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${pos.left}%`, top: `${pos.top}%` }} animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }} transition={{ duration: 2 + (index % 4), repeat: Infinity, delay: (index % 5) * 0.4 }} />)}</div>
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-4 sm:space-y-8">
        <motion.h1 initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-wider">{translations.title}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide line-clamp-3 md:line-clamp-none">{translations.subtitle}</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-gray-400 max-w-2xl mx-auto text-sm md:text-base ${expanded ? '' : 'line-clamp-3 md:line-clamp-none'}`}>{translations.description}</motion.p>
        <button onClick={() => setExpanded(!expanded)} className="text-[#b76e79] text-sm hover:underline md:hidden">{expanded ? 'Weniger anzeigen ▲' : 'Mehr anzeigen ▼'}</button>
        <div className="max-w-2xl mx-auto pt-4">
          <div className="flex flex-col gap-3 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger size="lg" className="w-full bg-transparent border-0 pl-12 text-white">
                  <SelectValue placeholder={translations.selectCity} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#8b1a4a]/20">
                  {cities.map((city) => (
                    <SelectItem key={city.slug} value={city.name} className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-[2]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={translations.searchPlaceholder} 
                className="bg-transparent border-0 pl-12 text-white h-12" 
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 shrink-0 px-8 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0 rounded-xl hover:from-[#a8255c] hover:to-[#7d4fb5] sm:h-auto sm:min-h-12"
            >
              <Search className="w-5 h-5 mr-2" />
              {translations.search}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 pt-6 sm:pt-8">{statItems.map((stat) => <div key={stat.label} className="flex items-center gap-2 sm:gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-[#b76e79]">{stat.icon}</div><div className="text-left"><div className="text-white font-semibold text-sm sm:text-base md:text-lg">{stat.value}</div><div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div></div></div>)}</div>
      </div>
    </section>
  )
}
