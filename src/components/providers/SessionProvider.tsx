'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useAuthStore, type AuthUser } from '@/stores/authStore'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  refreshUser: () => void
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
    setUser,
    logout: storeLogout
  } = useAuthStore()
  const queryClient = useQueryClient()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    const finish = () => setInitialized(true)

    if (useAuthStore.persist.hasHydrated()) {
      finish()
      return
    }

    const unsub = useAuthStore.persist.onFinishHydration(finish)
    return unsub
  }, [initialized])

  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!token && initialized,
    staleTime: 5 * 60 * 1000,
    retry: false,
    select: (data) => data,
  })

  useEffect(() => {
    const queryData = queryClient.getQueryData(['auth', 'me']) as AuthUser | undefined
    if (queryData) {
      setUser(queryData)
    }
  }, [queryClient, setUser, token])

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
  }, [queryClient])

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout()
      }
    } catch {
      // Ignore remote logout errors. Local session still cleared.
    }
    queryClient.removeQueries({ queryKey: ['auth'] })
    storeLogout()
  }, [token, queryClient, storeLogout])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading: !initialized, refreshUser, logout }}>
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
