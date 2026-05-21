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

function normalizePublicServiceType(item: RawPublicServiceType): PublicServiceType {
  const id = typeof item.id === 'number'
    ? item.id
    : typeof item.serviceTypeId === 'number'
      ? item.serviceTypeId
      : 0

  const slugSource = typeof item.slug === 'string'
    ? item.slug
    : typeof item.code === 'string'
      ? item.code
      : typeof item.name === 'string'
        ? item.name
        : typeof item.label === 'string'
          ? item.label
          : String(id)

  const name = typeof item.name === 'string'
    ? item.name
    : typeof item.label === 'string'
      ? item.label
      : slugSource

  const venueCount =
    typeof item.venueCount === 'number' ? item.venueCount
    : typeof item.count === 'number' ? item.count
    : typeof item.establishmentCount === 'number' ? item.establishmentCount
    : typeof item._count?.establishments === 'number' ? item._count.establishments
    : typeof item._count?.venues === 'number' ? item._count.venues
    : undefined

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
