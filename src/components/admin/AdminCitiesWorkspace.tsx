'use client'

import { useState } from 'react'
import { MapPin, Pencil, Plus, Trash2, X, Check } from 'lucide-react'
import { useAdminCities, useCreateCity, useUpdateCity, useDeleteCity } from '@/hooks/useQueries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AdminCityPayload, AdminCityResponse } from '@/lib/api'

type CityFormState = {
  name: string
  slug: string
  publicImageUrl: string
  publicHeroImageUrl: string
  latitude: string
  longitude: string
  publicSubtitleJson: string
  publicDescriptionJson: string
  seoTitleJson: string
  seoDescriptionJson: string
  isPublicActive: boolean
  sortOrder: string
}

const emptyForm: CityFormState = {
  name: '',
  slug: '',
  publicImageUrl: '',
  publicHeroImageUrl: '',
  latitude: '',
  longitude: '',
  publicSubtitleJson: '',
  publicDescriptionJson: '',
  seoTitleJson: '',
  seoDescriptionJson: '',
  isPublicActive: true,
  sortOrder: '',
}

function stringifyLocalized(value: Record<string, string | null> | null | undefined) {
  return value && Object.keys(value).length > 0
    ? JSON.stringify(value, null, 2)
    : ''
}

function cityToForm(city: AdminCityResponse): CityFormState {
  return {
    name: city.name,
    slug: city.slug,
    publicImageUrl: city.publicImageUrl ?? '',
    publicHeroImageUrl: city.publicHeroImageUrl ?? '',
    latitude: city.latitude == null ? '' : String(city.latitude),
    longitude: city.longitude == null ? '' : String(city.longitude),
    publicSubtitleJson: stringifyLocalized(city.publicSubtitle),
    publicDescriptionJson: stringifyLocalized(city.publicDescription),
    seoTitleJson: stringifyLocalized(city.seoTitle),
    seoDescriptionJson: stringifyLocalized(city.seoDescription),
    isPublicActive: city.isPublicActive ?? true,
    sortOrder: city.sortOrder == null ? '' : String(city.sortOrder),
  }
}

function parseNullableNumber(value: string, fieldName: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} muss eine Zahl sein.`)
  }

  return parsed
}

function parseLocalizedJson(value: string, fieldName: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const parsed = JSON.parse(trimmed) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${fieldName} muss ein JSON-Objekt sein.`)
  }

  return parsed as Record<string, string | null>
}

function formToPayload(form: CityFormState): AdminCityPayload {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    publicImageUrl: form.publicImageUrl.trim() || null,
    publicHeroImageUrl: form.publicHeroImageUrl.trim() || null,
    latitude: parseNullableNumber(form.latitude, 'Latitude'),
    longitude: parseNullableNumber(form.longitude, 'Longitude'),
    publicSubtitle: parseLocalizedJson(form.publicSubtitleJson, 'Public Subtitle'),
    publicDescription: parseLocalizedJson(form.publicDescriptionJson, 'Public Description'),
    seoTitle: parseLocalizedJson(form.seoTitleJson, 'SEO Title'),
    seoDescription: parseLocalizedJson(form.seoDescriptionJson, 'SEO Description'),
    isPublicActive: form.isPublicActive,
    sortOrder: parseNullableNumber(form.sortOrder, 'Sort Order'),
  }
}

