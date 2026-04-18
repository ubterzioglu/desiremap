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
    const items = (data as any).results ?? data.items ?? []
    return NextResponse.json({ success: true, data: items, total: (data as any).total ?? items.length })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 502 })
  }
}
