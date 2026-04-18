import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const data = await backendApi.getPublicEstablishmentDetail(slug)
    return NextResponse.json(data)
  } catch (err) {
    const message = String(err)
    const status = message.includes('404') || message.includes('not found') ? 404 : 502
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
