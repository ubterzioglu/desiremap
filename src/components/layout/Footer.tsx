import Link from 'next/link'
import { Flame, Shield, MapPin } from 'lucide-react'
import { citiesData } from '@/data/cities'
import { getCityPath } from '@/lib/navigation'

type FooterProps = {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-[#564146] bg-[#0b1326]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b1a5c]">
                <Flame className="h-5 w-5 text-[#ffb1c6]" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#dae2fd]">DESIREMAP</span>
                <span className="text-xs text-[#a48a90]">.de</span>
              </div>
            </div>
            <p className="text-sm text-[#a48a90]">Deutschlands fuehrendes Erotik-Verzeichnis</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#dae2fd] uppercase" style={{ letterSpacing: '0.05em' }}>Kategorien</h4>
            <ul className="space-y-2">
              {['FKK Clubs', 'Laufhaeuser', 'Bordelle', 'Studios'].map((link) => (
                <li key={link}>
                  <Link href={getCityPath(locale, 'berlin')} className="text-sm text-[#a48a90] transition-colors hover:text-[#ffb1c6]">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#dae2fd] uppercase" style={{ letterSpacing: '0.05em' }}>Staedte</h4>
            <ul className="space-y-2">
              {citiesData.slice(0, 4).map((city) => (
                <li key={city.slug}>
                  <Link href={getCityPath(locale, city.slug)} className="flex items-center gap-1 text-sm text-[#a48a90] transition-colors hover:text-[#ffb1c6]">
                    <MapPin className="h-3 w-3 text-[#D4AF37]" />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#dae2fd] uppercase" style={{ letterSpacing: '0.05em' }}>Rechtliches</h4>
            <ul className="space-y-2">
              {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((link) => (
                <li key={link}>
                  <Link href={`/${locale}`} className="text-sm text-[#a48a90] transition-colors hover:text-[#ffb1c6]">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#564146] pt-8 sm:flex-row">
          <p className="text-sm text-[#a48a90]">© 2024 DesireMap.de - 18+ only</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.spindorai.com/en"
              target="_blank"
              rel="dofollow"
              className="text-sm text-[#a48a90] transition-colors hover:text-[#ffb1c6]"
            >
              AI SEO Tool
            </a> AI Powered Seo Analysis Tool
            <div className="flex items-center gap-2 text-sm text-[#a48a90]">
              <Shield className="h-4 w-4 text-[#D4AF37]" />
              SSL-gesichert
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
