'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAdminAuthStore, type AdminAuthUser } from '@/stores/adminAuthStore'

const ADMIN_EMAIL = 'admin@desiremap.de'
const ADMIN_PASSWORD = 'Admin123!'

const STATIC_ADMIN_USER: AdminAuthUser = {
  id: 'super-admin-001',
  email: ADMIN_EMAIL,
  name: 'Super Admin',
  role: 'super_admin',
  workspace: 'admin',
}

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
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminSession(STATIC_ADMIN_USER)
    } else {
      throw new Error('Ungueltige Anmeldedaten.')
    }
  }, [setAdminSession])

  const logout = useCallback(() => {
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
