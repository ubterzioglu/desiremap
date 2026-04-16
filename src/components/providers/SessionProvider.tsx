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
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout
  } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  const refreshUser = useCallback(async () => {
    const currentToken = useAuthStore.getState().token
    if (!currentToken) {
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
  }, [setLoading, setUser, storeLogout])

  const logout = useCallback(async () => {
    try {
      const currentToken = useAuthStore.getState().token
      if (currentToken) {
        await authApi.logout()
      }
    } catch {
      // Ignore remote logout errors. Local session still cleared.
    }
    storeLogout()
  }, [storeLogout])

  useEffect(() => {
    if (initialized) return

    const doRefresh = () => {
      refreshUser().finally(() => setInitialized(true))
    }

    if (useAuthStore.persist.hasHydrated()) {
      doRefresh()
      return
    }

    const unsub = useAuthStore.persist.onFinishHydration(doRefresh)
    return unsub
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
