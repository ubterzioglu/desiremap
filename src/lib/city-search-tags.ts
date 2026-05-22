import type { PublicCity } from '@/types'
import { selectLocalizedCityText } from './public-cities'

type SupportedLocale = 'de' | 'en' | 'tr' | 'ar'

const supportedLocales: SupportedLocale[] = ['de', 'en', 'tr', 'ar']

const localeCityNames: Record<SupportedLocale, Record<string, string>> = {
  de: {
    berlin: 'Berlin',
    hamburg: 'Hamburg',
    muenchen: 'München',
    koeln: 'Köln',
    frankfurt: 'Frankfurt',
    duesseldorf: 'Düsseldorf',
    stuttgart: 'Stuttgart',
    nuernberg: 'Nürnberg',
    karlsruhe: 'Karlsruhe',
  },
  en: {
    berlin: 'Berlin',
    hamburg: 'Hamburg',
    muenchen: 'Munich',
    koeln: 'Cologne',
    frankfurt: 'Frankfurt',
    duesseldorf: 'Dusseldorf',
    stuttgart: 'Stuttgart',
    nuernberg: 'Nuremberg',
    karlsruhe: 'Karlsruhe',
  },
  tr: {
    berlin: 'Berlin',
    hamburg: 'Hamburg',
    muenchen: 'Münih',
    koeln: 'Köln',
    frankfurt: 'Frankfurt',
    duesseldorf: 'Düsseldorf',
    stuttgart: 'Stuttgart',
    nuernberg: 'Nürnberg',
    karlsruhe: 'Karlsruhe',
  },
  ar: {
    berlin: 'برلين',
    hamburg: 'هامبورغ',
    muenchen: 'ميونخ',
    koeln: 'كولونيا',
    frankfurt: 'فرانكفورت',
    duesseldorf: 'دوسلدورف',
    stuttgart: 'شتوتغارت',
    nuernberg: 'نورنبرغ',
    karlsruhe: 'كارلسروه',
  },
}

const localeTemplates: Record<SupportedLocale, string[]> = {
  de: ['{city} bordell', '{city} laufhaus', '{city} fkk club', '{city} saunaclub', '{city} studio'],
  en: ['{city} brothel', '{city} fkk club', '{city} sauna club', '{city} red light district', '{city} studio'],
  tr: ['{city} genelev', '{city} kerhane', '{city} fkk kulübü', '{city} sikiş', '{city} orospu'],
  ar: ['{city} بيت دعارة', '{city} نادي fkk', '{city} ساونا كلوب', '{city} سكس', '{city} استوديو'],
}

const localeExtras: Record<SupportedLocale, Record<string, string[]>> = {
  de: {
    berlin: ['berlin fkk sauna'],
    hamburg: ['hamburg reeperbahn bordell'],
    muenchen: ['münchen luxus bordell'],
    koeln: ['köln pascha'],
    frankfurt: ['frankfurt bahnhofsviertel bordell'],
    duesseldorf: ['düsseldorf wellness club'],
    stuttgart: ['stuttgart sauna club'],
    nuernberg: ['nürnberg privat studio'],
    karlsruhe: ['ettlingen fkk club'],
  },
  en: {
    berlin: ['berlin sex club'],
    hamburg: ['hamburg reeperbahn brothel'],
    muenchen: ['munich luxury brothel'],
    koeln: ['cologne pascha'],
    frankfurt: ['frankfurt bahnhofsviertel brothel'],
    duesseldorf: ['dusseldorf wellness club'],
    stuttgart: ['stuttgart sauna club'],
    nuernberg: ['nuremberg private studio'],
    karlsruhe: ['ettlingen fkk club'],
  },
  tr: {
    berlin: ['berlin sikiş'],
    hamburg: ['hamburg orospu'],
    muenchen: ['münih genelev'],
    koeln: ['köln kerhane'],
    frankfurt: ['frankfurt genelev'],
    duesseldorf: ['düsseldorf kerhane'],
    stuttgart: ['stuttgart sikiş'],
    nuernberg: ['nürnberg genelev'],
    karlsruhe: ['ettlingen kerhane'],
  },
  ar: {
    berlin: ['برلين fkk'],
    hamburg: ['هامبورغ بيت دعارة'],
    muenchen: ['ميونخ بيت دعارة'],
    koeln: ['كولونيا حي الضوء الأحمر'],
    frankfurt: ['فرانكفورت منطقة باهنهوفسفيرتل'],
    duesseldorf: ['دوسلدورف نادي ساونا'],
    stuttgart: ['شتوتغارت نادي fkk'],
    nuernberg: ['نورنبرغ استوديو خاص'],
    karlsruhe: ['إتلينغن نادي fkk'],
  },
}

const searchTagPattern = /\{#([^}]+)\}/g

function normalizeLocale(locale: string): SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale) ? (locale as SupportedLocale) : 'de'
}

function getCityLabel(citySlug: string, cityName: string, locale: SupportedLocale): string {
  return localeCityNames[locale][citySlug] ?? cityName
}

function uniquePhrases(phrases: string[]): string[] {
  const seen = new Set<string>()

  return phrases
    .map((phrase) => phrase.trim())
    .filter(Boolean)
    .filter((phrase) => {
      const key = phrase.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
}

export function getCitySearchPhrases(citySlug: string, cityName: string, locale: string): string[] {
  const normalizedLocale = normalizeLocale(locale)
  const cityLabel = getCityLabel(citySlug, cityName, normalizedLocale)
  const basePhrases = localeTemplates[normalizedLocale].map((template) => template.replaceAll('{city}', cityLabel))
  const extraPhrases = localeExtras[normalizedLocale][citySlug] ?? []

  return uniquePhrases([...basePhrases, ...extraPhrases])
}

export function appendSearchTagsToText(text: string, tags: string[]): string {
  const baseText = text.trim()
  const uniqueTags = uniquePhrases(tags)

  if (uniqueTags.length === 0) {
    return baseText
  }

  const suffix = uniqueTags.map((tag) => `{#${tag}}`).join(' ')
  return baseText ? `${baseText} ${suffix}` : suffix
}

export function extractSearchTags(text: string): string[] {
  const tags: string[] = []

  for (const match of text.matchAll(searchTagPattern)) {
    const phrase = match[1]?.trim()
    if (phrase) {
      tags.push(phrase)
    }
  }

  return uniquePhrases(tags)
}

export function stripSearchTags(text: string): string {
  return text.replace(searchTagPattern, '').replace(/\s{2,}/g, ' ').trim()
}

export function getTaggedCityDescription(
  city: Pick<PublicCity, 'slug' | 'name' | 'description'>,
  locale: string,
): string {
  const description = selectLocalizedCityText(city.description, locale, '')
  const tags = getCitySearchPhrases(city.slug, city.name, locale)
  return appendSearchTagsToText(description, tags)
}
