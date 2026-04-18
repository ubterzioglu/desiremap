'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, Building2, CalendarRange, ChevronRight, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OperatorTab } from '@/types'

const navItems: Array<{ id: OperatorTab; label: string; href: string; icon: typeof Building2 }> = [
  { id: 'dashboard', label: 'Dashboard', href: '/business/dashboard', icon: Activity },
  { id: 'venues', label: 'Venues', href: '/business/venues', icon: Building2 },
  { id: 'events', label: 'Events', href: '/business/events', icon: CalendarRange },
]

export function OperatorShell({
  activeTab,
  children,
  title,
  subtitle,
}: {
  activeTab: OperatorTab
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/business/login')
    }
  }, [ready, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.replace('/business/login')
  }

  if (!ready || !isAuthenticated || !user) {
    return (
      <div className="min-h-[100dvh] bg-[#07111f] flex items-center justify-center text-slate-400 text-sm">
        Wird geladen...
      </div>
    )
  }

  const initials = (user.name || user.email || 'OP')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div className="min-h-[100dvh] bg-[#07111f] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.1),_transparent_40%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px] pointer-events-none" />
      <div className="relative flex min-h-[100dvh]">
        <aside className={cn('border-r border-white/10 bg-slate-950/90 backdrop-blur-xl transition-all duration-300', sidebarOpen ? 'w-[260px]' : 'w-[80px]')}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-200">
                  <Building2 className="h-5 w-5" />
                </div>
                {sidebarOpen && (
                  <div>
                    <div className="text-sm font-semibold tracking-[0.2em] text-slate-300 uppercase">Operator</div>
                    <div className="text-xs text-slate-500">desiremap.de</div>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-white/5 hover:text-slate-100" onClick={() => setSidebarOpen((v) => !v)}>
                {sidebarOpen ? <ChevronRight className="h-5 w-5 rotate-180" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
              {navItems.map(({ id, label, href, icon: Icon }) => {
                const isActive = activeTab === id || pathname === href
                return (
                  <button
                    key={id}
                    onClick={() => router.push(href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all',
                      isActive ? 'bg-indigo-400/12 text-white ring-1 ring-inset ring-indigo-400/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                  </button>
                )
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-3', !sidebarOpen && 'flex justify-center')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
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
                  <Button variant="outline" onClick={handleLogout} className="mt-3 w-full border-white/10 bg-transparent text-slate-300 hover:bg-white/5">
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
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Betreiber-Portal</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h1>
                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
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
