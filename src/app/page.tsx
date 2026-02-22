'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Star,
  Clock,
  Calendar,
  Heart,
  Menu,
  X,
  ChevronRight,
  Phone,
  Shield,
  Users,
  Sparkles,
  Building2,
  Flame,
  Crown,
  Gem,
  LogIn,
  Eye,
  BadgeEuro,
  TrendingUp,
  Zap,
  Bell,
  Check,
  ArrowRight,
  Percent,
  Filter,
  ChevronDown,
  ArrowLeft,
  Share2,
  MessageCircle,
  Globe,
  User,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Types
type View = 'home' | 'city' | 'detail' | 'login' | 'dashboard' | 'admin'
type DashboardTab = 'dashboard' | 'visits' | 'addresses' | 'badges'
type AdminTab = 'dashboard' | 'establishments' | 'customers' | 'bookings' | 'reviews' | 'badges' | 'invoices' | 'settings'

interface Bordell {
  id: string
  name: string
  type: 'laufhaus' | 'bordell' | 'fkk' | 'studio' | 'privat'
  location: string
  city: string
  distance: string
  rating: number
  reviewCount: number
  priceRange: string
  minPrice: number
  maxPrice?: number
  ladiesCount: number
  services: string[]
  isOpen: boolean
  openHours: string
  verified: boolean
  premium: boolean
  premiumExpiry?: string
  sponsored: boolean
  sponsoredExpiry?: string
  phone: string
  email?: string
  website?: string
  description: string
  coverImage?: string
  images?: string[]
  availableSlots?: string[]
  createdAt: string
  updatedAt: string
  views: number
  bookings: number
  revenue: number
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  ownerId?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  memberSince: string
  premium: boolean
  premiumExpiry?: string
  premiumPlan?: 'basic' | 'premium' | 'sponsored'
  totalVisits: number
  totalSpent: number
  favoriteCity: string
  status: 'active' | 'inactive' | 'banned'
  lastLogin: string
  badges: string[]
  addresses: UserAddress[]
  visits: UserVisit[]
  notes?: string
}

interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  bordellId: string
  bordellName: string
  date: string
  time: string
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  notes?: string
  rating?: number
  review?: string
}

interface Review {
  id: string
  customerId: string
  customerName: string
  bordellId: string
  bordellName: string
  rating: number
  title: string
  content: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  response?: string
  respondedAt?: string
}

