import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getConfiguredBusinessAccountPublicId, getConfiguredVenuePublicId } from '@/lib/admin-config'
import { requireAdminSession } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request)
  if (!session.user) {
    return NextResponse.json({ success: false, error: session.error }, { status: session.status })
  }

  const businessAccountPublicId = session.user.businessAccountPublicId || getConfiguredBusinessAccountPublicId()
  const selectedVenuePublicId = getConfiguredVenuePublicId()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null

  let operatorsCount = 0
  let publishedEvents = 0
  let draftEvents = 0

  if (businessAccountPublicId && token) {
    try {
      const operators = await backendApi.listBusinessOperators(businessAccountPublicId, token)
      operatorsCount = Array.isArray(operators) ? operators.length : 0
    } catch {
      operatorsCount = 0
    }
  }

  if (selectedVenuePublicId) {
    try {
      const events = await backendApi.getPublicVenueEvents(selectedVenuePublicId)
      publishedEvents = events.items.filter((item) => ['OPEN', 'PUBLISHED'].includes(item.status)).length
      draftEvents = events.items.filter((item) => item.status === 'DRAFT').length
    } catch {
      publishedEvents = 0
      draftEvents = 0
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      venues: selectedVenuePublicId ? 1 : 0,
      publishedEvents,
      draftEvents,
      operators: operatorsCount,
      selectedVenuePublicId,
      businessAccountPublicId,
    }
  })
}
