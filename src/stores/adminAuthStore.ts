import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminAuthUser {
  id: string
  email: string
  name: string
  role: 'super_admin'
  workspace: 'admin'
}

interface AdminAuthState {
  adminUser: AdminAuthUser | null
  isAdminAuthenticated: boolean
  setAdminSession: (user: AdminAuthUser) => void
  clearAdminSession: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminUser: null,
      isAdminAuthenticated: false,
      setAdminSession: (user: AdminAuthUser) => set({
        adminUser: user,
        isAdminAuthenticated: true
      }),
      clearAdminSession: () => set({
        adminUser: null,
        isAdminAuthenticated: false
      })
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAdminAuthenticated: state.isAdminAuthenticated
      })
    }
  )
)
