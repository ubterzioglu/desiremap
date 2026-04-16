import { NextRequest, NextResponse } from 'next/server'
import { backendApi } from '@/lib/backend-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await backendApi.operatorLogin(email, password)

    const user = {
      id: result.operatorPublicId,
      email,
      name: email.split('@')[0],
      role: 'admin',
      status: 'active',
      avatar: null,
    }

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: result.sessionToken,
        user,
      },
    })

    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    )
  }
}
