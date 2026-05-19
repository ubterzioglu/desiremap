'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Building2, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePublicCities, usePublicHero } from '@/hooks/useQueries'
import type { PublicCity, Translations } from '@/types'
import { getSearchPath } from '@/lib/navigation'
import { categories } from '@/data/mock-data'
import { cn } from '@/lib/utils'

const defaultHeroSlides: HeroSlide[] = [
  { src: '/hero-bg.jpg', fit: 'stretch' },
  { src: '/hero-bg_old.jpg', fit: 'cover' },
  { src: '/hero-bg_old_old.jpg', fit: 'cover' }
]

const defaultHeroSlideSources: HeroSlideSource[] = defaultHeroSlides.map(({ src }) => ({ src }))

const HERO_STRETCH_THRESHOLD = 1.55
const HERO_MAX_SLIDES = 3

type HeroProps = {
  translations: Translations['hero']
  stats: Translations['stats']
  locale: string
}

type HeroSlideSource = {
  src: string
}

type HeroSlide = {
  src: string
  fit: 'stretch' | 'cover'
}

type HeroStatItem = {
  label: string
  value: string
  valueClassName: string
}

type HeroBackgroundProps = {
  activeSlide: number
  prefersReducedMotion: boolean
  slides: HeroSlide[]
}

type HeroSearchPanelProps = {
  category: string
  categoryOptions: { id: string; label: string }[]
  cities: PublicCity[]
  location: string
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
  translations: Pick<Translations['hero'], 'search' | 'selectCategory' | 'selectCity'>
}

type HeroStatsProps = {
  items: HeroStatItem[]
}

function resolveHeroSlide(source: HeroSlideSource): Promise<HeroSlide | null> {
  return new Promise((resolve) => {
    const image = new window.Image()

    image.onload = () => {
      const fit = image.naturalWidth / image.naturalHeight >= HERO_STRETCH_THRESHOLD ? 'cover' : 'stretch'
      resolve({ src: source.src, fit })
    }

    image.onerror = () => {
      resolve(null)
    }

    image.src = source.src
  })
}

