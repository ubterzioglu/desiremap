import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        bordell: { select: { id: true, name: true } }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check access (customer owns it or admin)
    const isAdmin = session.user.role === 'admin'
    const isOwner = booking.customerId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      id: booking.id,
      customerId: booking.customerId,
      customerName: booking.customer.name || '',
      customerEmail: booking.customer.email,
      bordellId: booking.bordellId,
      bordellName: booking.bordell.name,
      date: booking.date.toISOString(),
      time: booking.time,
      duration: booking.duration,
      price: booking.price,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.paymentStatus.toLowerCase(),
      createdAt: booking.createdAt.toISOString(),
      notes: booking.notes,
      rating: booking.rating,
      review: booking.review
    })
  } catch (error) {
    console.error('Get booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update booking (cancel, add review)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const booking = await db.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const isAdmin = session.user.role === 'admin'
    const isOwner = booking.customerId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data: any = {}

    // Customer can cancel or add review
    if (isOwner && !isAdmin) {
      if (body.status === 'cancelled') {
        data.status = 'CANCELLED'
      }
      if (body.rating !== undefined) {
        data.rating = body.rating
      }
      if (body.review !== undefined) {
        data.review = body.review
      }
    }

    // Admin can update status and payment
    if (isAdmin) {
      if (body.status) data.status = body.status.toUpperCase()
      if (body.paymentStatus) data.paymentStatus = body.paymentStatus.toUpperCase()
      if (body.rating !== undefined) data.rating = body.rating
      if (body.review !== undefined) data.review = body.review
    }

    const updated = await db.booking.update({
      where: { id },
      data
    })

    return NextResponse.json({
      id: updated.id,
      status: updated.status.toLowerCase(),
      paymentStatus: updated.paymentStatus.toLowerCase()
    })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const isAdmin = session.user.role === 'admin'
    const isOwner = booking.customerId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow cancellation if pending
    if (booking.status !== 'PENDING' && !isAdmin) {
      return NextResponse.json(
        { error: 'Cannot cancel this booking' },
        { status: 400 }
      )
    }

    await db.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
