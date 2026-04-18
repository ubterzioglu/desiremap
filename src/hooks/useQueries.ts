import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

function useIsMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
import { customerApi, bookingApi, establishmentsApi, adminApi, authApi, publicApi, seedApi } from '@/lib/api'

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

// ============ PUBLIC HOOKS ============
export function usePublicCities() {
  const mounted = useIsMounted()
  return useQuery({
    queryKey: ['public', 'cities'],
    queryFn: () => publicApi.getCities().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
    enabled: mounted,
  })
}

export function usePublicServiceTypes() {
  const mounted = useIsMounted()
  return useQuery({
    queryKey: ['public', 'service-types'],
    queryFn: () => publicApi.getServiceTypes().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
    enabled: mounted,
  })
}

export function usePublicEstablishments(params?: {
  city?: string
  type?: string
  q?: string
  limit?: number
  offset?: number
}) {
  const mounted = useIsMounted()
  return useQuery({
    queryKey: ['public', 'establishments', params],
    queryFn: () => publicApi.getEstablishments(params).then((r) => ({ items: r.items ?? [], total: r.total ?? 0 })),
    staleTime: 2 * 60 * 1000,
    enabled: mounted,
  })
}

export function usePublicEstablishmentDetail(slug: string) {
  return useQuery({
    queryKey: ['public', 'establishment', slug],
    queryFn: () => publicApi.getEstablishmentDetail(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
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
    queryFn: adminApi.getDashboardSnapshot,
    staleTime: 30 * 1000 // 30 seconds
  })
}

export function useAdminVenues() {
  return useQuery({
    queryKey: ['admin', 'venues'],
    queryFn: adminApi.getVenues
  })
}

export function useCreateVenue() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminEvents(venuePublicId: string | null) {
  return useQuery({
    queryKey: ['admin', 'events', venuePublicId],
    queryFn: () => adminApi.getVenueEvents(venuePublicId || ''),
    enabled: Boolean(venuePublicId)
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function usePublishEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.publishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useCancelEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.cancelEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminOperators() {
  return useQuery({
    queryKey: ['admin', 'operators'],
    queryFn: adminApi.getBusinessOperators
  })
}

export function useDisableBusinessOperator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.disableBusinessOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'operators'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useReactivateBusinessOperator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.reactivateBusinessOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'operators'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useAdminSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seedApi.seed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useDeprovisionBusinessOperator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.deprovisionBusinessOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'operators'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}
