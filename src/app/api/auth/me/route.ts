import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
      data: { user },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid session' },
      { status: 401 }
    )
  }
}
