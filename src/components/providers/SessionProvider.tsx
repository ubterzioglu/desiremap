'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  status: string
  avatar: string | null
}

interface AuthContextType {
  user: User | null
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
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [setUser])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore errors
    }
    storeLogout()
  }, [storeLogout])

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
