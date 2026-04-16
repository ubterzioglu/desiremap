'use client'

import { useMemo, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useAdminVenues, useCreateVenue } from '@/hooks/useQueries'
import { useAdminStore } from '@/stores/adminStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const initialForm = {
  name: '',
  addressLine: '',
  cityId: '',
  website: '',
  publicEmail: '',
  publicPhone: '',
  serviceTypeIds: '',
  generalNote: '',
}

export function AdminVenuesWorkspace() {
  const { data: venues = [] } = useAdminVenues()
  const createVenue = useCreateVenue()
  const setSelectedVenuePublicId = useAdminStore((state) => state.setSelectedVenuePublicId)
  const selectedVenuePublicId = useAdminStore((state) => state.selectedVenuePublicId)
  const [form, setForm] = useState(initialForm)

  const normalizedVenues = useMemo(() => Array.isArray(venues) ? venues : [], [venues])

  const handleSubmit = async () => {
    const cityId = Number(form.cityId)
    const serviceTypeIds = form.serviceTypeIds
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0)

    const result = await createVenue.mutateAsync({
      name: form.name,
      addressLine: form.addressLine,
      cityId,
      website: form.website || undefined,
      publicEmail: form.publicEmail || undefined,
      publicPhone: form.publicPhone || undefined,
      serviceTypeIds,
      generalNote: form.generalNote || undefined,
    })

    if (result?.venuePublicId) {
      setSelectedVenuePublicId(result.venuePublicId)
    }

    setForm(initialForm)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Managed Venue Context</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Venue Auswahl und Fallback</h2>
        </div>

        <div className="mt-5 space-y-3">
          {normalizedVenues.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Kein Listing-Endpunkt verifiziert. Diese Ansicht nutzt den konfigurierten Venue-Kontext oder den ersten erfolgreich angelegten Datensatz.
            </div>
          )}

          {normalizedVenues.map((venue: any) => {
            const isSelected = selectedVenuePublicId === venue.venuePublicId

            return (
              <button
                key={venue.venuePublicId}
                onClick={() => setSelectedVenuePublicId(venue.venuePublicId)}
                className="flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-teal-400/30 hover:bg-white/[0.05]"
              >
                <div>
                  <div className="text-sm font-medium text-white">{venue.venueName}</div>
                  <div className="mt-1 text-xs text-slate-500">{venue.venuePublicId}</div>
                </div>
                {isSelected && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/15 text-teal-200">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Create Venue</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Neue Location anlegen</h2>
        <p className="mt-2 text-sm text-slate-400">City- und Service-Typen werden vorerst als manuelle IDs eingegeben, bis die oeffentlichen Referenzendpunkte verfuegbar sind.</p>

        <div className="mt-6 space-y-4">
          <Input placeholder="Venue Name" value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          <Input placeholder="Address Line" value={form.addressLine} onChange={(event) => setForm((state) => ({ ...state, addressLine: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="City ID" value={form.cityId} onChange={(event) => setForm((state) => ({ ...state, cityId: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
            <Input placeholder="Service Type IDs (1,2,3)" value={form.serviceTypeIds} onChange={(event) => setForm((state) => ({ ...state, serviceTypeIds: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Public Email" value={form.publicEmail} onChange={(event) => setForm((state) => ({ ...state, publicEmail: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
            <Input placeholder="Public Phone" value={form.publicPhone} onChange={(event) => setForm((state) => ({ ...state, publicPhone: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          </div>
          <Input placeholder="Website" value={form.website} onChange={(event) => setForm((state) => ({ ...state, website: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          <Textarea placeholder="General note" value={form.generalNote} onChange={(event) => setForm((state) => ({ ...state, generalNote: event.target.value }))} className="min-h-28 border-white/10 bg-white/5 text-white" />

          <Button
            onClick={handleSubmit}
            disabled={createVenue.isPending}
            className="w-full rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createVenue.isPending ? 'Wird erstellt...' : 'Venue erstellen'}
          </Button>
        </div>
      </section>
    </div>
  )
}
