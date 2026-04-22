import { NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getFallbackPublicServiceTypes } from '@/lib/public-discovery-fallbacks'

export async function GET() {
  try {
    const data = await backendApi.getPublicServiceTypes()
    const items = Array.isArray(data.items) ? data.items : []

    return NextResponse.json({ items })
  } catch (error) {
    console.error('public service types fallback:', error)
    return NextResponse.json({ items: getFallbackPublicServiceTypes(), fallback: true })
  }
}
