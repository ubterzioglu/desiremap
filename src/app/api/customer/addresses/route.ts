import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value

  if (!authUserCookie) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: []
  })
}

export async function POST(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value

  if (!authUserCookie) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { id: crypto.randomUUID(), message: 'Address stored locally' }
  })
}

export async function PUT(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value

  if (!authUserCookie) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { message: 'Address updated' }
  })
}

export async function DELETE(request: NextRequest) {
  const authUserCookie = request.cookies.get('auth_user')?.value

  if (!authUserCookie) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { success: true }
  })
}
