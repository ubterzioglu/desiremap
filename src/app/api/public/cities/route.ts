import { NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function GET() {
  try {
    const data = await backendApi.getPublicCities()
    const items = (data.items ?? []).map((c: any) => ({ id: c.cityId ?? c.id, slug: c.slug, name: c.name }))
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 502 })
  }
}
