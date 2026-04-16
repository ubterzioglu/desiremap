import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getConfiguredBusinessAccountPublicId, getConfiguredVenuePublicId } from '@/lib/admin-config'
import { requireAdminSession } from '@/lib/admin-session'

function getBusinessContext(request: NextRequest) {
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
  const result = getBusinessContext(request)
  if (result.error || !result.user) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing bearer token' }, { status: 401 })
  }

  try {
    const data = await backendApi.listBusinessOperators(result.businessAccountPublicId, token)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Operator list failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const result = getBusinessContext(request)
  if (result.error || !result.user) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing bearer token' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const { action, operatorPublicId, reason, roleCode, venuePublicId } = payload

    if (!action || !operatorPublicId) {
      return NextResponse.json({ success: false, error: 'Missing operator mutation payload' }, { status: 400 })
    }

    const selectedVenuePublicId = venuePublicId || getConfiguredVenuePublicId()

    const data = action === 'disable'
      ? await backendApi.disableBusinessOperator(result.businessAccountPublicId, operatorPublicId, token, { reason })
      : action === 'reactivate'
        ? await backendApi.reactivateBusinessOperator(result.businessAccountPublicId, operatorPublicId, token, {
            venuePublicId: selectedVenuePublicId || '',
            roleCode: roleCode || 'VENUE_MANAGER',
          })
        : await backendApi.deprovisionBusinessOperator(result.businessAccountPublicId, operatorPublicId, token, { reason })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Operator mutation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
