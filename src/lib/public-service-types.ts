import type { PublicServiceType } from '@/types'

type RawPublicServiceType = Partial<PublicServiceType> & {
  serviceTypeId?: number
  code?: string
  label?: string
  venueCount?: number
  count?: number
  establishmentCount?: number
  _count?: { establishments?: number; venues?: number }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function pickServiceTypeId(item: RawPublicServiceType) {
  if (typeof item.id === 'number') return item.id
  if (typeof item.serviceTypeId === 'number') return item.serviceTypeId
  return 0
}

function pickServiceTypeSlugSource(item: RawPublicServiceType, id: number) {
  if (typeof item.slug === 'string') return item.slug
  if (typeof item.code === 'string') return item.code
  if (typeof item.name === 'string') return item.name
  if (typeof item.label === 'string') return item.label
  return String(id)
}

function pickServiceTypeName(item: RawPublicServiceType, slugSource: string) {
  if (typeof item.name === 'string') return item.name
  if (typeof item.label === 'string') return item.label
  return slugSource
}

function pickServiceTypeVenueCount(item: RawPublicServiceType) {
  if (typeof item.venueCount === 'number') return item.venueCount
  if (typeof item.count === 'number') return item.count
  if (typeof item.establishmentCount === 'number') return item.establishmentCount
  if (typeof item._count?.establishments === 'number') return item._count.establishments
  if (typeof item._count?.venues === 'number') return item._count.venues
  return undefined
}

function normalizePublicServiceType(item: RawPublicServiceType): PublicServiceType {
  const id = pickServiceTypeId(item)
  const slugSource = pickServiceTypeSlugSource(item, id)
  const name = pickServiceTypeName(item, slugSource)
  const venueCount = pickServiceTypeVenueCount(item)

  return {
    id,
    slug: slugSource.trim().toLowerCase(),
    name,
    ...(venueCount !== undefined && { venueCount }),
  }
}

export function normalizePublicServiceTypes(payload: unknown): PublicServiceType[] {
  if (!isRecord(payload) || !Array.isArray(payload.items)) {
    return []
  }

  return payload.items
    .filter((item): item is RawPublicServiceType => isRecord(item))
    .map(normalizePublicServiceType)
}
