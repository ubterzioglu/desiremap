import { NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getFallbackPublicCities } from '@/lib/public-discovery-fallbacks'

export async function GET() {
  try {
    const data = await backendApi.getPublicCities()
    const items = Array.isArray(data.items) ? data.items : []

    return NextResponse.json({ items })
  } catch (error) {
    console.error('public cities fallback:', error)
    return NextResponse.json({ items: getFallbackPublicCities(), fallback: true })
  }
}
