import Link from 'next/link'
import { Flame, Shield, MapPin } from 'lucide-react'
import { citiesData } from '@/data/cities'
import { getCityPath } from '@/lib/navigation'

type FooterProps = {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">DESIREMAP</span>
                <span className="text-gray-500 text-xs">.de</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Deutschlands fuehrendes Erotik-Verzeichnis</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Kategorien</h4>
            <ul className="space-y-2">
              {['FKK Clubs', 'Laufhaeuser', 'Bordelle', 'Studios'].map((link) => (
                <li key={link}>
                  <Link href={getCityPath(locale, 'berlin')} className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Staedte</h4>
            <ul className="space-y-2">
              {citiesData.slice(0, 4).map((city) => (
                <li key={city.slug}>
                  <Link href={getCityPath(locale, city.slug)} className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((link) => (
                <li key={link}>
                  <Link href={`/${locale}`} className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2024 DesireMap.de - 18+ only</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.spindorai.com/en"
              target="_blank"
              rel="dofollow"
              className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm"
            >
              AI SEO Tool
            </a> AI Powered Seo Analysis Tool
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Shield className="w-4 h-4 text-[#b76e79]" />
              SSL-gesichert
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
