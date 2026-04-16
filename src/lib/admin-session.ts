import type { NextRequest } from 'next/server'

export interface AdminSessionUser {
  id: string
  email: string
  name: string | null
  role: string
  status: string
  avatar: string | null
  workspace?: 'public' | 'admin'
  operatorPublicId?: string
  businessAccountPublicId?: string | null
  requirePasswordReset?: boolean
}

function parseAuthUser(value?: string | null): AdminSessionUser | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AdminSessionUser
  } catch {
    return null
  }
}

export function getSessionUserFromRequest(request: NextRequest) {
  return parseAuthUser(request.cookies.get('auth_user')?.value)
}

export function requireAdminSession(request: NextRequest) {
  const user = getSessionUserFromRequest(request)

  if (!user) {
    return { error: 'Not authenticated', status: 401 as const, user: null }
  }

  if (user.workspace !== 'admin') {
    return { error: 'Forbidden', status: 403 as const, user: null }
  }

  return { error: null, status: 200 as const, user }
}
