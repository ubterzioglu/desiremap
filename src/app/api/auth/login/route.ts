import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verify } from '@/lib/auth/password'
import { generateToken, getCookieOptions } from '@/lib/auth/paseto'

/**
 * POST /api/auth/login
 * Credentials login for Admin, Owner, and Customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Input validation
    const schema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters')
    })

    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // User not found or no password (OAuth-only user)
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verify(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is banned
    if (user.status === 'BANNED') {
      return NextResponse.json(
        { error: 'Account has been banned' },
        { status: 403 }
      )
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Generate PASETO token
    const token = await generateToken({
      sub: user.id,
      role: user.role.toLowerCase(),
      email: user.email
    })

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        status: user.status.toLowerCase(),
        avatar: user.avatar
      }
    })

    // Set auth cookie
    response.cookies.set('auth_token', token, getCookieOptions())

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
