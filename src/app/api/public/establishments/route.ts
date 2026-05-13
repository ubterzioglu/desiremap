import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTION_PUBLIC_API_BASE_URL, SERVER_BACKEND_API_URL, joinApiUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  const toTarget = (baseUrl: string) => new URL(joinApiUrl(baseUrl, '/public/establishments'))
  const target = toTarget(SERVER_BACKEND_API_URL)
  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value)
  })

  const fetchFrom = async (url: URL) => fetch(url.toString(), { cache: 'no-store' })
  const response = await fetchFrom(target).catch(async () => {
    const fallbackTarget = toTarget(PRODUCTION_PUBLIC_API_BASE_URL)
    request.nextUrl.searchParams.forEach((value, key) => {
      fallbackTarget.searchParams.append(key, value)
    })
    return fetchFrom(fallbackTarget)
  })
  const body = await response.text()

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  })
}
