'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardTabs } from '@/components/dashboard/DashboardTabs'
import type { DashboardTab } from '@/types'

export function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }

    if (!isLoading && user?.workspace === 'admin') {
      router.push('/auth/dashboard')
    }
  }, [isLoading, isAuthenticated, router, user?.workspace])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/de')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <DashboardSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        user={{
          id: user.id,
          name: user.name ?? null,
          email: user.email || ''
        }}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
      <DashboardTabs activeTab={activeTab} sidebarOpen={sidebarOpen} />
    </div>
  )
}
