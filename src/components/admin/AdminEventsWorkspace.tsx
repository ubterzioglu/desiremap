'use client'

import { useMemo, useState } from 'react'
import { CalendarRange, Rocket, SquareSlash } from 'lucide-react'
import { useAdminEvents, useCancelEvent, useCreateEvent, usePublishEvent } from '@/hooks/useQueries'
import { useAdminStore } from '@/stores/adminStore'
import { adminApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getConfiguredVenuePublicId } from '@/lib/admin-config'

const initialForm = {
  title: '',
  description: '',
  startAt: '',
  endAt: '',
  capacityTotal: '',
}

export function AdminEventsWorkspace() {
  const configuredVenuePublicId = getConfiguredVenuePublicId()
  const selectedVenuePublicId = useAdminStore((state) => state.selectedVenuePublicId) || configuredVenuePublicId
  const [venuePublicId, setVenuePublicId] = useState(selectedVenuePublicId || '')
  const [form, setForm] = useState(initialForm)
  const { data: events = [], isLoading } = useAdminEvents(venuePublicId || null)
  const createEvent = useCreateEvent()
  const publishEvent = usePublishEvent()
  const cancelEvent = useCancelEvent()

  const eventItems = useMemo(() => Array.isArray(events) ? events : [], [events])

  const handleCreateEvent = async () => {
    await createEvent.mutateAsync({
      venuePublicId,
      title: form.title,
      description: form.description || undefined,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      capacityTotal: form.capacityTotal ? Number(form.capacityTotal) : undefined,
    })

    setForm(initialForm)
  }

  const handlePublish = async (eventPublicId: string) => {
    const detail = await adminApi.getEventDetail(venuePublicId, eventPublicId)
    await publishEvent.mutateAsync({
      action: 'publish',
      venuePublicId,
      eventPublicId,
      expectedLockVersion: detail.lockVersion,
    })
  }

  const handleCancel = async (eventPublicId: string) => {
    const detail = await adminApi.getEventDetail(venuePublicId, eventPublicId)
    await cancelEvent.mutateAsync({
      action: 'cancel',
      venuePublicId,
      eventPublicId,
      expectedLockVersion: detail.lockVersion,
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Event Lifecycle</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Venue Events und Freigaben</h2>
          </div>
          <div className="w-full md:w-[360px]">
            <Input
              placeholder="Venue Public ID"
              value={venuePublicId}
              onChange={(event) => setVenuePublicId(event.target.value)}
              className="h-12 border-white/10 bg-white/5 text-white"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {!venuePublicId && (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Waehle oder konfiguriere zuerst ein Venue. Ohne Venue-Kontext laedt die Event-Liste bewusst nicht.
            </div>
          )}

          {venuePublicId && !isLoading && eventItems.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Keine oeffentlichen Events gefunden. Entwuerfe erscheinen nach Erstellung und nach Publish auch im Public-Endpunkt.
            </div>
          )}

          {eventItems.map((event: any) => (
            <div key={event.eventPublicId} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium text-white">{event.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {new Date(event.startAt).toLocaleString('de-DE')} - {new Date(event.endAt).toLocaleString('de-DE')}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                  {event.status}
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
                <div>Kapazitaet: {event.capacityTotal ?? 'Open'}</div>
                <div>Reserviert: {event.reservedCount ?? 0}</div>
                <div>Modus: {event.reservationMode}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                  onClick={() => handlePublish(event.eventPublicId)}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Publish
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                  onClick={() => handleCancel(event.eventPublicId)}
                >
                  <SquareSlash className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Create Event</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Neuen Event anlegen</h2>
        <div className="mt-6 space-y-4">
          <Input placeholder="Titel" value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          <Textarea placeholder="Beschreibung" value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} className="min-h-28 border-white/10 bg-white/5 text-white" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input type="datetime-local" value={form.startAt} onChange={(event) => setForm((state) => ({ ...state, startAt: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
            <Input type="datetime-local" value={form.endAt} onChange={(event) => setForm((state) => ({ ...state, endAt: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          </div>
          <Input placeholder="Kapazitaet" value={form.capacityTotal} onChange={(event) => setForm((state) => ({ ...state, capacityTotal: event.target.value }))} className="h-12 border-white/10 bg-white/5 text-white" />
          <Button onClick={handleCreateEvent} disabled={!venuePublicId || createEvent.isPending} className="w-full rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300">
            <CalendarRange className="mr-2 h-4 w-4" />
            {createEvent.isPending ? 'Wird erstellt...' : 'Event erstellen'}
          </Button>
        </div>
      </section>
    </div>
  )
}
