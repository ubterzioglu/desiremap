'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/navigation'
import { 
  BadgeEuro, Building2, Calendar, Check, ChevronRight, Crown, Eye, LogIn, 
  Shield, Sparkles, Star, Trash, Users, X, Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  useAdminStats,
  useAdminEstablishments,
  useAdminCustomers,
  useAdminBookings,
  useAdminReviews,
  useAdminUpdateReview,
  useAdminDeleteReview,
  useUpdateEstablishment,
  useUpdateCustomer
} from '@/hooks/useQueries'
import type { AdminTab } from '@/types'

const sidebarItems = [
  { id: 'dashboard' as const, icon: <Sparkles className="w-5 h-5" />, label: 'Dashboard' },
  { id: 'establishments' as const, icon: <Building2 className="w-5 h-5" />, label: 'Betriebe' },
  { id: 'customers' as const, icon: <Users className="w-5 h-5" />, label: 'Kunden' },
  { id: 'bookings' as const, icon: <Calendar className="w-5 h-5" />, label: 'Buchungen' },
  { id: 'reviews' as const, icon: <Star className="w-5 h-5" />, label: 'Bewertungen' },
  { id: 'settings' as const, icon: <Shield className="w-5 h-5" />, label: 'Einstellungen' }
]

function AdminSidebar({ 
  activeTab, 
  sidebarOpen, 
  onTabChange, 
  onLogout, 
  onToggle 
}: { 
  activeTab: AdminTab
  sidebarOpen: boolean
  onTabChange: (tab: AdminTab) => void
  onLogout: () => void
  onToggle: () => void
}) {
  return (
    <aside className={cn(
      'bg-[#0f0f14] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all',
      sidebarOpen ? 'w-[260px]' : 'w-20'
    )}>
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-600 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="text-sm font-bold text-white">ADMIN</span>
              <span className="text-gray-500 text-xs block">DesireMap</span>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
              activeTab === item.id
                ? 'bg-linear-to-r from-red-600/20 to-orange-600/20 text-white border border-red-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <span>{item.icon}</span>
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        {sidebarOpen && (
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full border-white/10 text-gray-300 hover:bg-white/5"
          >
            <LogIn className="w-4 h-4 mr-2 rotate-180" /> Abmelden
          </Button>
        )}
      </div>
      
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white"
      >
        <ChevronRight className={cn('w-4 h-4 transition-transform', sidebarOpen && 'rotate-180')} />
      </button>
    </aside>
  )
}

