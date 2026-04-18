'use client'

import { useState } from 'react'
import { Globe, Building2, MapPin, Layers, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePublicEstablishments, usePublicCities, usePublicServiceTypes, useAdminSeed } from '@/hooks/useQueries'
import { useToast } from '@/hooks/use-toast'

export function AdminDiscoveryWorkspace() {
  const [filterCity, setFilterCity] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const { toast } = useToast()

  const { data: citiesResult } = usePublicCities()
  const { data: serviceTypesResult } = usePublicServiceTypes()
  const { data: result, isLoading } = usePublicEstablishments({
    city: filterCity || undefined,
    type: filterType || undefined,
    limit: 50,
  })
  const seed = useAdminSeed()

  const cities = citiesResult ?? []
  const serviceTypes = serviceTypesResult ?? []
  const establishments = result?.items ?? []
  const total = result?.total ?? 0

  const handleSeed = async () => {
    try {
      await seed.mutateAsync()
      toast({ title: 'Seed erfolgreich', description: 'Testdaten wurden in die Datenbank geschrieben.' })
    } catch (err) {
      toast({ title: 'Seed fehlgeschlagen', description: err instanceof Error ? err.message : 'Unbekannter Fehler', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Building2 className="h-5 w-5 text-teal-300" />} label="Establishments gesamt" value={total} />
        <StatCard icon={<MapPin className="h-5 w-5 text-teal-300" />} label="Städte" value={cities.length} />
        <StatCard icon={<Layers className="h-5 w-5 text-teal-300" />} label="Kategorien" value={serviceTypes.length} />
      </div>

      {/* Actions + Filters */}
      <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Public Daten</div>
            <h2 className="mt-2 text-xl font-semibold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-300" />
              Establishment Übersicht
            </h2>
          </div>
          <Button
            onClick={handleSeed}
            disabled={seed.isPending}
            className="rounded-2xl bg-teal-500 text-white hover:bg-teal-400"
          >
            <Sprout className="mr-2 h-4 w-4" />
            {seed.isPending ? 'Seed läuft...' : 'Seed ausführen'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={filterCity || '_all'} onValueChange={(v) => setFilterCity(v === '_all' ? '' : v)}>
            <SelectTrigger className="w-44 h-10 border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Stadt filtern" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a24] border-[#8b1a4a]/20">
              <SelectItem value="_all" className="text-gray-300">Alle Städte</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.slug} value={c.name} className="text-gray-300">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType || '_all'} onValueChange={(v) => setFilterType(v === '_all' ? '' : v)}>
            <SelectTrigger className="w-44 h-10 border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Typ filtern" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a24] border-[#8b1a4a]/20">
              <SelectItem value="_all" className="text-gray-300">Alle Typen</SelectItem>
              {serviceTypes.map((t) => (
                <SelectItem key={t.slug} value={t.slug} className="text-gray-300">{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && establishments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            Noch keine Establishments vorhanden. Seed-Button verwenden oder im Venues-Tab anlegen.
          </div>
        )}

        {!isLoading && establishments.length > 0 && (
          <div className="space-y-3">
            {establishments.map((est) => (
              <div key={est.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{est.name}</div>
                    <div className="mt-0.5 text-sm text-slate-400">{est.city} · {est.type.toUpperCase()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {est.rating != null && (
                      <span className="text-sm text-slate-300">★ {est.rating}</span>
                    )}
                    {est.verified && (
                      <span className="rounded-full bg-teal-400/10 border border-teal-400/20 px-2.5 py-0.5 text-xs text-teal-300">Verifiziert</span>
                    )}
                    <span className="text-xs text-slate-500">{est.slug}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-semibold text-white">{value}</div>
    </div>
  )
}
