import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Helper to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'admin') {
    return null
  }
  return session
}

// GET - Get all bookings
export async function GET(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const bordellId = searchParams.get('bordellId')

    const where: any = {}
    if (status) where.status = status.toUpperCase()
    if (bordellId) where.bordellId = bordellId

    const bookings = await db.booking.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true }
        },
        bordell: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(bookings.map(b => ({
      id: b.id,
      customerId: b.customerId,
      customerName: b.customer.name || 'Unknown',
      customerEmail: b.customer.email,
      bordellId: b.bordellId,
      bordellName: b.bordell.name,
      date: b.date.toISOString(),
      time: b.time,
      duration: b.duration,
      price: b.price,
      status: b.status.toLowerCase(),
      paymentStatus: b.paymentStatus.toLowerCase(),
      createdAt: b.createdAt.toISOString(),
      notes: b.notes,
      rating: b.rating,
      review: b.review
    })))
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update booking status
export async function PUT(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, paymentStatus } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status.toUpperCase()
    if (paymentStatus) data.paymentStatus = paymentStatus.toUpperCase()

    const booking = await db.booking.update({
      where: { id },
      data
    })

    return NextResponse.json({
      id: booking.id,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.paymentStatus.toLowerCase()
    })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