function AdminDashboardContent({ 
  activeTab, 
  searchQuery 
}: { 
  activeTab: AdminTab
  searchQuery: string
}) {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: establishments = [], isLoading: estLoading } = useAdminEstablishments()
  const { data: customers = [], isLoading: custLoading } = useAdminCustomers()
  const { data: bookings = [], isLoading: bookLoading } = useAdminBookings()
  const { data: reviews = [], isLoading: revLoading } = useAdminReviews()
  
  const updateReview = useAdminUpdateReview()
  const deleteReview = useAdminDeleteReview()
  const updateEstablishment = useUpdateEstablishment()
  const updateCustomer = useUpdateCustomer()

  const filteredEstablishments = useMemo(() => 
    establishments.filter((item: any) => 
      !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [establishments, searchQuery])

  const filteredCustomers = useMemo(() => 
    customers.filter((item: any) => 
      !searchQuery || 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [customers, searchQuery])

  const filteredBookings = useMemo(() => 
    bookings.filter((item: any) => 
      !searchQuery || 
      item.bordellName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [bookings, searchQuery])

  const filteredReviews = useMemo(() => 
    reviews.filter((item: any) => 
      !searchQuery || 
      item.bordellName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [reviews, searchQuery])

  const handleApproveReview = async (id: string) => {
    await updateReview.mutateAsync({ id, status: 'approved' })
  }

  const handleRejectReview = async (id: string) => {
    await updateReview.mutateAsync({ id, status: 'rejected' })
  }

  const handleDeleteReview = async (id: string) => {
    if (confirm('Bewertung wirklich löschen?')) {
      await deleteReview.mutateAsync(id)
    }
  }

  const handleStatusChange = async (type: 'establishment' | 'customer', id: string, status: string) => {
    if (type === 'establishment') {
      await updateEstablishment.mutateAsync({ id, status })
    } else {
      await updateCustomer.mutateAsync({ id, status })
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      suspended: 'bg-red-500/20 text-red-400',
      banned: 'bg-red-500/20 text-red-400',
      confirmed: 'bg-green-500/20 text-green-400',
      completed: 'bg-blue-500/20 text-blue-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400'
    }
    return (
      <Badge className={colors[status] || 'bg-gray-500/20 text-gray-400'}>
        {status}
      </Badge>
    )
  }

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        
        {statsLoading ? (
          <div className="text-gray-400">Laden...</div>
        ) : stats && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Betriebe', value: stats.overview.totalEstablishments, sub: `${stats.overview.activeEstablishments} aktiv`, icon: <Building2 /> },
                { label: 'Kunden', value: stats.overview.totalCustomers, sub: `${stats.overview.activeCustomers} aktiv`, icon: <Users /> },
                { label: 'Buchungen', value: stats.overview.totalBookings, sub: `${stats.overview.pendingBookings} ausstehend`, icon: <Calendar /> },
                { label: 'Umsatz', value: `€${stats.overview.totalRevenue.toFixed(2)}`, sub: '', icon: <BadgeEuro /> }
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 text-gray-400 mb-2">
                    {stat.icon}
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  {stat.sub && <div className="text-gray-500 text-xs">{stat.sub}</div>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Top Betriebe</h2>
                <div className="space-y-3">
                  {stats.topEstablishments.map((e: any) => (
                    <div key={e.id} className="flex justify-between items-center py-2 border-b border-white/5">
                      <div>
                        <span className="text-white">{e.name}</span>
                        <span className="text-gray-500 text-sm block">{e.city}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white">{e.bookings} Buchungen</span>
                        <span className="text-gray-500 text-sm block">€{e.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Letzte Aktivitäten</h2>
                <div className="space-y-3">
                  {stats.recentActivity.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <span className="text-gray-300">{a.customerName} → {a.bordellName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(a.status)}
                          <span className="text-[#b76e79]">€{a.amount}</span>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(a.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  if (activeTab === 'establishments') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Betriebe</h1>
        
        {estLoading ? (
          <div className="text-gray-400">Laden...</div>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm">Name</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Stadt</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Typ</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Buchungen</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstablishments.map((e: any) => (
                  <tr key={e.id} className="border-t border-white/5">
                    <td className="p-4 text-white">{e.name}</td>
                    <td className="p-4 text-gray-400">{e.city}</td>
                    <td className="p-4 text-gray-400">{e.type}</td>
                    <td className="p-4">{getStatusBadge(e.status)}</td>
                    <td className="p-4 text-gray-400">{e.bookings}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {e.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange('establishment', e.id, 'active')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {e.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange('establishment', e.id, 'suspended')}
                            variant="outline"
                            className="border-white/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  if (activeTab === 'customers') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Kunden</h1>
        
        {custLoading ? (
          <div className="text-gray-400">Laden...</div>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm">Name</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Email</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Besuche</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Ausgaben</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c: any) => (
                  <tr key={c.id} className="border-t border-white/5">
                    <td className="p-4 text-white">{c.name || 'N/A'}</td>
                    <td className="p-4 text-gray-400">{c.email}</td>
                    <td className="p-4 text-gray-400">{c.totalVisits}</td>
                    <td className="p-4 text-[#b76e79]">€{c.totalSpent?.toFixed(2) || '0.00'}</td>
                    <td className="p-4">{getStatusBadge(c.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {c.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange('customer', c.id, 'banned')}
                            variant="outline"
                            className="border-red-500/30 text-red-400"
                          >
                            Ban
                          </Button>
                        )}
                        {c.status === 'banned' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange('customer', c.id, 'active')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Unban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  if (activeTab === 'bookings') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Buchungen</h1>
        
        {bookLoading ? (
          <div className="text-gray-400">Laden...</div>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm">Kunde</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Betrieb</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Datum</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Preis</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Bezahlung</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b: any) => (
                  <tr key={b.id} className="border-t border-white/5">
                    <td className="p-4 text-white">{b.customerName}</td>
                    <td className="p-4 text-gray-400">{b.bordellName}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(b.date).toLocaleDateString('de-DE')} {b.time}
                    </td>
                    <td className="p-4 text-[#b76e79]">€{b.price}</td>
                    <td className="p-4">{getStatusBadge(b.status)}</td>
                    <td className="p-4">{getStatusBadge(b.paymentStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  if (activeTab === 'reviews') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Bewertungen</h1>
        
        {revLoading ? (
          <div className="text-gray-400">Laden...</div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((r: any) => (
              <div key={r.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{r.bordellName}</span>
                      {getStatusBadge(r.status)}
                    </div>
                    <span className="text-gray-500 text-sm">von {r.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{r.content}</p>
                <div className="flex gap-2">
                  {r.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApproveReview(r.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" /> Genehmigen
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRejectReview(r.id)}
                        variant="outline"
                        className="border-red-500/30 text-red-400"
                      >
                        <X className="w-4 h-4 mr-1" /> Ablehnen
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleDeleteReview(r.id)}
                    variant="ghost"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (activeTab === 'settings') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Einstellungen</h1>
        <div className="bg-white/5 rounded-xl p-6">
          <p className="text-gray-400">Admin Einstellungen werden hier konfiguriert.</p>
        </div>
      </div>
    )
  }

  return null
}

export function AdminPanel() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/de/login')
    } else if (user && user.role !== 'admin') {
      router.push('/de')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/de')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <AdminSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
      <main className={cn(
        'flex-1 transition-all duration-300 p-6',
        sidebarOpen ? 'ml-[260px]' : 'ml-20'
      )}>
        <div className="mb-6">
          <Input
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-white/5 border-white/10 text-white"
          />
        </div>
        <AdminDashboardContent activeTab={activeTab} searchQuery={searchQuery} />
      </main>
    </div>
  )
}
