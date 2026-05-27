import { create } from 'zustand'

import type { MemberAuthSessionResponse } from '@/lib/backend-client'

export interface MemberAuthState {
  session: MemberAuthSessionResponse | null
  setSession: (session: MemberAuthSessionResponse) => void
  clearSession: () => void
}

export const useMemberAuthStore = create<MemberAuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}))
