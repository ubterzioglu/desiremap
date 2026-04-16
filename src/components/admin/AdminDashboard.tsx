'use client'

import { Building2, CalendarRange, CircleAlert, MapPin, Plus, RadioTower, UserCheck, Users2 } from 'lucide-react'
import { useAdminOperators, useAdminStats } from '@/hooks/useQueries'
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
  const { data: stats, isLoading, isError } = useAdminStats()
  const { data: operators = [] } = useAdminOperators()
  const operatorList = Array.isArray(operators) ? operators.slice(0, 5) : []

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.18))] p-6 shadow-[0_24px_100px_rgba(15,23,42,0.45)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-100">
              <RadioTower className="h-3.5 w-3.5" />
              Plattformverwaltung
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">DesireMap Super Admin — Alle Betriebe, Operatoren und Events auf einen Blick.</h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-7 text-slate-300">
              Zentrale Steuerungsebene fuer die gesamte Plattform. Betriebe anlegen, Operatoren verwalten,
              Events ueberwachen und Mitgliedsdaten einsehen — alles aus einem Workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300" onClick={() => router.push('/auth/venues')}>
                <Plus className="mr-2 h-4 w-4" />
                Venue erstellen
              </Button>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent hover:bg-white/5" onClick={() => router.push('/auth/events')}>
                <CalendarRange className="mr-2 h-4 w-4" />
                Events verwalten
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">System Status</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-white">
                <CircleAlert className="h-4 w-4 text-teal-300" />
                Backend-Verbindung
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {isLoading
                  ? 'Pruefe Verbindung...'
                  : isError
                    ? 'Backend nicht erreichbar. API-Endpunkte pruefen.'
                    : 'Verbunden. Daten werden geladen.'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-white">
                <CircleAlert className="h-4 w-4 text-teal-300" />
                Auth-Modus
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Static Super Admin. Backend-Auth-Integration folgt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Betriebe" value={isLoading ? '...' : (stats?.venues ?? 0)} helper="Geschaeftskonten auf der Plattform." icon={Building2} />
        <StatCard label="Venues" value={isLoading ? '...' : (stats?.venues ?? 0)} helper="Aktive Locations aller Betriebe." icon={MapPin} />
        <StatCard label="Events" value={isLoading ? '...' : (stats?.publishedEvents ?? 0)} helper="Veroeffentlichte Events plattformweit." icon={CalendarRange} />
        <StatCard label="Operatoren" value={isLoading ? '...' : (stats?.operators ?? 0)} helper="Registrierte Operatoren aller Betriebe." icon={Users2} />
        <StatCard label="Mitglieder" value={isLoading ? '...' : 0} helper="Registrierte Plattform-Mitglieder." icon={UserCheck} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Quick Actions</div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Plattform-Steuerung</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                title: 'Betrieb verwalten',
                text: 'Betriebe und deren Venues ueberpruefen, neue Locations anlegen.',
                href: '/auth/venues',
              },
              {
                title: 'Event steuern',
                text: 'Events plattformweit ueberwachen, Entwuerfe bearbeiten und Lifecycles steuern.',
                href: '/auth/events',
              },
              {
                title: 'Team verwalten',
                text: 'Operatoren aller Betriebe pruefen, deaktivieren oder reaktivieren.',
                href: '/auth/operators',
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
                Operatoren werden geladen, sobald Backend-Endpunkte verfuegbar sind.
              </div>
            )}
            {operatorList.map((operator: Record<string, string>) => (
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
