export interface DashboardUser {
  id: string
  name: string
  email: string
  avatar?: string
  memberSince: string
  premium: boolean
  totalVisits: number
  favoriteCity: string
}

export interface DashboardVisit {
  id: string
  bordellId: string
  bordellName: string
  date: string
  time: string
  duration: string
  price: number
  rating?: number
  city: string
}

export interface DashboardAddress {
  id: string
  title: string
  address: string
  city: string
  postalCode: string
  isDefault: boolean
  notes?: string
}

export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: string
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
}

export interface Activity {
  id: string
  title: string
  description: string
  city: string
  date: string
  type: 'event' | 'discount' | 'new' | 'special'
}

export interface AdminBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: string
  type: 'visits' | 'city' | 'category' | 'special'
  reward?: string
  active: boolean
  createdAt: string
}

export interface AdminInvoice {
  id: string
  customerId: string
  customerName: string
  type: 'booking' | 'premium' | 'advertising'
  amount: number
  tax: number
  total: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidAt?: string
  description: string
  createdAt: string
}
