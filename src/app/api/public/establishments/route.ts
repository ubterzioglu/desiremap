import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      city: searchParams.get('city') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined,
    }

    const data = await backendApi.getPublicEstablishments(params)
    const items = Array.isArray(data.results) ? data.results : []

    return NextResponse.json({
      items,
      total: typeof data.total === 'number' ? data.total : items.length,
    })
  } catch (err) {
    console.error('public establishments fallback:', err)
    return NextResponse.json({ items: [], total: 0, fallback: true })
  }
}
