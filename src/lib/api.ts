const API_BASE = '/api'

// Helper for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============ AUTH API ============
export const authApi = {
  register: async (data: {
    email: string
    password: string
    name?: string
    phone?: string
  }) => {
    return apiCall<{ id: string; email: string; name: string; role: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// ============ CUSTOMER API ============
export const customerApi = {
  getProfile: async () => {
    return apiCall<any>('/customer')
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiCall<any>('/customer', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  getVisits: async () => {
    return apiCall<any[]>('/customer/visits')
  },

  getAddresses: async () => {
    return apiCall<any[]>('/customer/addresses')
  },

  createAddress: async (data: {
    label: string
    street: string
    city: string
    zip: string
    country?: string
    isDefault?: boolean
  }) => {
    return apiCall<any>('/customer/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateAddress: async (data: any) => {
    return apiCall<any>('/customer/addresses', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteAddress: async (id: string) => {
    return apiCall<{ success: boolean }>(`/customer/addresses?id=${id}`, {
      method: 'DELETE'
    })
  },

  getBadges: async () => {
    return apiCall<any[]>('/customer/badges')
  },

  getBookings: async () => {
    return apiCall<any[]>('/customer/bookings')
  }
}

// ============ BOOKING API ============
export const bookingApi = {
  create: async (data: {
    bordellId: string
    date: string
    time: string
    duration: number
    price: number
    notes?: string
  }) => {
    return apiCall<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  getById: async (id: string) => {
    return apiCall<any>(`/bookings/${id}`)
  },

  update: async (id: string, data: any) => {
    return apiCall<any>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  cancel: async (id: string) => {
    return apiCall<{ success: boolean }>(`/bookings/${id}`, {
      method: 'DELETE'
    })
  }
}

// ============ ESTABLISHMENTS API ============
export const establishmentsApi = {
  search: async (params: {
    q?: string
    city?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    limit?: number
    offset?: number
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return apiCall<{ results: any[]; total: number; limit: number; offset: number }>(
      `/establishments?${searchParams.toString()}`
    )
  }
}

// ============ ADMIN API ============
export const adminApi = {
  getStats: async () => {
    return apiCall<any>('/admin/stats')
  },

  // Establishments
  getEstablishments: async (params?: { status?: string; type?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }
    return apiCall<any[]>(`/admin/establishments?${searchParams.toString()}`)
  },

  createEstablishment: async (data: any) => {
    return apiCall<any>('/admin/establishments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateEstablishment: async (data: any) => {
    return apiCall<any>('/admin/establishments', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteEstablishment: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/establishments?id=${id}`, {
      method: 'DELETE'
    })
  },

  // Customers
  getCustomers: async (params?: { status?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }
    return apiCall<any[]>(`/admin/customers?${searchParams.toString()}`)
  },

  updateCustomer: async (data: any) => {
    return apiCall<any>('/admin/customers', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteCustomer: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/customers?id=${id}`, {
      method: 'DELETE'
    })
  },

  // Bookings
  getBookings: async (params?: { status?: string; bordellId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }
    return apiCall<any[]>(`/admin/bookings?${searchParams.toString()}`)
  },

  updateBooking: async (data: any) => {
    return apiCall<any>('/admin/bookings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Reviews
  getReviews: async (params?: { status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    return apiCall<any[]>(`/admin/reviews?${searchParams.toString()}`)
  },

  updateReview: async (data: any) => {
    return apiCall<any>('/admin/reviews', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  deleteReview: async (id: string) => {
    return apiCall<{ success: boolean }>(`/admin/reviews?id=${id}`, {
      method: 'DELETE'
    })
  }
}

// ============ SEED API ============
export const seedApi = {
  seed: async () => {
    return apiCall<{ success: boolean; message: string; data: any }>('/seed', {
      method: 'POST'
    })
  }
}
