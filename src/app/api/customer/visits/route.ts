import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get user visits
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const visits = await db.visit.findMany({
      where: { userId: session.user.id },
      include: {
        bordell: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(visits.map(v => ({
      id: v.id,
      bordellId: v.bordellId,
      bordellName: v.bordell.name,
      date: v.date.toISOString(),
      duration: v.duration,
      price: v.price,
      rating: v.rating
    })))
  } catch (error) {
    console.error('Get visits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
