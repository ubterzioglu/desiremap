import { NextResponse } from 'next/server'
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

// GET - Get admin dashboard stats
export async function GET() {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts
    const [
      totalEstablishments,
      activeEstablishments,
      pendingEstablishments,
      totalCustomers,
      activeCustomers,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalReviews,
      pendingReviews
    ] = await Promise.all([
      db.bordell.count(),
      db.bordell.count({ where: { status: 'ACTIVE' } }),
      db.bordell.count({ where: { status: 'PENDING' } }),
      db.user.count({ where: { role: 'CUSTOMER' } }),
      db.user.count({ where: { role: 'CUSTOMER', status: 'ACTIVE' } }),
      db.booking.count(),
      db.booking.count({ where: { status: 'PENDING' } }),
      db.booking.count({ where: { status: 'COMPLETED' } }),
      db.review.count(),
      db.review.count({ where: { status: 'PENDING' } })
    ])

    // Get revenue
    const completedBookingsData = await db.booking.findMany({
      where: { status: 'COMPLETED', paymentStatus: 'PAID' },
      select: { price: true }
    })
    const totalRevenue = completedBookingsData.reduce((sum, b) => sum + b.price, 0)

    // Get monthly stats (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentBookings = await db.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { price: true, createdAt: true, status: true }
    })

    // Group by month
    const monthlyStats: { [key: string]: { bookings: number; revenue: number } } = {}
    recentBookings.forEach(b => {
      const month = b.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { bookings: 0, revenue: 0 }
      }
      monthlyStats[month].bookings++
      if (b.status === 'COMPLETED') {
        monthlyStats[month].revenue += b.price
      }
    })

    // Get top establishments
    const topEstablishments = await db.bordell.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { bookings: 'desc' },
      take: 5,
      select: { id: true, name: true, city: true, bookings: true, revenue: true }
    })

    // Get recent activity
    const recentActivity = await db.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } },
        bordell: { select: { name: true } }
      }
    })

    return NextResponse.json({
      overview: {
        totalEstablishments,
        activeEstablishments,
        pendingEstablishments,
        totalCustomers,
        activeCustomers,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalReviews,
        pendingReviews,
        totalRevenue
      },
      monthlyStats: Object.entries(monthlyStats).map(([month, data]) => ({
        month,
        bookings: data.bookings,
        revenue: data.revenue
      })),
      topEstablishments: topEstablishments.map(e => ({
        id: e.id,
        name: e.name,
        city: e.city,
        bookings: e.bookings,
        revenue: e.revenue
      })),
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        type: 'booking',
        customerName: a.customer.name || 'Unknown',
        bordellName: a.bordell.name,
        amount: a.price,
        status: a.status.toLowerCase(),
        date: a.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
