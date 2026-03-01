'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardTabs } from '@/components/dashboard/DashboardTabs'
import type { DashboardTab } from '@/types'

export function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/de/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/de')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <DashboardSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        user={{
          id: session.user.id,
          name: session.user.name ?? null,
          email: session.user.email || ''
        }}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
      <DashboardTabs activeTab={activeTab} sidebarOpen={sidebarOpen} />
    </div>
  )
}
