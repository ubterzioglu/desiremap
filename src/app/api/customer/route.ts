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

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberSince: new Date().toISOString(),
      totalSpent: 0
    }
  })
}
