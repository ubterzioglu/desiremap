import { create } from 'zustand'

type AdminTab = 'dashboard' | 'venues' | 'events' | 'operators' | 'settings'

interface AdminStats {
  venues: number
  publishedEvents: number
  draftEvents: number
  operators: number
}

interface AdminState {
  activeTab: AdminTab
  stats: AdminStats | null
  isLoading: boolean
  selectedVenuePublicId: string | null
  setActiveTab: (tab: AdminTab) => void
  setStats: (stats: AdminStats | null) => void
  setLoading: (loading: boolean) => void
  setSelectedVenuePublicId: (venuePublicId: string | null) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  activeTab: 'dashboard',
  stats: null,
  isLoading: false,
  selectedVenuePublicId: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedVenuePublicId: (selectedVenuePublicId) => set({ selectedVenuePublicId })
}))
