import { NextRequest, NextResponse } from 'next/server'

function checkAdmin(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value
  if (!authUserCookie) return null
  const user = JSON.parse(authUserCookie)
  return user.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ success: true, data: [] })
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({
    success: true,
    data: { message: 'Customer updated' }
  })
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ success: true, data: { success: true } })
}
