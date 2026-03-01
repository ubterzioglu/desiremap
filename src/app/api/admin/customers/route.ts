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

// GET - Get all customers
export async function GET(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = { role: 'CUSTOMER' }
    if (status) where.status = status.toUpperCase()
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const customers = await db.user.findMany({
      where,
      include: {
        _count: {
          select: {
            visits: true,
            bookingsAsCustomer: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate total spent for each customer
    const customersWithSpent = await Promise.all(
      customers.map(async (c) => {
        const visits = await db.visit.findMany({
          where: { userId: c.id },
          select: { price: true }
        })
        const totalSpent = visits.reduce((sum, v) => sum + v.price, 0)
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar,
          memberSince: c.memberSince.toISOString(),
          totalVisits: c._count.visits,
          totalBookings: c._count.bookingsAsCustomer,
          totalSpent,
          status: c.status.toLowerCase(),
          lastLogin: c.lastLogin?.toISOString() || null,
          notes: c.notes
        }
      })
    )

    return NextResponse.json(customersWithSpent)
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status.toUpperCase()
    if (notes !== undefined) data.notes = notes

    const user = await db.user.update({
      where: { id },
      data
    })

    return NextResponse.json({
      id: user.id,
      status: user.status.toLowerCase()
    })
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete customer
export async function DELETE(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await db.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
