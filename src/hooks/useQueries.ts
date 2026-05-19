import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi, bookingApi, establishmentsApi, publicApi } from '@/lib/api'


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
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => bookingApi.update(id, data),
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
  return useQuery({
    queryKey: ['public', 'cities'],
    queryFn: () => publicApi.getCities().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublicHero() {
  return useQuery({
    queryKey: ['public', 'hero'],
    queryFn: () => publicApi.getHero().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublicStadtCities() {
  return useQuery({
    queryKey: ['public', 'stadt-cities'],
    queryFn: () => publicApi.getStadtCities().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublicServiceTypes() {
  return useQuery({
    queryKey: ['public', 'service-types'],
    queryFn: () => publicApi.getServiceTypes().then((r) => r.items ?? []),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublicEstablishments(params?: {
  city?: string
  type?: string
  q?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['public', 'establishments', params],
    queryFn: () => publicApi.getEstablishments(params).then((r) => ({ items: r.items ?? [], total: r.total ?? 0 })),
    staleTime: 2 * 60 * 1000,
  })
}

export function usePublicCityCounts(citySlugs: string[]) {
  const uniqueCitySlugs = Array.from(new Set(citySlugs.filter(Boolean)))
  const countQueries = useQueries({
    queries: uniqueCitySlugs.map((citySlug) => ({
      queryKey: ['public', 'establishments', 'count', citySlug],
      queryFn: () => publicApi.getEstablishments({ city: citySlug, limit: 1 }).then((r) => r.total ?? 0),
      staleTime: 2 * 60 * 1000,
    })),
  })

  return uniqueCitySlugs.reduce<Record<string, number | undefined>>((countsByCity, citySlug, index) => {
    countsByCity[citySlug] = countQueries[index]?.data
    return countsByCity
  }, {})
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
