'use client'

import { motion } from 'framer-motion'
import { ChevronRight, MapPin } from 'lucide-react'
import { germanCities } from '@/data/mock-data'
import type { Translations } from '@/types'

type FeaturedCitiesProps = {
  onCityClick: (city: string) => void
  translations: Translations['cities']
}

export function FeaturedCities({ onCityClick, translations }: FeaturedCitiesProps) {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-[#0f0f14] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div><span className="inline-block text-[#b76e79] text-xs sm:text-sm font-medium tracking-widest uppercase mb-2 sm:mb-3">{translations.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{translations.title}</h2></div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {germanCities.map((city, index) => (
            <motion.button key={city.name} onClick={() => onCityClick(city.name)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }} className="group relative text-left min-h-[56px] sm:min-h-[60px]">
              <div className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-[#8b1a4a]/30 transition-all duration-300 overflow-hidden">
                <div className="relative flex items-center gap-3 sm:gap-4"><div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#b76e79]" /></div><div className="flex-1"><h3 className="text-white font-semibold text-base sm:text-lg group-hover:text-[#b76e79] transition-colors duration-300">{city.name}</h3><p className="text-gray-500 text-xs sm:text-sm">{city.count} Betriebe</p></div><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#b76e79] group-hover:translate-x-1 transition-all duration-300" /></div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
