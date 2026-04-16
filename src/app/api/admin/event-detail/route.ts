import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getConfiguredBusinessAccountPublicId } from '@/lib/admin-config'
import { requireAdminSession } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request)
  if (!session.user) {
    return NextResponse.json({ success: false, error: session.error }, { status: session.status })
  }

  const businessAccountPublicId = session.user.businessAccountPublicId || getConfiguredBusinessAccountPublicId()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null
  const venuePublicId = request.nextUrl.searchParams.get('venuePublicId')
  const eventPublicId = request.nextUrl.searchParams.get('eventPublicId')

  if (!businessAccountPublicId || !token || !venuePublicId || !eventPublicId) {
    return NextResponse.json({ success: false, error: 'Missing event detail context' }, { status: 400 })
  }

  try {
    const data = await backendApi.getOperatorEventDetail(businessAccountPublicId, venuePublicId, eventPublicId, token)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Event detail failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
