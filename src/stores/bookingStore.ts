import { create } from 'zustand'

interface PendingBooking {
  bordellId: string
  bordellName: string
  date: string
  time: string
  duration: number
  price: number
}

interface BookingState {
  pendingBooking: PendingBooking | null
  recentBookings: any[]
  isModalOpen: boolean
  setPendingBooking: (booking: PendingBooking | null) => void
  setRecentBookings: (bookings: any[]) => void
  addRecentBooking: (booking: any) => void
  openModal: () => void
  closeModal: () => void
  clearPendingBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  pendingBooking: null,
  recentBookings: [],
  isModalOpen: false,
  setPendingBooking: (booking) => set({ pendingBooking: booking }),
  setRecentBookings: (bookings) => set({ recentBookings: bookings }),
  addRecentBooking: (booking) => set((state) => ({
    recentBookings: [booking, ...state.recentBookings].slice(0, 10)
  })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  clearPendingBooking: () => set({ pendingBooking: null })
}))
