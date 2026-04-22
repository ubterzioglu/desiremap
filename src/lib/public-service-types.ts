import type { PublicServiceType } from '@/types'

type RawPublicServiceType = Partial<PublicServiceType> & {
  serviceTypeId?: number
  code?: string
  label?: string
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

  return {
    id,
    slug: slugSource.trim().toLowerCase(),
    name,
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