interface AdminBadge {
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

interface AdminInvoice {
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

interface UserVisit {
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

interface UserAddress {
  id: string
  title: string
  address: string
  city: string
  postalCode: string
  isDefault: boolean
  notes?: string
}

interface Badge {
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

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  memberSince: string
  premium: boolean
  totalVisits: number
  favoriteCity: string
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
}

interface Activity {
  id: string
  title: string
  description: string
  city: string
  date: string
  type: 'event' | 'discount' | 'new' | 'special'
}

// Mock Data
const bordells: Bordell[] = [
  { id: '1', name: 'Artemis', type: 'fkk', location: 'Halensee, Berlin', city: 'Berlin', distance: '3.2 km', rating: 4.8, reviewCount: 1247, priceRange: '€80 - €150', minPrice: 80, maxPrice: 150, ladiesCount: 45, services: ['Wellness', 'Sauna', 'Bar'], isOpen: true, openHours: '11:00 - 05:00', verified: true, premium: true, premiumExpiry: '2024-12-31', sponsored: true, sponsoredExpiry: '2024-06-30', phone: '+49 30 123456', email: 'info@artemis.de', website: 'www.artemis.de', description: 'Berlins größtes FKK Club mit exklusivem Wellness-Bereich, mehreren Saunen und einer eleganten Bar. Diskretes Ambiente mit höchsten Standards.', coverImage: '/covers/artemis-bg.jpg', availableSlots: ['14:00', '16:00', '20:00'], createdAt: '2023-01-15', updatedAt: '2024-01-10', views: 15420, bookings: 892, revenue: 89500, status: 'active' },
  { id: '2', name: 'Pascha', type: 'laufhaus', location: 'Nippes, Köln', city: 'Köln', distance: '1.8 km', rating: 4.6, reviewCount: 892, priceRange: '€30 - €100', minPrice: 30, maxPrice: 100, ladiesCount: 120, services: ['7 Etagen', 'Bar', '24h'], isOpen: true, openHours: '24 Stunden', verified: true, premium: true, premiumExpiry: '2024-12-31', sponsored: true, sponsoredExpiry: '2024-12-31', phone: '+49 221 123456', email: 'contact@pascha.de', website: 'www.pascha.de', description: 'Europas größtes Laufhaus mit 7 Etagen und über 120 Damen. 24 Stunden geöffnet, perfekte Erreichbarkeit im Zentrum von Köln.', coverImage: '/covers/pascha-bg.jpg', availableSlots: ['Jederzeit'], createdAt: '2022-06-01', updatedAt: '2024-01-15', views: 28500, bookings: 1420, revenue: 156000, status: 'active' },
  { id: '3', name: 'Café del Sol', type: 'bordell', location: 'St. Georg, Hamburg', city: 'Hamburg', distance: '2.1 km', rating: 4.5, reviewCount: 423, priceRange: '€50 - €120', minPrice: 50, maxPrice: 120, ladiesCount: 25, services: ['Diskret', 'Bar', 'Privatzimmer'], isOpen: true, openHours: '14:00 - 04:00', verified: true, premium: false, sponsored: false, phone: '+49 40 123456', email: 'info@cafedelsol.de', description: 'Exklusives Bordell in Hamburg mit diskreter Atmosphäre, privaten Zimmern und einer gemütlichen Bar.', coverImage: '/covers/cafe-del-sol-bg.jpg', availableSlots: ['15:00', '19:00', '21:00'], createdAt: '2023-03-20', updatedAt: '2024-01-12', views: 8200, bookings: 345, revenue: 42000, status: 'active' },
  { id: '4', name: 'Paradise', type: 'fkk', location: 'Feuerbach, Stuttgart', city: 'Stuttgart', distance: '4.5 km', rating: 4.7, reviewCount: 678, priceRange: '€60 - €140', minPrice: 60, maxPrice: 140, ladiesCount: 35, services: ['Sauna', 'Pool', 'Garten'], isOpen: true, openHours: '12:00 - 05:00', verified: true, premium: true, premiumExpiry: '2024-09-30', sponsored: false, phone: '+49 711 123456', email: 'info@paradise-fkk.de', website: 'www.paradise-fkk.de', description: 'Premium FKK Club in Stuttgart mit großzügigem Außenbereich, Pool und entspannter Gartenlandschaft.', coverImage: '/covers/paradise-bg.jpg', availableSlots: ['13:00', '17:00', '21:00'], createdAt: '2022-11-10', updatedAt: '2024-01-08', views: 12100, bookings: 567, revenue: 68000, status: 'active' },
  { id: '5', name: 'Royal', type: 'laufhaus', location: 'Schwanthalerhöhe, München', city: 'München', distance: '2.8 km', rating: 4.4, reviewCount: 312, priceRange: '€40 - €90', minPrice: 40, maxPrice: 90, ladiesCount: 40, services: ['3 Etagen', 'Bar'], isOpen: false, openHours: '16:00 - 04:00', verified: true, premium: false, sponsored: false, phone: '+49 89 123456', email: 'royal@muenchen.de', description: 'Zentrales Laufhaus in München mit 3 Etagen und einer einladenden Bar. Perfekte Lage im lebendigen Schwanthalerhöhe Viertel.', coverImage: '/covers/royal-bg.jpg', availableSlots: ['17:00', '21:00'], createdAt: '2023-05-15', updatedAt: '2024-01-05', views: 6800, bookings: 234, revenue: 28000, status: 'inactive' },
  { id: '6', name: 'Diamond', type: 'bordell', location: 'Bahnhofsviertel, Frankfurt', city: 'Frankfurt', distance: '0.5 km', rating: 4.6, reviewCount: 534, priceRange: '€50 - €130', minPrice: 50, maxPrice: 130, ladiesCount: 18, services: ['VIP Suiten', 'Diskret'], isOpen: true, openHours: '10:00 - 05:00', verified: true, premium: true, premiumExpiry: '2024-08-15', sponsored: true, sponsoredExpiry: '2024-03-31', phone: '+49 69 123456', email: 'vip@diamond-ffm.de', website: 'www.diamond-ffm.de', description: 'Exklusives Ambiente im Herzen von Frankfurt. VIP Suiten mit höchstem Komfort und absoluter Diskretion.', coverImage: '/covers/diamond-bg.jpg', availableSlots: ['12:00', '16:00', '20:00'], createdAt: '2022-08-20', updatedAt: '2024-01-14', views: 9500, bookings: 412, revenue: 52000, status: 'active' }
]

const germanCities = [
  { name: 'Berlin', count: 124 },
  { name: 'Hamburg', count: 87 },
  { name: 'München', count: 54 },
  { name: 'Köln', count: 92 },
  { name: 'Frankfurt', count: 68 },
  { name: 'Düsseldorf', count: 48 },
  { name: 'Stuttgart', count: 42 },
  { name: 'Nürnberg', count: 35 }
]

const categories = [
  { id: 'fkk', name: 'FKK Clubs', icon: <Flame className="w-5 h-5" />, count: 198 },
  { id: 'laufhaus', name: 'Laufhaus', icon: <Building2 className="w-5 h-5" />, count: 234 },
  { id: 'bordell', name: 'Bordelle', icon: <Crown className="w-5 h-5" />, count: 156 },
  { id: 'studio', name: 'Studios', icon: <Gem className="w-5 h-5" />, count: 183 },
  { id: 'privat', name: 'Privat', icon: <Shield className="w-5 h-5" />, count: 76 }
]

const mockUser: User = {
  id: '1',
  name: 'Max Mustermann',
  email: 'max@example.com',
  memberSince: 'Januar 2024',
  premium: true,
  totalVisits: 23,
  favoriteCity: 'Hamburg'
}

const mockVisits: UserVisit[] = [
  { id: '1', bordellId: '3', bordellName: 'Café del Sol', date: '2024-01-15', time: '20:00', duration: '1 Stunde', price: 120, rating: 5, city: 'Hamburg' },
  { id: '2', bordellId: '1', bordellName: 'Artemis', date: '2024-01-10', time: '18:00', duration: '2 Stunden', price: 200, rating: 4, city: 'Berlin' },
  { id: '3', bordellId: '3', bordellName: 'Café del Sol', date: '2024-01-05', time: '21:00', duration: '1 Stunde', price: 100, city: 'Hamburg' },
  { id: '4', bordellId: '6', bordellName: 'Diamond', date: '2023-12-28', time: '19:00', duration: '1.5 Stunden', price: 180, rating: 5, city: 'Frankfurt' },
  { id: '5', bordellId: '3', bordellName: 'Café del Sol', date: '2023-12-20', time: '22:00', duration: '1 Stunde', price: 110, city: 'Hamburg' },
]

const mockAddresses: UserAddress[] = [
  { id: '1', title: 'Zuhause', address: 'Mönckebergstraße 42', city: 'Hamburg', postalCode: '20095', isDefault: true, notes: '3. Stock, linke Tür' },
  { id: '2', title: 'Büro', address: 'Jungfernstieg 12', city: 'Hamburg', postalCode: '20354', isDefault: false },
]

const mockBadges: Badge[] = [
  { id: '1', name: 'Hamburg\'s Muhtarı', description: 'Hamburg\'da 10+ ziyaret gerçekleştirdin!', icon: '🏛️', color: 'from-amber-500 to-orange-600', requirement: '10 Hamburg ziyareti', progress: 12, maxProgress: 10, unlocked: true, unlockedAt: '15.01.2024' },
  { id: '2', name: 'Gece Kuşu', description: 'Gece 22:00 sonrası 10 ziyaret.', icon: '🦉', color: 'from-indigo-500 to-purple-600', requirement: '10 gece ziyareti', progress: 8, maxProgress: 10, unlocked: false },
  { id: '3', name: 'FKK Aşığı', description: '5+ FKK Club ziyareti.', icon: '🔥', color: 'from-red-500 to-pink-600', requirement: '5 FKK ziyareti', progress: 3, maxProgress: 5, unlocked: false },
  { id: '4', name: 'İlk Adım', description: 'İlk ziyaretini tamamladın!', icon: '🎯', color: 'from-green-500 to-emerald-600', requirement: '1 ziyaret', progress: 1, maxProgress: 1, unlocked: true, unlockedAt: '20.12.2023' },
  { id: '5', name: 'Vip Üye', description: 'Premium üyelik satın aldın.', icon: '👑', color: 'from-yellow-500 to-amber-600', requirement: 'Premium üyelik', progress: 1, maxProgress: 1, unlocked: true, unlockedAt: '01.01.2024' },
]

const mockInvoices: Invoice[] = [
  { id: 'INV-001', date: '15.01.2024', amount: 120, status: 'paid', description: 'Café del Sol - Hamburg' },
  { id: 'INV-002', date: '10.01.2024', amount: 200, status: 'paid', description: 'Artemis - Berlin' },
  { id: 'INV-003', date: '01.01.2024', amount: 49.99, status: 'paid', description: 'Premium Mitgliedschaft' },
  { id: 'INV-004', date: '28.12.2023', amount: 180, status: 'paid', description: 'Diamond - Frankfurt' },
]

const mockActivities: Activity[] = [
  { id: '1', title: 'Neue Damen bei Artemis', description: '5 neue Ladies diese Woche vorgestellt', city: 'Berlin', date: 'Heute', type: 'new' },
  { id: '2', title: 'Happy Hour im Pascha', description: '20% Rabatt zwischen 14-18 Uhr', city: 'Köln', date: 'Wochenende', type: 'discount' },
  { id: '3', title: 'Spezielle Event Nacht', description: 'Themenabend mit besonderen Angeboten', city: 'Hamburg', date: 'Samstag', type: 'event' },
  { id: '4', title: 'Neuer FKK Club eröffnet', description: 'Wellness Paradise jetzt in Stuttgart', city: 'Stuttgart', date: 'Diese Woche', type: 'special' },
]

// Admin Mock Data
const adminCustomers: Customer[] = [
  { id: '1', name: 'Max Mustermann', email: 'max@example.com', phone: '+49 170 123456', memberSince: 'Januar 2024', premium: true, premiumExpiry: '2024-12-31', premiumPlan: 'premium', totalVisits: 23, totalSpent: 2840, favoriteCity: 'Hamburg', status: 'active', lastLogin: '2024-01-18 14:32', badges: ['1', '4', '5'], addresses: mockAddresses, visits: mockVisits },
  { id: '2', name: 'Thomas Müller', email: 'thomas@example.com', phone: '+49 171 654321', memberSince: 'Dezember 2023', premium: false, totalVisits: 8, totalSpent: 920, favoriteCity: 'Berlin', status: 'active', lastLogin: '2024-01-17 09:15', badges: ['4'], addresses: [], visits: [] },
  { id: '3', name: 'Hans Schmidt', email: 'hans@example.com', phone: '+49 172 111222', memberSince: 'November 2023', premium: true, premiumExpiry: '2024-06-30', premiumPlan: 'basic', totalVisits: 45, totalSpent: 5200, favoriteCity: 'Köln', status: 'active', lastLogin: '2024-01-18 20:45', badges: ['1', '4', '5', '2'], addresses: [], visits: [] },
  { id: '4', name: 'Peter Weber', email: 'peter@example.com', memberSince: 'Oktober 2023', premium: false, totalVisits: 3, totalSpent: 350, favoriteCity: 'Frankfurt', status: 'inactive', lastLogin: '2023-12-15 16:20', badges: ['4'], addresses: [], visits: [] },
  { id: '5', name: 'Klaus Fischer', email: 'klaus@example.com', phone: '+49 173 333444', memberSince: 'September 2023', premium: false, totalVisits: 1, totalSpent: 80, favoriteCity: 'München', status: 'banned', lastLogin: '2023-11-20 22:00', badges: [], addresses: [], visits: [], notes: 'Mißbrauch gemeldet - Account gesperrt' },
]

const adminBookings: Booking[] = [
  { id: 'B001', customerId: '1', customerName: 'Max Mustermann', customerEmail: 'max@example.com', bordellId: '3', bordellName: 'Café del Sol', date: '2024-01-20', time: '20:00', duration: 60, price: 120, status: 'confirmed', paymentStatus: 'paid', createdAt: '2024-01-18', notes: 'Stammgast' },
  { id: 'B002', customerId: '2', customerName: 'Thomas Müller', customerEmail: 'thomas@example.com', bordellId: '1', bordellName: 'Artemis', date: '2024-01-19', time: '18:00', duration: 120, price: 200, status: 'pending', paymentStatus: 'pending', createdAt: '2024-01-18' },
  { id: 'B003', customerId: '3', customerName: 'Hans Schmidt', customerEmail: 'hans@example.com', bordellId: '2', bordellName: 'Pascha', date: '2024-01-18', time: '22:00', duration: 60, price: 80, status: 'completed', paymentStatus: 'paid', createdAt: '2024-01-17', rating: 5, review: 'Ausgezeichneter Service!' },
  { id: 'B004', customerId: '1', customerName: 'Max Mustermann', customerEmail: 'max@example.com', bordellId: '6', bordellName: 'Diamond', date: '2024-01-15', time: '19:00', duration: 90, price: 150, status: 'completed', paymentStatus: 'paid', createdAt: '2024-01-14' },
  { id: 'B005', customerId: '4', customerName: 'Peter Weber', customerEmail: 'peter@example.com', bordellId: '4', bordellName: 'Paradise', date: '2024-01-16', time: '14:00', duration: 60, price: 100, status: 'no_show', paymentStatus: 'refunded', createdAt: '2024-01-15', notes: 'Nicht erschienen' },
]

const adminReviews: Review[] = [
  { id: 'R001', customerId: '1', customerName: 'Max Mustermann', bordellId: '3', bordellName: 'Café del Sol', rating: 5, title: 'Perfekter Abend!', content: 'Sehr diskret und professionell. Kann ich nur empfehlen!', date: '2024-01-16', status: 'approved', response: 'Vielen Dank für Ihre Bewertung!', respondedAt: '2024-01-17' },
  { id: 'R002', customerId: '3', customerName: 'Hans Schmidt', bordellId: '2', bordellName: 'Pascha', rating: 5, title: 'Größtes und Bestes', content: 'Die Auswahl ist riesig, Qualität top!', date: '2024-01-18', status: 'approved' },
  { id: 'R003', customerId: '2', customerName: 'Thomas Müller', bordellId: '1', bordellName: 'Artemis', rating: 4, title: 'Guter FKK Club', content: 'Sauna und Pool sind super. Etwas teuer aber es lohnt sich.', date: '2024-01-12', status: 'pending' },
  { id: 'R004', customerId: '4', customerName: 'Peter Weber', bordellId: '4', bordellName: 'Paradise', rating: 2, title: 'Nicht empfehlenswert', content: 'War leider nicht das, was ich erwartet hatte.', date: '2024-01-10', status: 'rejected', response: 'Wir bedauern Ihre Erfahrung und möchten Sie einladen, Kontakt aufzunehmen.', respondedAt: '2024-01-11' },
]

const adminBadges: AdminBadge[] = [
  { id: '1', name: 'Hamburg\'s Muhtarı', description: 'Hamburg\'da 10+ ziyaret', icon: '🏛️', color: 'from-amber-500 to-orange-600', requirement: '10 Hamburg ziyareti', type: 'city', reward: '10% Rabatt in Hamburg', active: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Gece Kuşu', description: 'Gece 22:00 sonrası 10 ziyaret', icon: '🦉', color: 'from-indigo-500 to-purple-600', requirement: '10 gece ziyareti', type: 'special', active: true, createdAt: '2024-01-01' },
  { id: '3', name: 'FKK Aşığı', description: '5+ FKK Club ziyareti', icon: '🔥', color: 'from-red-500 to-pink-600', requirement: '5 FKK ziyareti', type: 'category', reward: 'Freier Eintritt bei Partner-FKK', active: true, createdAt: '2024-01-01' },
  { id: '4', name: 'İlk Adım', description: 'İlk ziyaret', icon: '🎯', color: 'from-green-500 to-emerald-600', requirement: '1 ziyaret', type: 'visits', active: true, createdAt: '2023-12-01' },
  { id: '5', name: 'Vip Üye', description: 'Premium üyelik', icon: '👑', color: 'from-yellow-500 to-amber-600', requirement: 'Premium üyelik', type: 'special', reward: 'Alle Premium-Vorteile', active: true, createdAt: '2023-12-01' },
]

const adminInvoices: AdminInvoice[] = [
  { id: 'INV-2024-001', customerId: '1', customerName: 'Max Mustermann', type: 'booking', amount: 120, tax: 22.80, total: 142.80, status: 'paid', dueDate: '2024-01-20', paidAt: '2024-01-18', description: 'Café del Sol - Hamburg', createdAt: '2024-01-18' },
  { id: 'INV-2024-002', customerId: '2', customerName: 'Thomas Müller', type: 'booking', amount: 200, tax: 38.00, total: 238.00, status: 'pending', dueDate: '2024-01-22', description: 'Artemis - Berlin', createdAt: '2024-01-18' },
  { id: 'INV-2024-003', customerId: '1', customerName: 'Max Mustermann', type: 'premium', amount: 49.99, tax: 9.50, total: 59.49, status: 'paid', dueDate: '2024-01-05', paidAt: '2024-01-01', description: 'Premium Mitgliedschaft - Monatlich', createdAt: '2024-01-01' },
  { id: 'INV-2024-004', customerId: '1', customerName: 'Max Mustermann', type: 'booking', amount: 150, tax: 28.50, total: 178.50, status: 'paid', dueDate: '2024-01-17', paidAt: '2024-01-15', description: 'Diamond - Frankfurt', createdAt: '2024-01-15' },
  { id: 'INV-2024-005', customerId: '3', customerName: 'Hans Schmidt', type: 'premium', amount: 149.99, tax: 28.50, total: 178.49, status: 'overdue', dueDate: '2024-01-10', description: 'Premium Mitgliedschaft - Jährlich', createdAt: '2023-12-20' },
]

// Animation
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Header
function Header({ onLoginClick, isLoggedIn, onDashboardClick }: { onLoginClick: (message?: string) => void; isLoggedIn?: boolean; onDashboardClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-black/90 backdrop-blur-xl py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-wider">DESIREMAP</span>
              <span className="text-gray-500 text-xs">.de</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Entdecken</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Städte</a>
            <button onClick={() => onLoginClick('Sie müssen sich anmelden, um Premium-Funktionen nutzen zu können.')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Premium</button>
            <button onClick={() => onLoginClick('Sie müssen sich anmelden, um ein Werbepaket buchen zu können.')} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Werben</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDashboardClick}
                  className="text-gray-300 hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Mein Konto
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onLoginClick('Sie müssen sich anmelden, um Ihren Betrieb einzutragen.')}
                  className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-full px-5"
                >
                  Eintragen
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onLoginClick()}
                  className="hidden sm:flex text-gray-300 hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Anmelden
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onLoginClick('Sie müssen sich anmelden, um Ihren Betrieb einzutragen.')}
                  className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-full px-5"
                >
                  Eintragen
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-6 pb-4">
              <nav className="flex flex-col gap-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">Entdecken</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">Städte</a>
                <button onClick={() => { setMobileMenuOpen(false); onLoginClick('Sie müssen sich anmelden, um Premium-Funktionen nutzen zu können.'); }} className="text-left text-gray-300 hover:text-white transition-colors py-2">Premium</button>
                <button onClick={() => { setMobileMenuOpen(false); onLoginClick('Sie müssen sich anmelden, um ein Werbepaket buchen zu können.'); }} className="text-left text-gray-300 hover:text-white transition-colors py-2">Werben</button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// Fixed star positions to avoid hydration mismatch
const starPositions = [
  { left: 12, top: 15 }, { left: 25, top: 8 }, { left: 38, top: 22 }, { left: 52, top: 5 },
  { left: 67, top: 18 }, { left: 80, top: 12 }, { left: 92, top: 25 }, { left: 8, top: 42 },
  { left: 22, top: 55 }, { left: 35, top: 38 }, { left: 48, top: 62 }, { left: 62, top: 45 },
  { left: 75, top: 58 }, { left: 88, top: 35 }, { left: 5, top: 72 }, { left: 18, top: 85 },
  { left: 32, top: 68 }, { left: 45, top: 92 }, { left: 58, top: 75 }, { left: 72, top: 88 },
  { left: 85, top: 65 }, { left: 95, top: 82 }, { left: 15, top: 28 }, { left: 28, top: 42 },
  { left: 42, top: 15 }, { left: 55, top: 32 }, { left: 68, top: 48 }, { left: 82, top: 22 },
  { left: 10, top: 58 }, { left: 24, top: 75 }, { left: 38, top: 52 }, { left: 52, top: 85 },
  { left: 65, top: 12 }, { left: 78, top: 42 }, { left: 91, top: 55 }, { left: 3, top: 35 },
  { left: 17, top: 92 }, { left: 30, top: 5 }, { left: 44, top: 48 }, { left: 57, top: 18 }
]

// Hero Section - LUMINA Style
function HeroSection() {
  const [location, setLocation] = useState('')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0a10]/30 to-[#0a0510]/50" />

      {/* Stars/Particles Effect - Fixed positions */}
      <div className="absolute inset-0 overflow-hidden">
        {starPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + (i % 4),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8b1a4a]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#6b3fa0]/20 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider"
          >
            DESIREMAP
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light tracking-wide"
          >
            Where Desire Meets Reality
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Deutschlands führendes Verzeichnis für exklusive Erotik-Clubs, Bordelle und FKK-Saunen. Diskret, verifiziert, elegant.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto pt-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              {/* Location */}
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" />
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full bg-transparent border-0 pl-12 text-white placeholder:text-gray-500 focus:ring-0 h-12">
                    <SelectValue placeholder="Stadt wählen..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a24] border-[#8b1a4a]/20">
                    {germanCities.map((city) => (
                      <SelectItem key={city.name} value={city.name.toLowerCase()} className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">
                        {city.name} ({city.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input */}
              <div className="relative flex-[2]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" />
                <Input
                  placeholder="Suche nach Clubs, Services..."
                  className="bg-transparent border-0 pl-12 text-white placeholder:text-gray-500 focus:ring-0 h-12"
                />
              </div>

              {/* Search Button */}
              <Button className="h-12 px-8 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl">
                <Search className="w-5 h-5 mr-2" />
                Suchen
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            {[
              { icon: <Building2 />, value: '847+', label: 'Betriebe' },
              { icon: <Users />, value: '12.000+', label: 'Damen' },
              { icon: <Star />, value: '4.6', label: 'Bewertung' },
              { icon: <Shield />, value: '100%', label: 'Verifiziert' }
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#b76e79]">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold text-lg">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 text-sm">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#b76e79]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Categories Section - Redesigned
function CategoriesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle gradient transition from hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0810] to-[#0f0f14]" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#8b1a4a]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#6b3fa0]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[#b76e79] text-sm font-medium tracking-widest uppercase mb-4"
          >
            Kategorien
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nach Kategorie entdecken
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Finde genau das, was du suchst
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.id}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-[#8b1a4a]/40 transition-all duration-500 overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#8b1a4a]/0 to-[#8b1a4a]/0 group-hover:from-[#8b1a4a]/10 group-hover:to-transparent transition-all duration-500" />
                
                {/* Icon */}
                <div className="relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b1a4a]/30 to-[#6b3fa0]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-[#b76e79] group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="relative text-white font-semibold text-lg mb-2 group-hover:text-[#b76e79] transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="relative text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300">
                  {category.count} Betriebe
                </p>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-5 h-5 text-[#b76e79]" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured Cities - Redesigned
function FeaturedCities({ onCityClick }: { onCityClick: (city: string) => void }) {
  return (
    <section className="relative py-24 bg-[#0f0f14] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[300px] h-[300px] bg-[#6b3fa0]/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-[250px] h-[250px] bg-[#8b1a4a]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-[#b76e79] text-sm font-medium tracking-widest uppercase mb-3"
            >
              Standorte
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Beliebte Städte
            </h2>
          </div>
        </motion.div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {germanCities.map((city, index) => (
            <motion.button
              key={city.name}
              onClick={() => onCityClick(city.name)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group relative text-left"
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-[#8b1a4a]/30 transition-all duration-300 overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b1a4a]/0 to-transparent group-hover:from-[#8b1a4a]/5 transition-all duration-300" />
                
                <div className="relative flex items-center gap-4">
                  {/* City Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center group-hover:from-[#8b1a4a]/30 group-hover:to-[#6b3fa0]/30 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-[#b76e79]" />
                  </div>
                  
                  {/* City Info */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg group-hover:text-[#b76e79] transition-colors duration-300">
                      {city.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {city.count} Betriebe
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#b76e79] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

// Listing Card
function ListingCard({ bordell, index, onDetailClick }: { bordell: Bordell; index: number; onDetailClick: (bordell: Bordell) => void }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReservation, setShowReservation] = useState(false)

  const typeLabels = { laufhaus: 'Laufhaus', bordell: 'Bordell', fkk: 'FKK Club', studio: 'Studio', privat: 'Privat' }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        {/* Sponsored Badge */}
        {bordell.sponsored && (
          <div className="absolute -top-2 left-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> TOP
            </Badge>
          </div>
        )}

        <div onClick={() => onDetailClick(bordell)} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-[#8b1a4a]/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#8b1a4a]/10 cursor-pointer">
          {/* Image Area */}
          <div className="relative h-56 bg-gradient-to-br from-[#1a1a24] to-[#252533] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-[#8b1a4a]/80 text-white border-0">{typeLabels[bordell.type]}</Badge>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {bordell.premium && <Badge className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
              {bordell.verified && <Badge className="bg-green-500/80 text-white border-0"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
            </div>

            {/* Favorite */}
            <button onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite) }} className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-[#8b1a4a]/50 transition-all">
              <Heart className={cn('w-5 h-5', isFavorite ? 'fill-red-500 text-red-500' : 'text-white')} />
            </button>

            {/* Status */}
            <div className="absolute bottom-4 left-4">
              <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium', bordell.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400')}>
                <div className={cn('w-2 h-2 rounded-full', bordell.isOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400')} />
                {bordell.isOpen ? 'Geöffnet' : 'Geschlossen'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#b76e79] transition-colors">
                  {bordell.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-[#b76e79]" />
                  <span>{bordell.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#b76e79]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{bordell.rating}</span>
                </div>
                <div className="text-gray-500 text-xs">{bordell.reviewCount} Bewertungen</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="w-4 h-4 text-[#b76e79]" />
                <span>{bordell.ladiesCount} Damen</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-4 h-4 text-[#b76e79]" />
                <span>{bordell.openHours}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {bordell.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="outline" className="border-white/10 text-gray-400">{service}</Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <span className="text-gray-500 text-xs">Preis</span>
                <div className="text-[#b76e79] font-bold">{bordell.priceRange}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => setShowReservation(true)} className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0">
                  <Calendar className="w-4 h-4 mr-1" /> Reservieren
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ReservationModal open={showReservation} onOpenChange={setShowReservation} bordell={bordell} />
    </>
  )
}

// Reservation Modal
function ReservationModal({ open, onOpenChange, bordell }: { open: boolean; onOpenChange: (open: boolean) => void; bordell: Bordell | null }) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('30')
  const [autoReserve, setAutoReserve] = useState(false)
  const [isPremium] = useState(false)

  if (!bordell) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#b76e79]" />
            Reservierung
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {bordell.name} • {bordell.location}
          </DialogDescription>
        </DialogHeader>

        {isPremium && (
          <div className="bg-[#8b1a4a]/20 rounded-lg p-3 flex items-center gap-2 border border-[#8b1a4a]/30 text-sm">
            <Crown className="w-4 h-4 text-[#b76e79]" />
            <span className="text-white font-medium">Premium</span>
            <span className="text-gray-400">• Prioritäts-Reservierung aktiv</span>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between my-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all', step >= s ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white' : 'bg-white/5 text-gray-500')}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={cn('w-12 h-0.5 mx-2', step > s ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0]' : 'bg-white/10')} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 block">Datum</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Verfügbare Zeiten</Label>
              <div className="grid grid-cols-3 gap-2">
                {bordell.availableSlots?.map((time) => (
                  <button key={time} onClick={() => setSelectedTime(time)} className={cn('py-2 rounded-lg text-sm font-medium transition-all', selectedTime === time ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10')}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Dauer</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10">
                  <SelectItem value="30" className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">30 Min</SelectItem>
                  <SelectItem value="60" className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">1 Stunde</SelectItem>
                  <SelectItem value="90" className="text-gray-300 focus:bg-[#8b1a4a]/20 focus:text-white">1.5 Stunden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Reservation */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="autoReserve" checked={autoReserve} onChange={(e) => setAutoReserve(e.target.checked)} className="mt-1 rounded bg-white/10 border-white/20" disabled={!isPremium} />
                <div className="flex-1">
                  <Label htmlFor="autoReserve" className={cn('text-sm font-medium flex items-center gap-2', !isPremium && 'text-gray-500')}>
                    <Bell className="w-4 h-4" />
                    Automatische Reservierung
                  </Label>
                  <p className="text-gray-500 text-xs mt-1">
                    {isPremium ? 'Müsaitlik açılınca otomatik rezervasyon' : 'Nur für Premium-Mitglieder'}
                  </p>
                </div>
                {!isPremium && <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30">Premium</Badge>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div><Label className="text-gray-300 mb-2 block">Name</Label><Input placeholder="Ihr Name" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></div>
            <div><Label className="text-gray-300 mb-2 block">E-Mail</Label><Input type="email" placeholder="ihre@email.de" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></div>
            <div><Label className="text-gray-300 mb-2 block">Telefon</Label><Input type="tel" placeholder="+49 ..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Übersicht</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Betrieb</span><span className="text-white">{bordell.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Datum</span><span className="text-white">{selectedDate || 'Heute'}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Uhrzeit</span><span className="text-white">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Dauer</span><span className="text-white">{duration} Min</span></div>
                <Separator className="bg-white/10 my-2" />
                <div className="flex justify-between font-medium"><span className="text-gray-300">Preis ca.</span><span className="text-[#b76e79]">{bordell.priceRange}</span></div>
              </div>
            </div>

            {autoReserve && (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg p-3">
                <Bell className="w-4 h-4" />
                Automatische Reservierung aktiv
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4 text-[#b76e79] mt-0.5 flex-shrink-0" />
              <p>Diskrete Abrechnung. Stornierung bis 2h vorher kostenlos.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">Zurück</Button>}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="flex-1 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0">
              Weiter <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => onOpenChange(false)} className="flex-1 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0">
              <Check className="w-4 h-4 mr-2" /> Reservieren
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Listings Section - Redesigned
function ListingsSection({ onDetailClick }: { onDetailClick: (bordell: Bordell) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredBordells = bordells.filter((bordell) => {
    if (!selectedCategory) return true
    return bordell.type === selectedCategory
  })

  const sortedBordells = [...filteredBordells].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    if (a.premium && !b.premium) return -1
    if (!a.premium && b.premium) return 1
    return 0
  })

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b1a4a]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6b3fa0]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[#b76e79] text-sm font-medium tracking-widest uppercase mb-3"
          >
            Empfehlungen
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ausgewählte Betriebe
          </h2>
          <p className="text-gray-400 text-lg">
            {sortedBordells.length} verifizierte Betriebe
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <Button
            onClick={() => setSelectedCategory(null)}
            size="sm"
            variant={selectedCategory === null ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-5',
              selectedCategory === null
                ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0'
                : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
            )}
          >
            Alle
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              size="sm"
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className={cn(
                'rounded-full px-5',
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0'
                  : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              {cat.name}
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBordells.map((bordell, index) => (
            <ListingCard key={bordell.id} bordell={bordell} index={index} onDetailClick={onDetailClick} />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 px-10 rounded-full group"
          >
            Mehr anzeigen
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Premium Section
function PremiumSection({ onLoginRequired }: { onLoginRequired: (message: string) => void }) {
  return (
    <section id="premium" className="py-20 bg-gradient-to-b from-[#0a0a0f] to-[#150a15]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0]" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              <Crown className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Mitgliedschaft
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Prioritäts-Reservierung, automatische Buchung bei Verfügbarkeit, und exklusive Rabatte bei Partner-Shops.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {[
                { icon: <Zap className="w-6 h-6" />, text: 'Reservierungspriorität' },
                { icon: <Bell className="w-6 h-6" />, text: 'Auto-Booking' },
                { icon: <Percent className="w-6 h-6" />, text: '25% Rabatt' },
                { icon: <Eye className="w-6 h-6" />, text: 'Exklusiver Inhalt' }
              ].map((benefit) => (
                <div key={benefit.text} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-white mb-2 flex justify-center">{benefit.icon}</div>
                  <div className="text-white text-sm">{benefit.text}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onLoginRequired('Sie müssen sich anmelden, um Premium-Funktionen nutzen zu können.')}
                className="bg-white text-[#8b1a4a] hover:bg-white/90 px-8 rounded-full"
              >
                Jetzt Premium werden <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Advertising Section
function AdvertisingSection({ onLoginRequired }: { onLoginRequired: (message: string) => void }) {
  const plans = [
    { name: 'Basic', price: '€49', features: ['Profilseite', 'Kontaktdaten', '5 Fotos'], popular: false },
    { name: 'Premium', price: '€149', features: ['Top Platzierung', 'Unbegrenzte Fotos', 'Verifiziert Badge', 'Reservierungssystem'], popular: true },
    { name: 'Sponsored', price: '€299', features: ['Homepage Featured', 'Top Anzeige Badge', 'Statistiken', 'Priority Support'], popular: false }
  ]

  return (
    <section id="werbung" className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30 mb-4">
            <TrendingUp className="w-3 h-3 mr-1" /> Für Betriebe
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-4">Werben auf DesireMap.de</h2>
          <p className="text-gray-400">Tausende potenzielle Kunden täglich erreichen</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                'relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border transition-all',
                plan.popular ? 'border-[#8b1a4a]/50 ring-2 ring-[#8b1a4a]/20' : 'border-white/5'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0">Beliebt</Badge>
                </div>
              )}
              <h3 className="text-white font-semibold text-xl mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mb-4">{plan.price}<span className="text-base font-normal text-gray-400">/Monat</span></div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-green-400" /> {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => onLoginRequired('Sie müssen sich anmelden, um ein Werbepaket buchen zu können.')}
                className={cn('w-full', plan.popular ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10')}
              >
                Auswählen
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// City Page
function CityPage({ city, onBack, onSelectBordell }: { city: string; onBack: () => void; onSelectBordell: (bordell: Bordell) => void }) {
  const cityBordells = bordells.filter((b) => b.city === city)
  const cityData = germanCities.find((c) => c.name === city)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBordells = cityBordells.filter((b) => {
    const matchesCategory = !selectedCategory || b.type === selectedCategory
    const matchesSearch = !searchQuery || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-24"
    >
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b1a4a]/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8b1a4a]/10 rounded-full blur-[150px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zur Startseite
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white">{city}</h1>
                <p className="text-gray-400">{cityData?.count || cityBordells.length} Betriebe</p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b76e79]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`In ${city} suchen...`}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 h-14 text-white placeholder:text-gray-500 focus:ring-0 focus:border-[#8b1a4a]/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              onClick={() => setSelectedCategory(null)}
              size="sm"
              variant={selectedCategory === null ? 'default' : 'outline'}
              className={cn(
                'rounded-full px-5',
                selectedCategory === null
                  ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0'
                  : 'border-white/10 text-gray-300 hover:bg-white/5'
              )}
            >
              Alle
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className={cn(
                  'rounded-full px-5',
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0'
                    : 'border-white/10 text-gray-300 hover:bg-white/5'
                )}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-gray-400 mb-6">{filteredBordells.length} Betriebe gefunden</p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBordells.map((bordell, index) => (
              <ListingCard key={bordell.id} bordell={bordell} index={index} onDetailClick={onSelectBordell} />
            ))}
          </div>

          {filteredBordells.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">Keine Betriebe gefunden.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

// Detail Page
function DetailPage({ bordell, onBack }: { bordell: Bordell; onBack: () => void }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const typeLabels: Record<string, string> = { laufhaus: 'Laufhaus', bordell: 'Bordell', fkk: 'FKK Club', studio: 'Studio', privat: 'Privat' }

  // Similar places in same city
  const similarPlaces = bordells.filter((b) => b.city === bordell.city && b.id !== bordell.id).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      {/* Hero with Blurred Background */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Blurred Background Image - Admin panelinden yönetilebilir */}
        <div className="absolute inset-0">
          <img
            src={bordell.coverImage || "/hero-bg.jpg"}
            alt=""
            className="w-full h-full object-cover blur-xl scale-110 opacity-60"
            onError={(e) => {
              // Eğer özel görsel yoksa varsayılan görseli kullan
              (e.target as HTMLImageElement).src = "/hero-bg.jpg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </motion.button>

          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-2 gap-12 items-end"
          >
            {/* Left - Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#8b1a4a]/80 text-white border-0">{typeLabels[bordell.type]}</Badge>
                {bordell.premium && (
                  <Badge className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                )}
                {bordell.verified && (
                  <Badge className="bg-green-500/80 text-white border-0">
                    <Check className="w-3 h-3 mr-1" /> Verifiziert
                  </Badge>
                )}
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">{bordell.name}</h1>
              
              <div className="flex items-center gap-2 text-gray-300 text-lg mb-6">
                <MapPin className="w-5 h-5 text-[#b76e79]" />
                <span>{bordell.location}</span>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', bordell.isOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400')} />
                  <span className={cn('font-medium', bordell.isOpen ? 'text-green-400' : 'text-gray-400')}>
                    {bordell.isOpen ? 'Geöffnet' : 'Geschlossen'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#b76e79] fill-current" />
                  <span className="text-white font-bold">{bordell.rating}</span>
                  <span className="text-gray-400">({bordell.reviewCount})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-5 h-5 text-[#b76e79]" />
                  <span>{bordell.ladiesCount} Damen</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5 text-[#b76e79]" />
                  <span>{bordell.openHours}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-1">Preis</p>
                <p className="text-4xl font-bold text-[#b76e79]">{bordell.priceRange}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowReservation(true)}
                  className="h-14 px-8 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservierung anfragen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="h-14 px-6 border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  <Heart className={cn('w-5 h-5', isFavorite && 'fill-red-500 text-red-500')} />
                </Button>
                <Button variant="outline" className="h-14 px-6 border-white/20 text-white hover:bg-white/10 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right - Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-[#1a1a24]">
                {/* Map Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#252533]">
                  {/* Grid lines for map effect */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(10)].map((_, i) => (
                      <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 10}%` }} />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 10}%` }} />
                    ))}
                  </div>
                  
                  {/* Location marker */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#8b1a4a]/30 animate-ping absolute -inset-4" />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center relative z-10">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map overlay info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white font-medium">{bordell.name}</p>
                    <p className="text-gray-400 text-sm">{bordell.location}</p>
                  </div>
                </div>

                {/* Open in Maps button */}
                <button className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm hover:bg-black/80 transition-colors flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  In Maps öffnen
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Description & Services */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">Beschreibung</h3>
                <p className="text-gray-400 leading-relaxed">{bordell.description}</p>
              </div>

              {/* Services */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">Services & Ausstattung</h3>
                <div className="flex flex-wrap gap-3">
                  {bordell.services.map((service) => (
                    <Badge key={service} variant="outline" className="border-[#8b1a4a]/30 text-[#b76e79] px-4 py-2 text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Similar Places */}
              {similarPlaces.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-xl font-semibold text-white mb-4">Ähnliche Betriebe in {bordell.city}</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {similarPlaces.map((place) => (
                      <div key={place.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                        <p className="text-white font-medium mb-1">{place.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Star className="w-3 h-3 text-[#b76e79] fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-gradient-to-b from-[#8b1a4a]/10 to-transparent rounded-2xl p-6 border border-[#8b1a4a]/20">
                <h3 className="text-xl font-semibold text-white mb-6">Kontakt</h3>
                
                <div className="space-y-4">
                  <a href={`tel:${bordell.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center group-hover:from-[#8b1a4a]/30 group-hover:to-[#6b3fa0]/30 transition-colors">
                      <Phone className="w-5 h-5 text-[#b76e79]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Telefon</p>
                      <p className="text-white font-medium">{bordell.phone}</p>
                    </div>
                  </a>

                  <a href="#" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center group-hover:from-[#8b1a4a]/30 group-hover:to-[#6b3fa0]/30 transition-colors">
                      <Globe className="w-5 h-5 text-[#b76e79]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Website</p>
                      <p className="text-white font-medium">Website besuchen</p>
                    </div>
                  </a>

                  <a href="#" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center group-hover:from-[#8b1a4a]/30 group-hover:to-[#6b3fa0]/30 transition-colors">
                      <MessageCircle className="w-5 h-5 text-[#b76e79]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Nachricht</p>
                      <p className="text-white font-medium">Direkt kontaktieren</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#b76e79]" />
                  <span className="text-white font-medium">Sicherheit</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Diskrete Abrechnung. Stornierung bis 2h vorher kostenlos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReservationModal open={showReservation} onOpenChange={setShowReservation} bordell={bordell} />
    </motion.div>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">DESIREMAP</span>
                <span className="text-gray-500 text-xs">.de</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Deutschlands führendes Erotik-Verzeichnis</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Kategorien</h4>
            <ul className="space-y-2">
              {['FKK Clubs', 'Laufhäuser', 'Bordelle', 'Studios'].map((link) => (
                <li key={link}><a href="#" className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Städte</h4>
            <ul className="space-y-2">
              {germanCities.slice(0, 4).map((city) => (
                <li key={city.name}><a href="#" className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm">{city.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((link) => (
                <li key={link}><a href="#" className="text-gray-500 hover:text-[#b76e79] transition-colors text-sm">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2024 DesireMap.de - 18+ only</p>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Shield className="w-4 h-4 text-[#b76e79]" />
            SSL-gesichert
          </div>
        </div>
      </div>
    </footer>
  )
}

// Login Page
function LoginPage({ onBack, loginMessage, onLogin, onAdminLogin }: { onBack: () => void; loginMessage?: string; onLogin: () => void; onAdminLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-24 pb-12"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8b1a4a]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#6b3fa0]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück zur Startseite
        </motion.button>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Melden Sie sich an, um fortzufahren' : 'Registrieren Sie sich für Premium-Zugang'}
            </p>
          </div>

          {/* Warning Message */}
          {loginMessage && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-[#8b1a4a]/10 border border-[#8b1a4a]/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#b76e79] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{loginMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-8">
            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <Label className="text-gray-300 text-sm mb-2 block">Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ihr Name"
                      className="bg-white/5 border-white/10 pl-12 h-12 text-white placeholder:text-gray-500 focus:border-[#8b1a4a]/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-gray-300 text-sm mb-2 block">E-Mail</Label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihre@email.de"
                    className="bg-white/5 border-white/10 pl-12 h-12 text-white placeholder:text-gray-500 focus:border-[#8b1a4a]/50"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-sm mb-2 block">Passwort</Label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 pl-12 pr-12 h-12 text-white placeholder:text-gray-500 focus:border-[#8b1a4a]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5 opacity-50" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                    Angemeldet bleiben
                  </label>
                  <a href="#" className="text-[#b76e79] hover:text-[#d48a9a] transition-colors">
                    Passwort vergessen?
                  </a>
                </div>
              )}

              <Button onClick={onLogin} className="w-full h-12 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-base">
                {isLogin ? 'Anmelden' : 'Registrieren'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0f0f14] text-gray-500">oder</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" onClick={onLogin} className="w-full h-12 border-white/10 text-white hover:bg-white/5 rounded-xl">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Mit Google fortfahren
              </Button>
            </div>

            {/* Toggle Login/Register */}
            <p className="text-center text-gray-400 text-sm mt-6">
              {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#b76e79] hover:text-[#d48a9a] transition-colors font-medium"
              >
                {isLogin ? 'Registrieren' : 'Anmelden'}
              </button>
            </p>

            {/* Admin Link - Hidden */}
            <p className="text-center mt-4">
              <button
                onClick={onAdminLogin}
                className="text-gray-600 hover:text-gray-500 transition-colors text-xs"
              >
                Admin
              </button>
            </p>
          </div>
        </motion.div>

        {/* Premium Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-b from-[#8b1a4a]/10 to-transparent border border-[#8b1a4a]/20"
        >
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#b76e79]" />
            Premium Vorteile
          </h3>
          <ul className="space-y-3">
            {[
              'Reservierungspriorität',
              'Automatische Reservierung',
              '25% Rabatt auf alle Buchungen',
              'Exklusiver Inhalt'
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Dashboard Page
function DashboardPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sidebarItems = [
    { id: 'dashboard' as const, icon: <Sparkles className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'visits' as const, icon: <Clock className="w-5 h-5" />, label: 'Önceki Ziyaretler' },
    { id: 'addresses' as const, icon: <MapPin className="w-5 h-5" />, label: 'Adreslerim' },
    { id: 'badges' as const, icon: <Crown className="w-5 h-5" />, label: 'Rozetlerim' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0f] flex"
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-[#0f0f14] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-40"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="text-lg font-bold text-white tracking-wider">DESIREMAP</span>
                <span className="text-gray-500 text-xs">.de</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20 text-white border border-[#8b1a4a]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={cn(activeTab === item.id && 'text-[#b76e79]')}>{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user.name}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </motion.div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <LogIn className="w-4 h-4 mr-2 rotate-180" />
              Abmelden
            </Button>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#8b1a4a] flex items-center justify-center text-white hover:bg-[#a8255c] transition-colors"
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform', sidebarOpen && 'rotate-180')} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-[280px]' : 'ml-20')}>
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardHomeTab user={user} />}
          {activeTab === 'visits' && <DashboardVisitsTab />}
          {activeTab === 'addresses' && <DashboardAddressesTab />}
          {activeTab === 'badges' && <DashboardBadgesTab />}
        </div>
      </main>
    </motion.div>
  )
}

// Dashboard Home Tab
function DashboardHomeTab({ user }: { user: User }) {
  const unlockedBadges = mockBadges.filter(b => b.unlocked)
  const recentVisits = mockVisits.slice(0, 3)
  const hamburgActivities = mockActivities.filter(a => a.city === user.favoriteCity)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-400">Hier ist Ihre persönliche Übersicht</p>
        </div>
        {user.premium && (
          <Badge className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" /> Premium Mitglied
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gesamtbesuche', value: user.totalVisits, icon: <Clock className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
          { label: 'Lieblingsstadt', value: user.favoriteCity, icon: <MapPin className="w-5 h-5" />, color: 'from-[#8b1a4a] to-[#6b3fa0]' },
          { label: 'Rozetler', value: `${unlockedBadges.length}/${mockBadges.length}`, icon: <Crown className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
          { label: 'Mitglied seit', value: user.memberSince, icon: <Calendar className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-[#8b1a4a]/30 transition-colors">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', stat.color)}>
              <span className="text-white">{stat.icon}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-white text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visits */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#b76e79]" />
            Son Ziyaretler
          </h3>
          <div className="space-y-3">
            {recentVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#b76e79]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{visit.bordellName}</p>
                    <p className="text-gray-500 text-sm">{visit.city} • {visit.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#b76e79] font-bold">€{visit.price}</p>
                  <p className="text-gray-500 text-xs">{visit.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Preview */}
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#b76e79]" />
            Rozetlerim
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {mockBadges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'aspect-square rounded-xl flex items-center justify-center text-2xl relative overflow-hidden',
                  badge.unlocked 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-white/5 blur-[2px]'
                )}
                title={badge.unlocked ? badge.name : '???'}
              >
                <span className={badge.unlocked ? '' : 'opacity-30 grayscale'}>{badge.icon}</span>
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4 text-center">{unlockedBadges.length} von {mockBadges.length} freigeschaltet</p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Places */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#b76e79]" />
            Önerilen Mekanlar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bordells.slice(0, 3).map((place) => (
              <div key={place.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#8b1a4a]/80 text-white border-0 text-xs">{place.type.toUpperCase()}</Badge>
                  {place.verified && <Check className="w-4 h-4 text-green-400" />}
                </div>
                <h4 className="text-white font-medium group-hover:text-[#b76e79] transition-colors">{place.name}</h4>
                <p className="text-gray-500 text-sm">{place.city}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-[#b76e79] fill-current" />
                  <span className="text-white text-sm font-medium">{place.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity in Favorite City */}
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#b76e79]" />
            {user.favoriteCity} Aktiviteleri
          </h3>
          <div className="space-y-3">
            {hamburgActivities.length > 0 ? hamburgActivities.map((activity) => (
              <div key={activity.id} className="p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn(
                    'text-xs border-0',
                    activity.type === 'discount' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'event' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-amber-500/20 text-amber-400'
                  )}>
                    {activity.type === 'discount' ? 'Rabatt' : activity.type === 'new' ? 'Neu' : activity.type === 'event' ? 'Event' : 'Special'}
                  </Badge>
                  <span className="text-gray-500 text-xs">{activity.date}</span>
                </div>
                <p className="text-white text-sm font-medium">{activity.title}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.description}</p>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">Keine aktuellen Aktivitäten</p>
            )}
          </div>
        </div>
      </div>

      {/* Third Row - Invoices & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <BadgeEuro className="w-5 h-5 text-[#b76e79]" />
            Letzte Rechnungen
          </h3>
          <div className="space-y-3">
            {mockInvoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-white text-sm font-medium">{invoice.description}</p>
                  <p className="text-gray-500 text-xs">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">€{invoice.amount.toFixed(2)}</p>
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                    <Check className="w-3 h-3 mr-1" /> Bezahlt
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#b76e79]" />
            Zahlungsmethoden
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[#8b1a4a]/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-white text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-gray-500 text-xs">Ablauf: 12/26</p>
                </div>
              </div>
              <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30">Standard</Badge>
            </div>
            <button className="w-full p-4 rounded-xl border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">+</span>
              Neue Zahlungsmethode hinzufügen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Visits Tab
function DashboardVisitsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Önceki Ziyaretler</h1>
        <p className="text-gray-400">{mockVisits.length} ziyaret toplam</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Mekan</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Stadt</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Datum</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Dauer</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Preis</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Bewertung</th>
            </tr>
          </thead>
          <tbody>
            {mockVisits.map((visit) => (
              <tr key={visit.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#b76e79]" />
                    </div>
                    <span className="text-white font-medium">{visit.bordellName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{visit.city}</td>
                <td className="px-6 py-4 text-gray-400">{visit.date}</td>
                <td className="px-6 py-4 text-gray-400">{visit.duration}</td>
                <td className="px-6 py-4 text-[#b76e79] font-medium">€{visit.price}</td>
                <td className="px-6 py-4">
                  {visit.rating ? (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn('w-4 h-4', i < visit.rating! ? 'text-[#b76e79] fill-current' : 'text-gray-600')} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Keine Bewertung</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Dashboard Addresses Tab
function DashboardAddressesTab() {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Adreslerim</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0">
          <span className="mr-2">+</span> Neue Adresse
        </Button>
      </div>

      <p className="text-gray-400">Adreslerinizi eve çağırma hizmeti sunan mekanlar için kaydedin.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAddresses.map((address) => (
          <div key={address.id} className="bg-white/5 rounded-2xl border border-white/5 p-6 hover:border-[#8b1a4a]/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#b76e79]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{address.title}</h3>
                  {address.isDefault && <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30 text-xs">Standard</Badge>}
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white">{address.address}</p>
            <p className="text-gray-400">{address.postalCode} {address.city}</p>
            {address.notes && (
              <p className="text-gray-500 text-sm mt-3 italic">Not: {address.notes}</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                Bearbeiten
              </Button>
              {!address.isDefault && (
                <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                  Als Standard
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Address Card */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-white/5 rounded-2xl border border-dashed border-white/10 p-6 hover:border-[#8b1a4a]/30 transition-colors flex flex-col items-center justify-center min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
            <span className="text-2xl text-gray-500">+</span>
          </div>
          <p className="text-gray-400">Neue Adresse hinzufügen</p>
        </button>
      </div>
    </div>
  )
}

// Dashboard Badges Tab
function DashboardBadgesTab() {
  const unlockedBadges = mockBadges.filter(b => b.unlocked)
  const lockedBadges = mockBadges.filter(b => !b.unlocked)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Rozetlerim</h1>
        <p className="text-gray-400">Ziyaretlerinize göre rozet kazanın ve özel avantajların tadını çıkarın!</p>
      </div>

      {/* Unlocked Badges */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#b76e79]" />
          Kazanılan Rozetler ({unlockedBadges.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {unlockedBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-2xl border border-[#8b1a4a]/30 p-6 text-center relative overflow-hidden"
            >
              <div className={cn('w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-4xl mb-4', badge.color)}>
                {badge.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{badge.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{badge.description}</p>
              <div className="text-xs text-gray-500">Freigeschaltet: {badge.unlockedAt}</div>
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-green-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-gray-500" />
          Kilitli Rozetler ({lockedBadges.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white/5 rounded-2xl border border-white/5 p-6 text-center relative overflow-hidden"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 z-10" />
              
              <div className="relative z-0">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-4xl mb-4 blur-[3px] grayscale">
                  {badge.icon}
                </div>
                <h3 className="text-gray-500 font-bold text-lg mb-2 blur-[2px]">???</h3>
                <p className="text-gray-600 text-sm mb-3 blur-[2px]">{badge.requirement}</p>
              </div>

              {/* Progress overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-white text-sm font-medium mb-2">{badge.requirement}</p>
                <div className="w-full px-6">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] rounded-full"
                      style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{badge.progress}/{badge.maxProgress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================== ADMIN PANEL ====================

// Admin Panel
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const sidebarItems = [
    { id: 'dashboard' as const, icon: <Sparkles className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'establishments' as const, icon: <Building2 className="w-5 h-5" />, label: 'Betriebe' },
    { id: 'customers' as const, icon: <Users className="w-5 h-5" />, label: 'Kunden' },
    { id: 'bookings' as const, icon: <Calendar className="w-5 h-5" />, label: 'Buchungen' },
    { id: 'reviews' as const, icon: <Star className="w-5 h-5" />, label: 'Bewertungen' },
    { id: 'badges' as const, icon: <Crown className="w-5 h-5" />, label: 'Badges' },
    { id: 'invoices' as const, icon: <BadgeEuro className="w-5 h-5" />, label: 'Rechnungen' },
    { id: 'settings' as const, icon: <Shield className="w-5 h-5" />, label: 'Einstellungen' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0f] flex"
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-[#0f0f14] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-40"
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="text-sm font-bold text-white">ADMIN</span>
                <span className="text-gray-500 text-xs block">DesireMap</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                activeTab === item.id
                  ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 text-white border border-red-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={cn(activeTab === item.id && 'text-orange-400')}>{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Admin Info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">Admin</p>
                <p className="text-gray-500 text-xs">admin@desiremap.de</p>
              </motion.div>
            )}
          </div>
          {sidebarOpen && (
            <Button onClick={onLogout} variant="outline" size="sm" className="w-full border-white/10 text-gray-300 hover:bg-white/5">
              <LogIn className="w-4 h-4 mr-2 rotate-180" /> Abmelden
            </Button>
          )}
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-500">
          <ChevronRight className={cn('w-4 h-4 transition-transform', sidebarOpen && 'rotate-180')} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-[260px]' : 'ml-20')}>
        <div className="p-6">
          {activeTab === 'dashboard' && <AdminDashboardTab />}
          {activeTab === 'establishments' && <AdminEstablishmentsTab />}
          {activeTab === 'customers' && <AdminCustomersTab />}
          {activeTab === 'bookings' && <AdminBookingsTab />}
          {activeTab === 'reviews' && <AdminReviewsTab />}
          {activeTab === 'badges' && <AdminBadgesTab />}
          {activeTab === 'invoices' && <AdminInvoicesTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </div>
      </main>
    </motion.div>
  )
}

// Admin Dashboard Tab
function AdminDashboardTab() {
  const totalRevenue = bordells.reduce((sum, b) => sum + b.revenue, 0)
  const totalViews = bordells.reduce((sum, b) => sum + b.views, 0)
  const totalBookings = bordells.reduce((sum, b) => sum + b.bookings, 0)
  const activeCustomers = adminCustomers.filter(c => c.status === 'active').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gesamtumsatz', value: `€${(totalRevenue/1000).toFixed(1)}K`, icon: <BadgeEuro className="w-5 h-5" />, color: 'from-green-500 to-emerald-600', change: '+12%' },
          { label: 'Aktive Betriebe', value: bordells.filter(b => b.status === 'active').length, icon: <Building2 className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600', change: '+3' },
          { label: 'Aktive Kunden', value: activeCustomers, icon: <Users className="w-5 h-5" />, color: 'from-purple-500 to-pink-600', change: '+28' },
          { label: 'Seitenaufrufe', value: `${(totalViews/1000).toFixed(1)}K`, icon: <Eye className="w-5 h-5" />, color: 'from-orange-500 to-red-600', change: '+45%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', stat.color)}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <span className="text-green-400 text-xs font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by City */}
        <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/5 p-5">
          <h3 className="text-white font-semibold mb-4">Umsatz nach Stadt</h3>
          <div className="space-y-3">
            {germanCities.slice(0, 5).map((city, i) => {
              const cityRevenue = bordells.filter(b => b.city === city.name).reduce((s, b) => s + b.revenue, 0)
              const percentage = (cityRevenue / totalRevenue) * 100
              return (
                <div key={city.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{city.name}</span>
                    <span className="text-white font-medium">€{(cityRevenue/1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-5">
          <h3 className="text-white font-semibold mb-4">Letzte Aktivitäten</h3>
          <div className="space-y-3">
            {[
              { text: 'Neue Buchung: Artemis', time: '2 min', type: 'booking' },
              { text: 'Neuer Kunde: Thomas M.', time: '15 min', type: 'customer' },
              { text: 'Bewertung: Café del Sol', time: '1 std', type: 'review' },
              { text: 'Premium: Hans S.', time: '2 std', type: 'premium' },
              { text: 'Rechnung bezahlt', time: '3 std', type: 'invoice' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center',
                  activity.type === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'customer' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                  activity.type === 'premium' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                )}>
                  {activity.type === 'booking' ? <Calendar className="w-4 h-4" /> :
                   activity.type === 'customer' ? <User className="w-4 h-4" /> :
                   activity.type === 'review' ? <Star className="w-4 h-4" /> :
                   activity.type === 'premium' ? <Crown className="w-4 h-4" /> :
                   <BadgeEuro className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{activity.text}</p>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Establishments */}
      <div className="bg-white/5 rounded-xl border border-white/5 p-5">
        <h3 className="text-white font-semibold mb-4">Top Betriebe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Name</th>
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Stadt</th>
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Bewertung</th>
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Buchungen</th>
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Umsatz</th>
                <th className="text-left text-gray-400 text-xs font-medium py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bordells.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#b76e79]" />
                      </div>
                      <span className="text-white font-medium text-sm">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-sm">{b.city}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{b.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300 text-sm">{b.bookings}</td>
                  <td className="py-3 px-3 text-green-400 font-medium text-sm">€{(b.revenue/1000).toFixed(1)}K</td>
                  <td className="py-3 px-3">
                    <Badge className={cn('text-xs border-0',
                      b.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      b.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-red-500/20 text-red-400'
                    )}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Admin Establishments Tab
function AdminEstablishmentsTab() {
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Bordell | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredItems = bordells.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter || b.type === filter
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Betriebe verwalten</h1>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white border-0">
          <span className="mr-2">+</span> Neuer Betrieb
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border-white/10 pl-10 h-10 text-white" />
        </div>
        {['all', 'active', 'inactive', 'pending', 'fkk', 'laufhaus', 'bordell'].map((f) => (
          <Button key={f} onClick={() => setFilter(f)} variant={filter === f ? 'default' : 'outline'} size="sm" className={cn('rounded-full', filter === f ? 'bg-red-600 text-white border-0' : 'border-white/10 text-gray-300')}>
            {f === 'all' ? 'Alle' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Betrieb</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Kontakt</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Preis</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Statistiken</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Premium</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Status</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b1a4a]/20 to-[#6b3fa0]/20 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#b76e79]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-300 text-sm">{item.phone}</p>
                    <p className="text-gray-500 text-xs">{item.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-green-400 font-medium">€{item.minPrice} - €{item.maxPrice}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-400"><Eye className="w-3 h-3 inline mr-1" />{item.views}</span>
                      <span className="text-gray-400"><Calendar className="w-3 h-3 inline mr-1" />{item.bookings}</span>
                      <span className="text-gray-400"><Star className="w-3 h-3 inline mr-1 text-yellow-400" />{item.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {item.premium ? (
                      <Badge className="bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white border-0 text-xs">
                        <Crown className="w-3 h-3 mr-1" /> Premium
                      </Badge>
                    ) : item.sponsored ? (
                      <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">Sponsored</Badge>
                    ) : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={cn('text-xs border-0',
                      item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    )}>{item.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedItem(item); setShowEditModal(true); }} className="text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Admin Customers Tab
function AdminCustomersTab() {
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = adminCustomers.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter || (filter === 'premium' && c.premium)
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Kunden verwalten</h1>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
          <span className="mr-2">+</span> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border-white/10 pl-10 h-10 text-white" />
        </div>
        {['all', 'active', 'inactive', 'banned', 'premium'].map((f) => (
          <Button key={f} onClick={() => setFilter(f)} variant={filter === f ? 'default' : 'outline'} size="sm" className={cn('rounded-full', filter === f ? 'bg-red-600 text-white border-0' : 'border-white/10 text-gray-300')}>
            {f === 'all' ? 'Alle' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredItems.map((customer) => (
          <div key={customer.id} className="bg-white/5 rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{customer.name}</p>
                    {customer.premium && <Crown className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <p className="text-gray-500 text-sm">{customer.email}</p>
                </div>
              </div>
              <Badge className={cn('text-xs border-0',
                customer.status === 'active' ? 'bg-green-500/20 text-green-400' :
                customer.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                'bg-red-500/20 text-red-400'
              )}>{customer.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-white font-bold">{customer.totalVisits}</p>
                <p className="text-gray-500 text-xs">Besuche</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-green-400 font-bold">€{customer.totalSpent}</p>
                <p className="text-gray-500 text-xs">Ausgegeben</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-white font-bold">{customer.badges.length}</p>
                <p className="text-gray-500 text-xs">Badges</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Letzter Login: {customer.lastLogin}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Admin Bookings Tab
function AdminBookingsTab() {
  const [filter, setFilter] = useState<string>('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Buchungen</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
            <Button key={f} onClick={() => setFilter(f)} variant={filter === f ? 'default' : 'outline'} size="sm" className={cn(filter === f ? 'bg-red-600 text-white border-0' : 'border-white/10 text-gray-300')}>
              {f === 'all' ? 'Alle' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Buchung ID</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Kunde</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Betrieb</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Datum / Zeit</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Betrag</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Zahlung</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Status</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {adminBookings.map((booking) => (
              <tr key={booking.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white font-mono text-sm">{booking.id}</td>
                <td className="py-3 px-4">
                  <p className="text-white text-sm">{booking.customerName}</p>
                  <p className="text-gray-500 text-xs">{booking.customerEmail}</p>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">{booking.bordellName}</td>
                <td className="py-3 px-4">
                  <p className="text-white text-sm">{booking.date}</p>
                  <p className="text-gray-500 text-xs">{booking.time} • {booking.duration} min</p>
                </td>
                <td className="py-3 px-4 text-green-400 font-medium">€{booking.price}</td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-xs border-0',
                    booking.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                    booking.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  )}>{booking.paymentStatus}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-xs border-0',
                    booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                    booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  )}>{booking.status}</Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Admin Reviews Tab
function AdminReviewsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Bewertungen verwalten</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {adminReviews.map((review) => (
          <div key={review.id} className="bg-white/5 rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium">{review.title}</p>
                <p className="text-gray-500 text-sm">{review.bordellName}</p>
              </div>
              <Badge className={cn('text-xs border-0',
                review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              )}>{review.status}</Badge>
            </div>
            
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('w-4 h-4', i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600')} />
              ))}
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{review.content}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">von {review.customerName} • {review.date}</span>
              <div className="flex gap-2">
                {review.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">Genehmigen</Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">Ablehnen</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Admin Badges Tab
function AdminBadgesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Badges verwalten</h1>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
          <span className="mr-2">+</span> Neuer Badge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminBadges.map((badge) => (
          <div key={badge.id} className="bg-white/5 rounded-xl border border-white/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', badge.color)}>
                {badge.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{badge.name}</p>
                <Badge className={cn('text-xs border-0', badge.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400')}>
                  {badge.active ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">{badge.description}</p>
            <p className="text-gray-500 text-xs mb-3">Anforderung: {badge.requirement}</p>
            {badge.reward && <p className="text-green-400 text-xs mb-3">Belohnung: {badge.reward}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-white/10 text-gray-300">Bearbeiten</Button>
              <Button size="sm" variant="ghost" className="text-gray-400"><X className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Admin Invoices Tab
function AdminInvoicesTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Rechnungen</h1>

      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Rechnung</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Kunde</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Typ</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Beschreibung</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Betrag</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Status</th>
              <th className="text-left text-gray-400 text-xs font-medium py-3 px-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {adminInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white font-mono text-sm">{invoice.id}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{invoice.customerName}</td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-xs border-0',
                    invoice.type === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                    invoice.type === 'premium' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  )}>{invoice.type}</Badge>
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">{invoice.description}</td>
                <td className="py-3 px-4">
                  <p className="text-white font-medium">€{invoice.total.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs">inkl. €{invoice.tax.toFixed(2)} MwSt</p>
                </td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-xs border-0',
                    invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  )}>{invoice.status}</Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-8 w-8 p-0">PDF</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Admin Settings Tab
function AdminSettingsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Einstellungen</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">Allgemeine Einstellungen</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Seitenname</Label>
              <Input defaultValue="DesireMap.de" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Support E-Mail</Label>
              <Input defaultValue="support@desiremap.de" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Standard-Provision (%)</Label>
              <Input type="number" defaultValue="15" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
          </div>
        </div>

        {/* Premium Pricing */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">Premium Preise</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Basic (€/Monat)</Label>
              <Input type="number" defaultValue="49" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Premium (€/Monat)</Label>
              <Input type="number" defaultValue="149" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Sponsored (€/Monat)</Label>
              <Input type="number" defaultValue="299" className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">Sicherheit</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white text-sm">2FA für Admins</p>
                <p className="text-gray-500 text-xs">Zwei-Faktor-Authentifizierung aktivieren</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white text-sm">IP-Logging</p>
                <p className="text-gray-500 text-xs">Alle Anmeldungen protokollieren</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">Benachrichtigungen</h3>
          <div className="space-y-3">
            {['Neue Registrierungen', 'Neue Buchungen', 'Stornierungen', 'Neue Bewertungen'].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <p className="text-white text-sm">{item}</p>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">Änderungen speichern</Button>
    </div>
  )
}

// Main Page
export default function Home() {
  const [view, setView] = useState<View>('home')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBordell, setSelectedBordell] = useState<Bordell | null>(null)
  const [loginMessage, setLoginMessage] = useState<string | undefined>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleCityClick = (city: string) => {
    setSelectedCity(city)
    setView('city')
    window.scrollTo(0, 0)
  }

  const handleBordellClick = (bordell: Bordell) => {
    setSelectedBordell(bordell)
    setView('detail')
    window.scrollTo(0, 0)
  }

  const handleBackToHome = () => {
    setView('home')
    setSelectedCity(null)
    setSelectedBordell(null)
    setLoginMessage(undefined)
    window.scrollTo(0, 0)
  }

  const handleBackToCity = () => {
    setView('city')
    setSelectedBordell(null)
    window.scrollTo(0, 0)
  }

  const handleLoginRequired = (message?: string) => {
    setLoginMessage(message)
    setView('login')
    window.scrollTo(0, 0)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setLoginMessage(undefined)
    setView('dashboard')
    window.scrollTo(0, 0)
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
    setView('admin')
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    setView('home')
    window.scrollTo(0, 0)
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {view !== 'dashboard' && view !== 'admin' && <Header onLoginClick={handleLoginRequired} isLoggedIn={isLoggedIn} onDashboardClick={() => setView('dashboard')} />}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection />
            <CategoriesSection />
            <FeaturedCities onCityClick={handleCityClick} />
            <ListingsSection onDetailClick={handleBordellClick} />
            <PremiumSection onLoginRequired={handleLoginRequired} />
            <AdvertisingSection onLoginRequired={handleLoginRequired} />
          </motion.div>
        )}
        {view === 'city' && selectedCity && (
          <CityPage key="city" city={selectedCity} onBack={handleBackToHome} onSelectBordell={handleBordellClick} />
        )}
        {view === 'detail' && selectedBordell && (
          <DetailPage key="detail" bordell={selectedBordell} onBack={selectedCity ? handleBackToCity : handleBackToHome} />
        )}
        {view === 'login' && (
          <LoginPage key="login" onBack={handleBackToHome} loginMessage={loginMessage} onLogin={handleLogin} onAdminLogin={handleAdminLogin} />
        )}
        {view === 'dashboard' && isLoggedIn && (
          <DashboardPage key="dashboard" user={mockUser} onLogout={handleLogout} />
        )}
        {view === 'admin' && isAdmin && (
          <AdminPanel key="admin" onLogout={handleLogout} />
        )}
      </AnimatePresence>
      {view !== 'dashboard' && view !== 'admin' && <Footer />}
    </main>
  )
}
