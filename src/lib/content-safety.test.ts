import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'

describe('content safety surfaces', () => {
  test('unsafe mock and structured data files are removed from the runtime codebase', () => {
    expect(existsSync(new URL('./structuredData.ts', import.meta.url))).toBe(false)
    expect(existsSync(new URL('../data/mock-data.ts', import.meta.url))).toBe(false)
  })
})
