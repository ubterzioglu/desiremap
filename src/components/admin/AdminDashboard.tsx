'use client'

import { Building2, CalendarRange, CircleAlert, Plus, RadioTower, Users2 } from 'lucide-react'
import { useAdminOperators, useAdminStats } from '@/hooks/useQueries'
import { getConfiguredBusinessAccountPublicId, getConfiguredVenuePublicId } from '@/lib/admin-config'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string
  value: string | number
  helper: string
  icon: typeof Building2
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
          <div className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-sm text-slate-400">{helper}</div>
    </div>
  )
}

export function AdminDashboard() {
  const router = useRouter()
  const { data: stats, isLoading } = useAdminStats()
  const { data: operators = [] } = useAdminOperators()
  const businessContextMissing = !stats?.businessAccountPublicId && !getConfiguredBusinessAccountPublicId()
  const venueContextMissing = !stats?.selectedVenuePublicId && !getConfiguredVenuePublicId()
  const operatorList = Array.isArray(operators) ? operators.slice(0, 5) : []

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.18))] p-6 shadow-[0_24px_100px_rgba(15,23,42,0.45)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-100">
              <RadioTower className="h-3.5 w-3.5" />
              Operations Overview
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">Klares Operator Control Center fuer Alltag und Eventbetrieb.</h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-7 text-slate-300">
              Dieses Dashboard priorisiert die wichtigsten Entscheidungen: Business-Kontext, Venue-Kontext, Teamstatus und Event-Lifecycle.
              Keine Kunden- oder Review-Ablenkung mehr.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300" onClick={() => router.push('/venues')}>
                <Plus className="mr-2 h-4 w-4" />
                Venue erstellen
              </Button>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent hover:bg-white/5" onClick={() => router.push('/events')}>
                <CalendarRange className="mr-2 h-4 w-4" />
                Events verwalten
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Action Center</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-white">
                <CircleAlert className="h-4 w-4 text-teal-300" />
                Business-Kontext
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {businessContextMissing
                  ? 'BUSINESS_ACCOUNT_PUBLIC_ID fehlt. Ohne Business-Kontext sind geschuetzte Operator-Endpunkte blockiert.'
                  : `Aktiv. Business-ID: ${stats?.businessAccountPublicId}`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-white">
                <CircleAlert className="h-4 w-4 text-teal-300" />
                Venue-Kontext
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {venueContextMissing
                  ? 'Kein Default-Venue gesetzt. Event-Listen und Dashboard-Fokus nutzen dann Fallback-Zustand.'
                  : `Aktiv. Venue-ID: ${stats?.selectedVenuePublicId}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Venues" value={isLoading ? '...' : stats?.venues ?? 0} helper="Verwaltete Locations im aktiven Admin-Kontext." icon={Building2} />
        <StatCard label="Live Events" value={isLoading ? '...' : stats?.publishedEvents ?? 0} helper="Events mit sichtbarem oder offenem Status." icon={CalendarRange} />
        <StatCard label="Needs Action" value={isLoading ? '...' : stats?.draftEvents ?? 0} helper="Entwuerfe oder Lifecycle-Faelle mit naechstem Schritt." icon={CircleAlert} />
        <StatCard label="Operators" value={isLoading ? '...' : stats?.operators ?? 0} helper="Aktuelle Teammitglieder im Business-Kontext." icon={Users2} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Quick Actions</div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Heute als naechstes</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                title: 'Venue anlegen',
                text: 'Neues Venue mit manueller City- und Service-Fallback-Eingabe anlegen.',
                href: '/venues',
              },
              {
                title: 'Event starten',
                text: 'Draft erstellen, Zeitfenster setzen und Lifecycle im gleichen Workspace steuern.',
                href: '/events',
              },
              {
                title: 'Team absichern',
                text: 'Operatoren pruefen, deaktivieren oder reaktivieren.',
                href: '/operators',
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => router.push(item.href)}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-teal-400/30 hover:bg-white/[0.07]"
              >
                <div className="text-lg font-medium text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">This Week</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Team Snapshot</h3>
          <div className="mt-5 space-y-3">
            {operatorList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                Noch keine Operator-Daten geladen. Sobald der Business-Kontext aktiv ist, erscheinen hier Team-Aktivitaeten.
              </div>
            )}
            {operatorList.map((operator: any) => (
              <div key={operator.operatorPublicId} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-white">{operator.displayName || operator.invitedEmail}</div>
                    <div className="mt-1 text-xs text-slate-500">{operator.invitedEmail}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    {operator.accountStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