function HeroBackground({ activeSlide, prefersReducedMotion, slides }: HeroBackgroundProps): ReactElement {
  return (
    <div className="absolute inset-0">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity ease-out',
            prefersReducedMotion ? 'duration-0' : 'duration-[1400ms]',
            index === activeSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div
            className="absolute inset-0 bg-center"
            style={{
              backgroundImage: `url("${slide.src}")`,
              backgroundSize: slide.fit === 'stretch' ? '100% 100%' : 'cover',
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-[#091121]/34" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_26%,rgba(255,177,198,0.18),transparent_30%),linear-gradient(90deg,rgba(7,12,25,0.78)_0%,rgba(8,15,30,0.34)_46%,rgba(7,12,25,0.56)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,29,0.16)_0%,rgba(8,13,29,0.5)_100%)]" />
    </div>
  )
}

function HeroSearchPanel({
  category,
  categoryOptions,
  cities,
  location,
  onCategoryChange,
  onLocationChange,
  onSearch,
  translations,
}: HeroSearchPanelProps): ReactElement {
  return (
    <div className="max-w-[720px] rounded-[18px] border border-[#2f3c58] bg-[#10192e]/78 p-1.5 shadow-[0_24px_80px_rgba(8,13,29,0.42)] backdrop-blur-xl">
      <div className="grid gap-1.5 md:grid-cols-[1.02fr_1.08fr_auto]">
        <div className="relative overflow-hidden rounded-[14px] border border-[#26334f] bg-[#111b31]/86">
          <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-[#f0b0c0]" />
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger aria-label={translations.selectCity} size="lg" className="h-[56px] w-full border-0 bg-transparent pr-4 pl-11 text-left text-[15px] text-[#d8deef] shadow-none">
              <SelectValue placeholder={translations.selectCity} />
            </SelectTrigger>
            <SelectContent className="border-[#2b3653] bg-[#0f172a] text-[#d8deef]">
              {cities.map((city) => (
                <SelectItem key={city.slug} value={city.name} className="text-[#d8deef] focus:bg-[#17233f] focus:text-white">
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative overflow-hidden rounded-[14px] border border-[#26334f] bg-[#111b31]/86">
          <Building2 className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-[#d7dcee]" />
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger aria-label={translations.selectCategory} size="lg" className="h-[56px] w-full border-0 bg-transparent pr-4 pl-11 text-left text-[15px] text-[#d8deef] shadow-none">
              <SelectValue placeholder={translations.selectCategory} />
            </SelectTrigger>
            <SelectContent className="border-[#2b3653] bg-[#0f172a] text-[#d8deef]">
              <SelectItem value="all" className="text-[#d8deef] focus:bg-[#17233f] focus:text-white">
                {translations.selectCategory}
              </SelectItem>
              {categoryOptions.map((item) => (
                <SelectItem key={item.id} value={item.id} className="text-[#d8deef] focus:bg-[#17233f] focus:text-white">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onSearch}
          className="h-[56px] min-w-[148px] rounded-[14px] border border-[#b33b6a] bg-[#8b1a4a] px-7 text-[14px] font-bold tracking-[0.06em] text-white uppercase shadow-[0_16px_30px_rgba(139,26,74,0.34)] hover:bg-[#a11f57]"
        >
          <Search className="mr-2 h-4 w-4" />
          {translations.search}
        </Button>
      </div>
    </div>
  )
}

function HeroStats({ items }: HeroStatsProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-8 pt-3 sm:gap-12">
      {items.map((item) => (
        <div key={item.label} className="min-w-[92px] space-y-1">
          <div className={cn('text-[32px] font-bold leading-none tracking-[-0.04em]', item.valueClassName)}>{item.value}</div>
          <div className="text-[12px] font-bold tracking-[0.08em] text-[#f1f4ff] uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export function HeroSection({ translations, stats, locale }: HeroProps): ReactElement {
  const router = useRouter()
  const categoryTranslations = useTranslations('categories')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('all')
  const [activeSlide, setActiveSlide] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides)
  const { data: cities = [] } = usePublicCities()
  const { data: heroSlidesFromApi = [] } = usePublicHero()
  const heroSlideCandidates = useMemo(() => {
    const activeHeroSlides = heroSlidesFromApi.filter((slide) => slide.isActive !== false)

    if (activeHeroSlides.length === 0) {
      return defaultHeroSlideSources
    }

    return activeHeroSlides
      .map((slide) => ({ src: slide.imageUrl }))
      .slice(0, HERO_MAX_SLIDES)
  }, [heroSlidesFromApi])
  const categoryLabels: Record<string, string> = {
    fkk: categoryTranslations('fkk'),
    laufhaus: categoryTranslations('laufhaus'),
    bordell: categoryTranslations('bordell'),
    studio: categoryTranslations('studio'),
    privat: categoryTranslations('privat')
  }
  const categoryOptions = categories.map((item) => ({ id: item.id, label: categoryLabels[item.id] ?? item.name }))
  const displayedSlide = activeSlide % heroSlides.length
  const statItems: HeroStatItem[] = [
    { value: '847+', label: stats.establishments, valueClassName: 'text-[#ffb1c6]' },
    { value: '12.000+', label: stats.ladies, valueClassName: 'text-[#ffbfd0]' },
    { value: '4.6', label: stats.rating, valueClassName: 'text-[#e9c349]' },
    { value: '100%', label: stats.verified, valueClassName: 'text-[#38bdf8]' }
  ]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreferences = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    syncMotionPreferences()
    mediaQuery.addEventListener('change', syncMotionPreferences)
    return () => mediaQuery.removeEventListener('change', syncMotionPreferences)
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function validateSlides(): Promise<void> {
      const resolvedSlides = await Promise.all(heroSlideCandidates.map(resolveHeroSlide))
      if (isCancelled) return

      const nextSlides = resolvedSlides
        .filter((slide): slide is HeroSlide => slide !== null)
        .slice(0, HERO_MAX_SLIDES)

      setHeroSlides(nextSlides.length > 0 ? nextSlides : defaultHeroSlides)
    }

    void validateSlides()
    return () => {
      isCancelled = true
    }
  }, [heroSlideCandidates])

  useEffect(() => {
    if (prefersReducedMotion || heroSlides.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [heroSlides.length, prefersReducedMotion])

  const handleSearch = () => {
    const path = getSearchPath(locale, {
      ...(location ? { city: location } : {}),
      ...(category !== 'all' ? { category } : {})
    })

    router.push(path)
  }

  return (
    <section className="relative isolate flex min-h-screen overflow-hidden bg-[#0b1326] pt-28 pb-16 text-[#dae2fd] sm:pt-32">
      <HeroBackground activeSlide={displayedSlide} prefersReducedMotion={prefersReducedMotion} slides={heroSlides} />

      <div className="relative z-10 flex w-full items-center px-5 sm:px-6 lg:px-8">
        <div className="max-w-[760px] space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#d69aa9]/40 bg-[#8b1a4a]/18 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-[#ffd6de] uppercase shadow-[0_10px_32px_rgba(11,19,38,0.26)]">
            {translations.eyebrow}
          </div>

          <div className="space-y-5">
            <h1 className="max-w-[720px] text-[clamp(3.25rem,6vw,5.2rem)] leading-[0.95] font-bold tracking-[-0.045em] text-[#eef2ff]">
              <span className="block">
                {translations.titleLine1Start}
                <span className="text-[#ffb1c6] italic">{translations.titleLine1Accent}</span>
                {translations.titleLine1End}
              </span>
              <span className="block">
                {translations.titleLine2Start}
                <span className="text-[#e9c349]">{translations.titleLine2Accent}</span>
              </span>
            </h1>

            <p className="max-w-[640px] text-[18px] leading-8 text-[#d7dcee] sm:text-[20px]">
              {translations.description}
            </p>
          </div>

          <HeroSearchPanel
            category={category}
            categoryOptions={categoryOptions}
            cities={cities}
            location={location}
            onCategoryChange={setCategory}
            onLocationChange={setLocation}
            onSearch={handleSearch}
            translations={translations}
          />

          <HeroStats items={statItems} />
        </div>
      </div>
    </section>
  )
}
