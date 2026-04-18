'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAdminAuthStore, type AdminAuthUser } from '@/stores/adminAuthStore'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/lib/api'

interface AdminAuthContextType {
  user: AdminAuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const {
    adminUser,
    isAdminAuthenticated,
    setAdminSession,
    clearAdminSession
  } = useAdminAuthStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    const finish = () => setInitialized(true)

    if (useAdminAuthStore.persist.hasHydrated()) {
      finish()
      return
    }

    const unsub = useAdminAuthStore.persist.onFinishHydration(finish)
    return unsub
  }, [initialized])

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login({ email, password }, 'admin')

    useAuthStore.getState().setSession(session)

    setAdminSession({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? email.split('@')[0],
      role: 'super_admin',
      workspace: 'admin',
    })
  }, [setAdminSession])

  const logout = useCallback(() => {
    authApi.logout().catch(() => undefined)
    useAuthStore.getState().logout()
    clearAdminSession()
  }, [clearAdminSession])

  return (
    <AdminAuthContext.Provider value={{
      user: adminUser,
      isAuthenticated: isAdminAuthenticated,
      isLoading: !initialized,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