function CityFormFields({
  form,
  onChange,
}: {
  form: CityFormState
  onChange: (field: keyof CityFormState, value: string | boolean) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Name (z.B. Berlin) *"
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        <Input
          placeholder="Slug (z.B. berlin) *"
          value={form.slug}
          onChange={e => onChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Card Image URL"
          value={form.publicImageUrl}
          onChange={e => onChange('publicImageUrl', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        <Input
          placeholder="Hero Image URL"
          value={form.publicHeroImageUrl}
          onChange={e => onChange('publicHeroImageUrl', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Latitude"
          value={form.latitude}
          onChange={e => onChange('latitude', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        <Input
          placeholder="Longitude"
          value={form.longitude}
          onChange={e => onChange('longitude', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        <Input
          placeholder="Sort Order"
          value={form.sortOrder}
          onChange={e => onChange('sortOrder', e.target.value)}
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.isPublicActive}
          onChange={e => onChange('isPublicActive', e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-white/5"
        />
        Public Stadt-Seite aktiv
      </label>
      <Textarea
        placeholder='Public Subtitle JSON, z.B. {"de":"Premium-Adressen","en":"Premium venues"}'
        value={form.publicSubtitleJson}
        onChange={e => onChange('publicSubtitleJson', e.target.value)}
        className="min-h-20 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
      />
      <Textarea
        placeholder='Public Description JSON, z.B. {"de":"Beschreibung fuer Berlin"}'
        value={form.publicDescriptionJson}
        onChange={e => onChange('publicDescriptionJson', e.target.value)}
        className="min-h-24 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
      />
      <Textarea
        placeholder='SEO Title JSON, z.B. {"de":"Berlin | DesireMap"}'
        value={form.seoTitleJson}
        onChange={e => onChange('seoTitleJson', e.target.value)}
        className="min-h-20 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
      />
      <Textarea
        placeholder='SEO Description JSON, z.B. {"de":"Diskrete Empfehlungen fuer Berlin."}'
        value={form.seoDescriptionJson}
        onChange={e => onChange('seoDescriptionJson', e.target.value)}
        className="min-h-20 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
      />
    </div>
  )
}

interface CityRowProps {
  city: AdminCityResponse
  editingId: number | null
  editForm: CityFormState
  editError: string
  deletingId: number | null
  isPendingUpdate: boolean
  onStartEdit: (city: AdminCityResponse) => void
  onCancelEdit: () => void
  onUpdate: (cityId: number) => void
  onDelete: (cityId: number) => void
  onEditFormChange: (field: keyof CityFormState, value: string | boolean) => void
}

function CityRow({
  city, editingId, editForm, editError, deletingId, isPendingUpdate,
  onStartEdit, onCancelEdit, onUpdate, onDelete, onEditFormChange,
}: CityRowProps) {
  const isEditing = editingId === city.cityId

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">
      {isEditing ? (
        <div className="space-y-3">
          <CityFormFields form={editForm} onChange={onEditFormChange} />
          {editError && <p className="text-xs text-red-400">{editError}</p>}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onUpdate(city.cityId)} disabled={isPendingUpdate}
              className="rounded-xl bg-teal-400 text-slate-950 hover:bg-teal-300">
              <Check className="mr-1 h-3 w-3" />Speichern
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit}
              className="rounded-xl text-slate-400 hover:text-white">
              <X className="mr-1 h-3 w-3" />Abbrechen
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{city.name}</div>
              <div className="text-xs text-slate-500">
                /{city.slug} · ID {city.cityId} · {city.venueCount ?? 0} Venues
              </div>
              <div className="text-xs text-slate-600">
                Public: {city.isPublicActive === false ? 'inaktiv' : 'aktiv'} · Sort {city.sortOrder ?? '-'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => onStartEdit(city)}
              className="rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-100">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(city.cityId)}
              disabled={deletingId === city.cityId}
              className="rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminCitiesWorkspace() {
  const { data: cities = [], isLoading } = useAdminCities()

  const [createForm, setCreateForm] = useState(emptyForm)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editError, setEditError] = useState('')

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const createMut = useCreateCity()
  const updateMut = useUpdateCity()
  const deleteMut = useDeleteCity()

  const handleCreate = () => {
    setCreateError('')
    setCreateSuccess('')

    let payload: AdminCityPayload & { name: string; slug: string }
    try {
      payload = formToPayload(createForm) as AdminCityPayload & { name: string; slug: string }
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Ungueltige Stadtdaten.')
      return
    }

    createMut.mutate(payload, {
      onSuccess: () => {
        setCreateForm(emptyForm)
        setCreateSuccess('Stadt erfolgreich erstellt!')
        setTimeout(() => setCreateSuccess(''), 4000)
      },
      onError: (e: Error) => setCreateError(e.message),
    })
  }

  const startEdit = (city: AdminCityResponse) => {
    setEditingId(city.cityId)
    setEditForm(cityToForm(city))
    setEditError('')
  }

  const handleUpdate = (cityId: number) => {
    setEditError('')

    let payload: AdminCityPayload
    try {
      payload = formToPayload(editForm)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Ungueltige Stadtdaten.')
      return
    }

    updateMut.mutate({ cityId, ...payload }, {
      onSuccess: () => setEditingId(null),
      onError: (e: Error) => setEditError(e.message),
    })
  }

  const handleDelete = (cityId: number) => {
    setDeletingId(cityId)
    deleteMut.mutate(cityId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Neue Stadt</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Stadt anlegen</h2>
        <div className="mt-6 space-y-4">
          <CityFormFields
            form={createForm}
            onChange={(field, value) => setCreateForm(s => ({ ...s, [field]: value }))}
          />
          {createError && <p className="text-sm text-red-400">{createError}</p>}
          {createSuccess && <p className="text-sm text-teal-400">{createSuccess}</p>}
          <Button
            onClick={handleCreate}
            disabled={createMut.isPending || !createForm.name || !createForm.slug}
            className="w-full rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createMut.isPending ? 'Wird erstellt...' : 'Stadt erstellen'}
          </Button>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Städte ({cities.length})</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Alle Städte</h2>

        <div className="mt-5 space-y-3">
          {isLoading && <p className="text-sm text-slate-400">Lädt...</p>}
          {!isLoading && cities.length === 0 && (
            <p className="text-sm text-slate-500">Keine Städte gefunden.</p>
          )}

          {cities.map(city => (
            <CityRow
              key={city.cityId}
              city={city}
              editingId={editingId}
              editForm={editForm}
              editError={editError}
              deletingId={deletingId}
              isPendingUpdate={updateMut.isPending}
              onStartEdit={startEdit}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEditFormChange={(field, value) => setEditForm(s => ({ ...s, [field]: value }))}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
