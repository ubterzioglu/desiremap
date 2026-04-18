'use client'

import { Building2, CalendarRange, Users2 } from 'lucide-react'
import { useAdminStats, useAdminVenues } from '@/hooks/useQueries'
import { useAuthStore } from '@/stores/authStore'

export function OperatorDashboardWorkspace() {
  const { data: stats } = useAdminStats()
  const { data: venues = [] } = useAdminVenues()
  const user = useAuthStore((s) => s.user)

  const venueCount = Array.isArray(venues) ? venues.length : 0

  const cards = [
    { label: 'Venues', value: stats?.venues ?? venueCount, icon: Building2, color: 'text-indigo-300', bg: 'bg-indigo-400/10 border-indigo-400/20' },
    { label: 'Events (veröffentlicht)', value: stats?.publishedEvents ?? 0, icon: CalendarRange, color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Events (Entwurf)', value: stats?.draftEvents ?? 0, icon: CalendarRange, color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/20' },
    { label: 'Operatoren', value: stats?.operators ?? 0, icon: Users2, color: 'text-violet-300', bg: 'bg-violet-400/10 border-violet-400/20' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-indigo-400/5 px-6 py-5">
        <p className="text-slate-300">
          Willkommen, <span className="font-medium text-white">{user?.name || user?.email}</span>.
          Verwalten Sie Ihre Venues und Events im Betreiber-Portal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
            <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-2xl border', bg)}>
              <Icon className={cn('h-5 w-5', color)} />
            </div>
            <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
