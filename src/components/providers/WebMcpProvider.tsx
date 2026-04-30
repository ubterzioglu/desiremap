'use client'

import { useEffect } from 'react'

const SITE_ORIGIN = 'https://desiremap.de'

function registerWebMcpTools() {
  const nav = navigator as Navigator & {
    modelContext?: {
      registerTool: (tool: Record<string, unknown>, options?: Record<string, unknown>) => void
    }
  }

  if (!nav.modelContext?.registerTool) return

  const ac = new AbortController()

  nav.modelContext.registerTool(
    {
      name: 'search-venues',
      title: 'Search Venues',
      description:
        'Search for venues (establishments) on DesireMap by keyword. Returns search results page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keyword (city name, venue name, or service type)',
          },
        },
        required: ['query'],
      },
      execute: async (input: { query: string }) => {
        const url = `${SITE_ORIGIN}/search?q=${encodeURIComponent(input.query)}`
        window.location.href = url
        return { navigated: true, url }
      },
      annotations: { readOnlyHint: false },
    },
    { signal: ac.signal },
  )

  nav.modelContext.registerTool(
    {
      name: 'navigate-venue',
      title: 'Navigate to Venue',
      description:
        'Navigate to a specific venue page by its slug. Returns the venue page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'The venue slug identifier',
          },
        },
        required: ['slug'],
      },
      execute: async (input: { slug: string }) => {
        const url = `${SITE_ORIGIN}/venue/${encodeURIComponent(input.slug)}`
        window.location.href = url
        return { navigated: true, url }
      },
      annotations: { readOnlyHint: false },
    },
    { signal: ac.signal },
  )

  nav.modelContext.registerTool(
    {
      name: 'browse-city',
      title: 'Browse by City',
      description:
        'Browse all venues in a specific city. Returns the city page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name (e.g. berlin, munich, hamburg)',
          },
        },
        required: ['city'],
      },
      execute: async (input: { city: string }) => {
        const url = `${SITE_ORIGIN}/stadt/${encodeURIComponent(input.city.toLowerCase())}`
        window.location.href = url
        return { navigated: true, url }
      },
      annotations: { readOnlyHint: false },
    },
    { signal: ac.signal },
  )

  nav.modelContext.registerTool(
    {
      name: 'get-site-info',
      title: 'Get Site Information',
      description:
        'Get basic information about DesireMap — what the site offers, supported languages, and available sections.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => ({
        name: 'DesireMap',
        description: 'Marketplace platform for adult entertainment establishments in Germany',
        languages: ['de', 'en', 'ar', 'tr'],
        sections: ['venues', 'blog', 'cities', 'search'],
        apiDocs: `${SITE_ORIGIN}/api`,
      }),
      annotations: { readOnlyHint: true },
    },
    { signal: ac.signal },
  )

  return () => ac.abort()
}

export function WebMcpProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = registerWebMcpTools()
    return () => cleanup?.()
  }, [])

  return <>{children}</>
}
