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

// GET - Get all reviews
export async function GET(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) where.status = status.toUpperCase()

    const reviews = await db.review.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true }
        },
        bordell: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews.map(r => ({
      id: r.id,
      customerId: r.customerId,
      customerName: r.customer.name || 'Unknown',
      bordellId: r.bordellId,
      bordellName: r.bordell.name,
      rating: r.rating,
      title: r.title,
      content: r.content,
      status: r.status.toLowerCase(),
      response: r.response,
      respondedAt: r.respondedAt?.toISOString() || null,
      date: r.createdAt.toISOString()
    })))
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update review (approve/reject/respond)
export async function PUT(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, response } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status.toUpperCase()
    if (response !== undefined) {
      data.response = response
      data.respondedAt = new Date()
    }

    const review = await db.review.update({
      where: { id },
      data
    })

    // If approved, update bordell rating
    if (status === 'APPROVED') {
      const bordellReviews = await db.review.findMany({
        where: { bordellId: review.bordellId, status: 'APPROVED' },
        select: { rating: true }
      })
      
      if (bordellReviews.length > 0) {
        const avgRating = bordellReviews.reduce((sum, r) => sum + r.rating, 0) / bordellReviews.length
        await db.bordell.update({
          where: { id: review.bordellId },
          data: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: bordellReviews.length
          }
        })
      }
    }

    return NextResponse.json({
      id: review.id,
      status: review.status.toLowerCase()
    })
  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete review
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

    await db.review.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
