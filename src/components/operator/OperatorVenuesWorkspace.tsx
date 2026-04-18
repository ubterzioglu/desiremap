'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useAdminVenues, useCreateVenue, usePublicCities, usePublicServiceTypes } from '@/hooks/useQueries'
import { useAdminStore } from '@/stores/adminStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const emptyForm = {
  name: '', addressLine: '', cityId: '', website: '', publicEmail: '', publicPhone: '', serviceTypeIds: '', generalNote: '',
}

export function OperatorVenuesWorkspace() {
  const { data: venues = [], isLoading } = useAdminVenues()
  const createVenue = useCreateVenue()
  const selectedVenuePublicId = useAdminStore((s) => s.selectedVenuePublicId)
  const setSelectedVenuePublicId = useAdminStore((s) => s.setSelectedVenuePublicId)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [selectedServiceTypeIds, setSelectedServiceTypeIds] = useState<number[]>([])
  const { data: cities = [] } = usePublicCities()
  const { data: serviceTypes = [] } = usePublicServiceTypes()

  const venueList = Array.isArray(venues) ? venues : []

  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    className: 'h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600',
  })

  const handleCreate = async () => {
    setError('')
    if (!form.name || !form.addressLine || !form.cityId) {
      setError('Name, Adresse und Stadt sind erforderlich.')
      return
    }
    try {
      const result = await createVenue.mutateAsync({
        name: form.name,
        addressLine: form.addressLine,
        cityId: Number(form.cityId),
        website: form.website || undefined,
        publicEmail: form.publicEmail || undefined,
        publicPhone: form.publicPhone || undefined,
        generalNote: form.generalNote || undefined,
        serviceTypeIds: selectedServiceTypeIds,
      })
      if ((result as any)?.venuePublicId) {
        setSelectedVenuePublicId((result as any).venuePublicId)
      }
      setForm(emptyForm)
      setSelectedServiceTypeIds([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Ihre Venues</div>
        <h2 className="mt-2 text-xl font-semibold text-white">Venue auswählen</h2>
        <div className="mt-5 space-y-3">
          {isLoading && <p className="text-sm text-slate-500">Wird geladen...</p>}
          {!isLoading && venueList.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Noch kein Venue angelegt. Legen Sie rechts ein neues Venue an.
            </div>
          )}
          {venueList.map((v: any) => (
            <button
              key={v.venuePublicId}
              onClick={() => setSelectedVenuePublicId(v.venuePublicId)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left hover:border-indigo-400/30 hover:bg-white/[0.05] transition"
            >
              <div>
                <div className="text-sm font-medium text-white">{v.venueName ?? v.name}</div>
                <div className="mt-1 text-xs text-slate-500">{v.venuePublicId}</div>
              </div>
              {selectedVenuePublicId === v.venuePublicId && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400/15 text-indigo-200">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Neues Venue</div>
        <h2 className="mt-2 text-xl font-semibold text-white">Venue anlegen</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Venue Name *" {...field('name')} />
          <Input placeholder="Adresse *" {...field('addressLine')} />
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={form.cityId} onValueChange={(v) => setForm((f) => ({ ...f, cityId: v }))}>
              <SelectTrigger className="h-12 border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Stadt auswählen *" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-[#8b1a4a]/20">
                {cities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-gray-300">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <div className="text-xs text-slate-600 uppercase tracking-widest">Service-Typen</div>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((st) => {
                  const selected = selectedServiceTypeIds.includes(st.id)
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedServiceTypeIds((prev) => selected ? prev.filter((id) => id !== st.id) : [...prev, st.id])}
                      className={`rounded-full px-3 py-1 text-xs border transition ${selected ? 'bg-indigo-400/20 border-indigo-400/40 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      {st.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="E-Mail (öffentlich)" {...field('publicEmail')} />
            <Input placeholder="Telefon (öffentlich)" {...field('publicPhone')} />
          </div>
          <Input placeholder="Website" {...field('website')} />
          <Textarea placeholder="Interne Notiz" {...field('generalNote')} className="min-h-24 border-white/10 bg-white/5 text-white placeholder:text-slate-600" />
          {error && <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          <Button onClick={handleCreate} disabled={createVenue.isPending} className="w-full rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400">
            <Plus className="mr-2 h-4 w-4" />
            {createVenue.isPending ? 'Wird erstellt...' : 'Venue erstellen'}
          </Button>
        </div>
      </section>
    </div>
  )
}
