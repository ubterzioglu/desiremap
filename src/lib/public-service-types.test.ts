import { describe, expect, test } from 'bun:test'

import { normalizePublicServiceTypes } from './public-service-types'

describe('normalizePublicServiceTypes', () => {
  test('maps backend service type payload to frontend model', () => {
    const normalized = normalizePublicServiceTypes({
      items: [
        {
          serviceTypeId: 5,
          code: 'BORDELL',
          name: 'Bordelle',
          label: 'Bordelle'
        },
        {
          serviceTypeId: 3,
          code: 'FKK',
          name: 'FKK Clubs',
          label: 'FKK Clubs'
        }
      ]
    })

    expect(normalized).toEqual([
      {
        id: 5,
        slug: 'bordell',
        name: 'Bordelle'
      },
      {
        id: 3,
        slug: 'fkk',
        name: 'FKK Clubs'
      }
    ])
  })
})
