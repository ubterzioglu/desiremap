import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value

  if (!authUserCookie) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const user = JSON.parse(authUserCookie)
  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalEstablishments: 0,
        activeEstablishments: 0,
        totalCustomers: 0,
        activeCustomers: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
      },
      topEstablishments: [],
      recentActivity: []
    }
  })
}
