import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
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

export interface AuthSession {
  user: AuthUser
  token: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setSession: (session: AuthSession) => void
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setSession: ({ user, token }) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      }),
      setUser: (user) => set((state) => ({
        user,
        token: user ? state.token : null,
        isAuthenticated: Boolean(user && state.token),
        isLoading: false
      })),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
