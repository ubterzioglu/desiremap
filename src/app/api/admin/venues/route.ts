import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getConfiguredBusinessAccountPublicId, getConfiguredVenuePublicId } from '@/lib/admin-config'
import { requireAdminSession } from '@/lib/admin-session'

function getBusinessId(request: NextRequest) {
  const session = requireAdminSession(request)
  if (!session.user) {
    return session
  }

  const businessAccountPublicId = session.user.businessAccountPublicId || getConfiguredBusinessAccountPublicId()

  if (!businessAccountPublicId) {
    return {
      error: 'Business context missing. Set BUSINESS_ACCOUNT_PUBLIC_ID.',
      status: 412 as const,
      user: null,
    }
  }

  return {
    error: null,
    status: 200 as const,
    user: session.user,
    businessAccountPublicId,
  }
}

export async function GET(request: NextRequest) {
  const result = getBusinessId(request)
  if (result.error || !result.user) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status })
  }

  const selectedVenuePublicId = getConfiguredVenuePublicId()

  return NextResponse.json({
    success: true,
    data: selectedVenuePublicId
      ? [{
          venuePublicId: selectedVenuePublicId,
          venueName: 'Configured Venue',
          businessAccountPublicId: result.businessAccountPublicId,
          source: 'configured',
        }]
      : [],
  })
}

export async function POST(request: NextRequest) {
  const result = getBusinessId(request)
  if (result.error || !result.user) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing bearer token' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const data = await backendApi.createVenue(result.businessAccountPublicId, token, payload)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Venue creation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
