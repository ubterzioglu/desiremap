'use client'

import { useState } from 'react'
import { CalendarRange, Rocket, SquareSlash } from 'lucide-react'
import { useAdminEvents, useCreateEvent, usePublishEvent, useCancelEvent } from '@/hooks/useQueries'
import { useAdminStore } from '@/stores/adminStore'
import { adminApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const emptyForm = { title: '', description: '', startAt: '', endAt: '', capacityTotal: '' }

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf', OPEN: 'Veröffentlicht', FULL: 'Ausgebucht', CLOSED: 'Geschlossen',
  CANCELLED: 'Abgesagt', POSTPONED: 'Verschoben', COMPLETED: 'Abgeschlossen',
}

export function OperatorEventsWorkspace() {
  const selectedVenuePublicId = useAdminStore((s) => s.selectedVenuePublicId)
  const [venueId, setVenueId] = useState(selectedVenuePublicId || '')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const { data: events = [], isLoading } = useAdminEvents(venueId || null)
  const createEvent = useCreateEvent()
  const publishEvent = usePublishEvent()
  const cancelEvent = useCancelEvent()

  const eventList = Array.isArray(events) ? events : []

  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    className: 'h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600',
  })

  const handleCreate = async () => {
    setError('')
    if (!venueId || !form.title || !form.startAt || !form.endAt) {
      setError('Venue-ID, Titel und Zeiten sind erforderlich.')
      return
    }
    try {
      await createEvent.mutateAsync({
        venuePublicId: venueId,
        title: form.title,
        description: form.description || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        capacityTotal: form.capacityTotal ? Number(form.capacityTotal) : undefined,
      })
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen')
    }
  }

  const handlePublish = async (eventPublicId: string) => {
    try {
      const detail = await adminApi.getEventDetail(venueId, eventPublicId)
      await publishEvent.mutateAsync({ action: 'publish', venuePublicId: venueId, eventPublicId, expectedLockVersion: detail.lockVersion })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish fehlgeschlagen')
    }
  }

  const handleCancel = async (eventPublicId: string) => {
    try {
      const detail = await adminApi.getEventDetail(venueId, eventPublicId)
      await cancelEvent.mutateAsync({ action: 'cancel', venuePublicId: venueId, eventPublicId, expectedLockVersion: detail.lockVersion })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel fehlgeschlagen')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Event-Verwaltung</div>
            <h2 className="mt-2 text-xl font-semibold text-white">Events & Freigaben</h2>
          </div>
          <Input
            placeholder="Venue Public ID"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="h-11 w-full border-white/10 bg-white/5 text-white md:w-72"
          />
        </div>

        {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        <div className="mt-5 space-y-3">
          {!venueId && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Venue-ID eingeben oder im Venues-Tab auswählen.
            </div>
          )}
          {venueId && isLoading && <p className="text-sm text-slate-500">Wird geladen...</p>}
          {venueId && !isLoading && eventList.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Keine Events gefunden. Legen Sie rechts einen neuen Event an.
            </div>
          )}
          {eventList.map((ev: any) => (
            <div key={ev.eventPublicId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-white">{ev.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {new Date(ev.startAt).toLocaleString('de-DE')} – {new Date(ev.endAt).toLocaleString('de-DE')}
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                  {STATUS_LABELS[ev.status] ?? ev.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                <span>Kapazität: {ev.capacityTotal ?? 'Offen'}</span>
                <span>·</span>
                <span>Reserviert: {ev.reservedCount ?? 0}</span>
                <span>·</span>
                <span>Modus: {ev.reservationMode}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5" onClick={() => handlePublish(ev.eventPublicId)}>
                  <Rocket className="mr-1.5 h-3.5 w-3.5" /> Publish
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5" onClick={() => handleCancel(ev.eventPublicId)}>
                  <SquareSlash className="mr-1.5 h-3.5 w-3.5" /> Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Neuer Event</div>
        <h2 className="mt-2 text-xl font-semibold text-white">Event anlegen</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Titel *" {...field('title')} />
          <Textarea placeholder="Beschreibung" {...field('description')} className="min-h-24 border-white/10 bg-white/5 text-white placeholder:text-slate-600" />
          <div className="grid gap-3">
            <Input type="datetime-local" {...field('startAt')} />
            <Input type="datetime-local" {...field('endAt')} />
          </div>
          <Input placeholder="Kapazität (optional)" {...field('capacityTotal')} />
          <Button onClick={handleCreate} disabled={createEvent.isPending || !venueId} className="w-full rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400">
            <CalendarRange className="mr-2 h-4 w-4" />
            {createEvent.isPending ? 'Wird erstellt...' : 'Event erstellen'}
          </Button>
        </div>
      </section>
    </div>
  )
}
