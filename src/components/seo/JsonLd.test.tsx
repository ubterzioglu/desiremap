import { describe, expect, test } from 'bun:test'

import { serializeJsonLd } from './JsonLd'

describe('JSON-LD serialization', () => {
  test('escapes script-breaking characters before injection', async () => {
    const serialized = serializeJsonLd({
      name: '</script><script>alert("xss")</script>',
      lineSeparator: '\u2028',
      paragraphSeparator: '\u2029',
    })

    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c/script\\u003e')
    expect(serialized).toContain('\\u003cscript\\u003e')
  })
})
