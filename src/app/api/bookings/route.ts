import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bordellId, date, time, duration, price, notes } = body

    if (!bordellId || !date || !time || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify bordell exists and is active
    const bordell = await db.bordell.findUnique({
      where: { id: bordellId }
    })

    if (!bordell || bordell.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Establishment not available' },
        { status: 400 }
      )
    }

    const booking = await db.booking.create({
      data: {
        customerId: session.user.id,
        bordellId,
        date: new Date(date),
        time,
        duration,
        price,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        bordell: { select: { name: true } }
      }
    })

    // Update bordell booking count
    await db.bordell.update({
      where: { id: bordellId },
      data: { bookings: { increment: 1 } }
    })

    return NextResponse.json({
      id: booking.id,
      bordellId: booking.bordellId,
      bordellName: booking.bordell.name,
      date: booking.date.toISOString(),
      time: booking.time,
      duration: booking.duration,
      price: booking.price,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.paymentStatus.toLowerCase(),
      createdAt: booking.createdAt.toISOString()
    }, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
