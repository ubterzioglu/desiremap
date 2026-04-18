import { NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function GET() {
  try {
    const data = await backendApi.getPublicServiceTypes()
    const items = (data.items ?? []).map((st: any) => ({ id: st.serviceTypeId ?? st.id, slug: (st.code ?? st.slug ?? '').toLowerCase(), name: st.label ?? st.name }))
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 502 })
  }
}
