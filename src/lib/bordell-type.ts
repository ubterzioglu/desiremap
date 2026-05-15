import type { BordellType } from '@/types'

const BORDELL_TYPES = ['laufhaus', 'bordell', 'fkk', 'studio', 'privat'] as const satisfies readonly BordellType[]

export function toBordellType(value: string): BordellType {
  return BORDELL_TYPES.includes(value as BordellType) ? (value as BordellType) : 'bordell'
}
