import { NextResponse } from 'next/server'

/**
 * GET /api/auth/config
 * Returns auth configuration status (for UI to show/hide OAuth buttons)
 */
export async function GET() {
  return NextResponse.json({
    googleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  })
}
