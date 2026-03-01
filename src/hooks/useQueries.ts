import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi, bookingApi, establishmentsApi, adminApi, authApi } from '@/lib/api'

// ============ AUTH HOOKS ============
export function useRegister() {
  return useMutation({
    mutationFn: authApi.register
  })
}

// ============ CUSTOMER HOOKS ============
export function useCustomerProfile() {
  return useQuery({
    queryKey: ['customer', 'profile'],
    queryFn: customerApi.getProfile,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function useCustomerVisits() {
  return useQuery({
    queryKey: ['customer', 'visits'],
    queryFn: customerApi.getVisits,
    staleTime: 5 * 60 * 1000
  })
}

export function useCustomerAddresses() {
  return useQuery({
    queryKey: ['customer', 'addresses'],
    queryFn: customerApi.getAddresses
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: customerApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
    }
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: customerApi.updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
    }
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: customerApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
    }
  })
}

export function useCustomerBadges() {
  return useQuery({
    queryKey: ['customer', 'badges'],
    queryFn: customerApi.getBadges,
    staleTime: 10 * 60 * 1000
  })
}

export function useCustomerBookings() {
  return useQuery({
    queryKey: ['customer', 'bookings'],
    queryFn: customerApi.getBookings
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: customerApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] })
    }
  })
}

// ============ BOOKING HOOKS ============
export function useCreateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bookingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'bookings'] })
    }
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(id),
    enabled: !!id
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => bookingApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      queryClient.invalidateQueries({ queryKey: ['customer', 'bookings'] })
    }
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'bookings'] })
    }
  })
}

// ============ SEARCH HOOKS ============
export function useSearchEstablishments(params: {
  q?: string
  city?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['establishments', 'search', params],
    queryFn: () => establishmentsApi.search(params),
    enabled: Object.values(params).some(v => v !== undefined && v !== '')
  })
}

// ============ ADMIN HOOKS ============
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    staleTime: 30 * 1000 // 30 seconds
  })
}

export function useAdminEstablishments(params?: { status?: string; type?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'establishments', params],
    queryFn: () => adminApi.getEstablishments(params)
  })
}

export function useCreateEstablishment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.createEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'establishments'] })
    }
  })
}

export function useUpdateEstablishment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.updateEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'establishments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useDeleteEstablishment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.deleteEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'establishments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminCustomers(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => adminApi.getCustomers(params)
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })
    }
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminBookings(params?: { status?: string; bordellId?: string }) {
  return useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => adminApi.getBookings(params)
  })
}

export function useAdminUpdateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminReviews(params?: { status?: string }) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => adminApi.getReviews(params)
  })
}

export function useAdminUpdateReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    }
  })
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    }
  })
}
