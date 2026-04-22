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
    const raw = Array.isArray(data.results) ? data.results : []
    const items = raw.map((item) => {
      const r = item as unknown as Record<string, unknown>
      // Backend sends snake_case is_active; map to camelCase expected by frontend
      return { ...item, isActive: (r.isActive ?? r.is_active ?? true) as boolean }
    })

    return NextResponse.json({
      items,
      total: typeof data.total === 'number' ? data.total : items.length,
    })
  } catch (err) {
    console.error('public establishments fallback:', err)
    return NextResponse.json({ items: [], total: 0, fallback: true })
  }
}
