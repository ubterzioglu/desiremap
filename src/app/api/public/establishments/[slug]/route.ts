import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTION_PUBLIC_API_BASE_URL, SERVER_BACKEND_API_URL, joinApiUrl } from '@/lib/api-config'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params
  const endpoint = `/public/establishments/${encodeURIComponent(slug)}`
  const fetchFrom = async (baseUrl: string) => fetch(joinApiUrl(baseUrl, endpoint), { cache: 'no-store' })
  const response = await fetchFrom(SERVER_BACKEND_API_URL).catch(() => fetchFrom(PRODUCTION_PUBLIC_API_BASE_URL))
  const body = await response.text()

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  })
}
