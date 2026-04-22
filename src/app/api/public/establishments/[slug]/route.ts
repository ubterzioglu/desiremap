import { NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function GET(
  _: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const item = await backendApi.getPublicEstablishmentDetail(slug)
    return NextResponse.json(item)
  } catch (error) {
    console.error('public establishment detail failed:', error)
    return NextResponse.json(
      { success: false, error: 'Public establishment detail unavailable' },
      { status: 502 }
    )
  }
}
