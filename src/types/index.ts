export type View = 'home' | 'city' | 'detail'

export interface SearchParams {
  query: string
  city?: string
}

export type BordellType = 'laufhaus' | 'bordell' | 'fkk' | 'studio' | 'privat'
export type BordellStatus = 'active' | 'inactive' | 'pending' | 'suspended'
export type CustomerStatus = 'active' | 'inactive' | 'banned'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type PremiumPlan = 'basic' | 'premium' | 'sponsored'

export interface Bordell {
  id: string; name: string; type: BordellType; location: string; city: string; distance: string
  rating: number; reviewCount: number; priceRange: string; minPrice: number; maxPrice?: number
  ladiesCount: number; services: string[]; isOpen: boolean; openHours: string
  verified: boolean; premium: boolean; premiumExpiry?: string; sponsored: boolean; sponsoredExpiry?: string
  phone: string; email?: string; website?: string; description: string
  detailContent?: PublicEstablishment['detailContent']
  coverImage?: string; images?: string[]; availableSlots?: string[]
  createdAt: string; updatedAt: string; views: number; bookings: number; revenue: number
  status: BordellStatus; ownerId?: string
}

export interface UserAddress { id: string; label: string; street: string; city: string; zip: string; country: string; isDefault: boolean }
export interface UserVisit { id: string; bordellId: string; bordellName: string; date: string; duration: number; price: number; rating?: number }

export interface Customer {
  id: string; name: string; email: string; phone?: string; avatar?: string; memberSince: string
  premium: boolean; premiumExpiry?: string; premiumPlan?: PremiumPlan
  totalVisits: number; totalSpent: number; favoriteCity: string
  status: CustomerStatus; lastLogin: string; badges: string[]; addresses: UserAddress[]; visits: UserVisit[]; notes?: string
}

export interface Booking {
  id: string; customerId: string; customerName: string; customerEmail: string
  bordellId: string; bordellName: string; date: string; time: string
  duration: number; price: number; status: BookingStatus; paymentStatus: PaymentStatus
  createdAt: string; notes?: string; rating?: number; review?: string
}

export interface Review {
  id: string; customerId: string; customerName: string; bordellId: string; bordellName: string
  rating: number; title: string; content: string; date: string
  status: ReviewStatus; response?: string; respondedAt?: string
}

export interface Badge { id: string; name: string; description: string; icon: string; color: string; createdAt: string }
export interface User { id: string; name: string; email: string; role: 'customer' | 'owner' | 'admin'; avatar?: string }
export interface Category { id: string; name: string; icon: React.ReactNode; count: number }
export interface City { name: string; count: number }

export interface Translations {
  nav: { home: string; discover: string; cities: string; premium: string; advertise: string; login: string; register: string; myAccount: string }
  hero: {
    eyebrow: string
    titleLine1Start: string
    titleLine1Accent: string
    titleLine1End: string
    titleLine2Start: string
    titleLine2Accent: string
    description: string
    selectCity: string
    selectCategory: string
    search: string
    slideLabel: string
    sliderControls: string
    pauseSlider: string
    playSlider: string
  }
  stats: { establishments: string; ladies: string; rating: string; verified: string }
  categories: { title: string; subtitle: string; badge?: string; discover?: string }
  cities: { title: string; subtitle: string }
}


export interface PublicEstablishment {
  slug: string
  name: string
  city: string
  type: string
  description: string | null
  detailContent?: {
    aboutText: string | null
    servicesText: string | null
    ladiesAtmosphereText: string | null
    faq: Array<{
      question: string
      answer: string
    }>
  } | null
  image?: string | null
  images: string[]
  rating: number | null
  reviewCount: number
  priceMin: number | null
  priceMax: number | null
  tags: string[]
  verified: boolean
  lat: number | null
  lng: number | null
  openingHours: Record<string, string>
  isActive?: boolean
  phone?: string
  email?: string
  website?: string
}

export interface PublicCity {
  id: number
  cityId?: number
  slug: string
  name: string
  venueCount?: number
  image?: string | null
  latitude?: number | null
  longitude?: number | null
  subtitle?: Record<string, string | null>
  description?: Record<string, string | null>
  seoTitle?: Record<string, string | null>
  seoDescription?: Record<string, string | null>
  isActive?: boolean
  sortOrder?: number | null
}

export interface PublicServiceType {
  id: number
  slug: string
  name: string
  venueCount?: number
}

export interface PublicHeroSlide {
  imageUrl: string
  altText?: string | null
  sortOrder?: number | null
  isActive?: boolean
  updatedAt?: string | null
  updatedBy?: string | null
}
