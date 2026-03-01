import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: true,
        badges: {
          include: {
            badge: true
          }
        },
        _count: {
          select: {
            visits: true,
            bookingsAsCustomer: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate total spent
    const visits = await db.visit.findMany({
      where: { userId: user.id },
      select: { price: true }
    })
    const totalSpent = visits.reduce((sum, v) => sum + v.price, 0)

    // Get favorite city
    const cityVisits = await db.visit.groupBy({
      by: ['bordellId'],
      where: { userId: user.id },
      _count: true
    })

    let favoriteCity = ''
    if (cityVisits.length > 0) {
      const mostVisited = cityVisits.sort((a, b) => b._count - a._count)[0]
      const bordell = await db.bordell.findUnique({
        where: { id: mostVisited.bordellId },
        select: { city: true }
      })
      favoriteCity = bordell?.city || ''
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      memberSince: user.memberSince.toISOString(),
      premium: user.badges.some(b => b.badge.name === 'Premium'),
      premiumExpiry: undefined,
      premiumPlan: undefined,
      totalVisits: user._count.visits,
      totalSpent,
      favoriteCity,
      status: user.status.toLowerCase(),
      lastLogin: user.lastLogin?.toISOString() || user.memberSince.toISOString(),
      badges: user.badges.map(b => b.badge.name),
      addresses: user.addresses.map(a => ({
        id: a.id,
        label: a.label,
        street: a.street,
        city: a.city,
        zip: a.zip,
        country: a.country,
        isDefault: a.isDefault
      })),
      notes: user.notes
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, avatar } = body

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined
      }
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
