import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get customer's bookings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await db.booking.findMany({
      where: { customerId: session.user.id },
      include: {
        bordell: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(bookings.map(b => ({
      id: b.id,
      customerId: b.customerId,
      customerName: session.user.name || '',
      customerEmail: session.user.email || '',
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
    console.error('Get customer bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
