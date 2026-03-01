'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { categories } from '@/data/mock-data'
import type { Translations } from '@/types'

type CategoriesProps = { translations: Translations['categories']; locale: string }

export function CategoriesSection({ translations, locale }: CategoriesProps) {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src="categories-bg.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/5 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="inline-block text-[#b76e79] text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
            {translations.title}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {translations.title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            {translations.subtitle}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.id}
              href={`/${locale}/search?category=${category.id}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-linear-to-b from-white/10 to-white/5 border border-white/10 hover:border-[#8b1a4a]/50 backdrop-blur-sm transition-all duration-500 overflow-hidden">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#8b1a4a]/30 to-[#6b3fa0]/30 flex items-center justify-center">
                  <span className="relative text-[#b76e79] group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </span>
                </div>
                <h3 className="relative text-white font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 group-hover:text-[#b76e79] transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="relative text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {category.count} Betriebe
                </p>
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#b76e79]" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
