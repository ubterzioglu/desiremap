import { create } from 'zustand'

type AdminTab = 'dashboard' | 'establishments' | 'customers' | 'bookings' | 'reviews' | 'badges' | 'invoices' | 'settings'

interface AdminStats {
  totalEstablishments: number
  activeEstablishments: number
  pendingEstablishments: number
  totalCustomers: number
  activeCustomers: number
  totalBookings: number
  pendingBookings: number
  completedBookings: number
  totalReviews: number
  pendingReviews: number
  totalRevenue: number
}

interface AdminState {
  activeTab: AdminTab
  stats: AdminStats | null
  isLoading: boolean
  searchQuery: string
  setActiveTab: (tab: AdminTab) => void
  setStats: (stats: AdminStats | null) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  activeTab: 'dashboard',
  stats: null,
  isLoading: false,
  searchQuery: '',
  setActiveTab: (activeTab) => set({ activeTab }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery })
}))
