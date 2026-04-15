'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '@/lib/api'
import { useAuthStore, type AuthUser } from '@/stores/authStore'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout
  } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null)
      return
    }

    setLoading(true)

    try {
      const nextUser = await authApi.me()
      setUser(nextUser)
    } catch {
      storeLogout()
    }
  }, [setLoading, setUser, storeLogout, token])

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout()
      }
    } catch {
      // Ignore remote logout errors. Local session still cleared.
    }
    storeLogout()
  }, [storeLogout, token])

  useEffect(() => {
    if (!initialized) {
      refreshUser().finally(() => setInitialized(true))
    }
  }, [initialized, refreshUser])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading: isLoading && !initialized, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a SessionProvider')
  }
  return context
}
