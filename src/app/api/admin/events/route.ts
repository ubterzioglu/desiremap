import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'
import { getConfiguredBusinessAccountPublicId } from '@/lib/admin-config'
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
  const session = requireAdminSession(request)
  if (!session.user) {
    return NextResponse.json({ success: false, error: session.error }, { status: session.status })
  }

  const venuePublicId = request.nextUrl.searchParams.get('venuePublicId')
  if (!venuePublicId) {
    return NextResponse.json({ success: false, error: 'venuePublicId is required' }, { status: 400 })
  }

  try {
    const data = await backendApi.getPublicVenueEvents(venuePublicId)
    return NextResponse.json({ success: true, data: data.items })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Event list failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
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
    const { venuePublicId, ...eventPayload } = payload

    if (!venuePublicId) {
      return NextResponse.json({ success: false, error: 'venuePublicId is required' }, { status: 400 })
    }

    const data = await backendApi.createEvent(result.businessAccountPublicId, venuePublicId, token, eventPayload)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Event creation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
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
    const { action, venuePublicId, eventPublicId, expectedLockVersion, reasonCode, note } = payload

    if (!venuePublicId || !eventPublicId || !action || !expectedLockVersion) {
      return NextResponse.json({ success: false, error: 'Missing event mutation payload' }, { status: 400 })
    }

    const mutationPayload = { expectedLockVersion, reasonCode, note }

    const data = action === 'cancel'
      ? await backendApi.cancelEvent(result.businessAccountPublicId, venuePublicId, eventPublicId, token, mutationPayload)
      : await backendApi.publishEvent(result.businessAccountPublicId, venuePublicId, eventPublicId, token, mutationPayload)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Event mutation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
