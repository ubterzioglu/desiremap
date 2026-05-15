import { describe, expect, test } from 'bun:test'

import { toBordellType } from './bordell-type'

describe('toBordellType', () => {
  test('keeps known public establishment types', () => {
    expect(toBordellType('fkk')).toBe('fkk')
    expect(toBordellType('studio')).toBe('studio')
  })

  test('falls back to bordell for unknown API type values', () => {
    expect(toBordellType('thermal')).toBe('bordell')
    expect(toBordellType('')).toBe('bordell')
  })
})
