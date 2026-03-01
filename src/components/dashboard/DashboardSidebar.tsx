'use client'

import { ChevronRight, Clock, Crown, LogIn, MapPin, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DashboardTab } from '@/types'

const sidebarItems = [
  { id: 'dashboard' as const, icon: <Sparkles className="w-5 h-5" />, label: 'Dashboard' },
  { id: 'visits' as const, icon: <Clock className="w-5 h-5" />, label: 'Besuche' },
  { id: 'addresses' as const, icon: <MapPin className="w-5 h-5" />, label: 'Adressen' },
  { id: 'badges' as const, icon: <Crown className="w-5 h-5" />, label: 'Badges' }
]

interface User {
  id: string
  name: string | null
  email: string
}

interface DashboardSidebarProps {
  activeTab: DashboardTab
  sidebarOpen: boolean
  user: User
  onTabChange: (tab: DashboardTab) => void
  onLogout: () => void
  onToggle: () => void
}

export function DashboardSidebar({
  activeTab,
  sidebarOpen,
  user,
  onTabChange,
  onLogout,
  onToggle
}: DashboardSidebarProps) {
  return (
    <aside className={cn(
      'bg-[#0f0f14] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all',
      sidebarOpen ? 'w-[280px]' : 'w-20'
    )}>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="text-lg font-bold text-white">DESIREMAP</span>
              <span className="text-gray-500 text-xs">.de</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              activeTab === item.id
                ? 'bg-linear-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20 text-white border border-[#8b1a4a]/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <span>{item.icon}</span>
            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-medium text-sm truncate">{user.name || 'User'}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
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

      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#8b1a4a] flex items-center justify-center text-white"
      >
        <ChevronRight className={cn('w-4 h-4 transition-transform', sidebarOpen && 'rotate-180')} />
      </button>
    </aside>
  )
}
