'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Activity,
  Building2,
  CalendarRange,
  ChevronRight,
  DoorOpen,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users2,
} from 'lucide-react'
import { useAdminAuth } from '@/components/providers/AdminAuthProvider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AdminTab } from '@/types'

const navigationItems: Array<{
  id: AdminTab
  label: string
  href: string
  icon: typeof Building2
}> = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Activity },
  { id: 'venues', label: 'Venues', href: '/venues', icon: Building2 },
  { id: 'events', label: 'Events', href: '/events', icon: CalendarRange },
  { id: 'operators', label: 'Operators', href: '/operators', icon: Users2 },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

export function AdminShell({
  activeTab,
  children,
  title,
  subtitle,
}: {
  activeTab: AdminTab
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router, user?.workspace])

  const initials = useMemo(() => {
    const parts = (user?.name || user?.email || 'Operator').split(/\s+/).filter(Boolean)
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
  }, [user?.email, user?.name])

  const handleLogout = () => {
    logout()
    router.replace('/auth/login')
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-[100dvh] bg-[#07111f] flex items-center justify-center text-slate-200">
        Admin workspace wird geladen...
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#07111f] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_30%),linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px] opacity-50 pointer-events-none" />
      <div className="relative flex min-h-[100dvh]">
        <aside className={cn(
          'border-r border-white/10 bg-slate-950/90 backdrop-blur-xl transition-all duration-300',
          sidebarOpen ? 'w-[280px]' : 'w-[88px]'
        )}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                {sidebarOpen && (
                  <div>
                    <div className="text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase">Admin</div>
                    <div className="text-xs text-slate-500">desiremap.de</div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:bg-white/5 hover:text-slate-100"
                onClick={() => setSidebarOpen((value) => !value)}
              >
                {sidebarOpen ? <ChevronRight className="h-5 w-5 rotate-180" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id || pathname === item.href

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all',
                      isActive
                        ? 'bg-teal-400/12 text-white ring-1 ring-inset ring-teal-400/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                )
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className={cn(
                'rounded-2xl border border-white/10 bg-white/5 p-3',
                !sidebarOpen && 'flex justify-center'
              )}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-100">
                    {initials || 'OP'}
                  </div>
                  {sidebarOpen && (
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-100">{user.name || 'Operator'}</div>
                      <div className="truncate text-xs text-slate-400">{user.email}</div>
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="mt-4 w-full border-white/10 bg-transparent text-slate-200 hover:bg-white/5"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Abmelden
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 bg-slate-950/55 px-6 py-5 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Super Admin</div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right md:block">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Workspace</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                  <DoorOpen className="h-4 w-4 text-teal-300" />
                  Admin Host
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 py-6">
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
