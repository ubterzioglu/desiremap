'use client'

import { useState } from 'react'
import { MapPin, Pencil, Plus, Trash2, X, Check } from 'lucide-react'
import { useAdminCities, useCreateCity, useUpdateCity, useDeleteCity } from '@/hooks/useQueries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AdminCityResponse } from '@/lib/api'

const emptyForm = { name: '', slug: '' }

interface CityRowProps {
  city: AdminCityResponse
  editingId: number | null
  editForm: { name: string; slug: string }
  editError: string
  deletingId: number | null
  isPendingUpdate: boolean
  onStartEdit: (city: AdminCityResponse) => void
  onCancelEdit: () => void
  onUpdate: (cityId: number) => void
  onDelete: (cityId: number) => void
  onEditFormChange: (field: 'name' | 'slug', value: string) => void
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
          <Input
            value={editForm.name}
            onChange={e => onEditFormChange('name', e.target.value)}
            className="h-10 border-white/10 bg-white/5 text-white"
          />
          <Input
            value={editForm.slug}
            onChange={e => onEditFormChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="h-10 border-white/10 bg-white/5 text-white"
          />
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
              <div className="text-xs text-slate-500">/{city.slug} · ID {city.cityId}</div>
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
    createMut.mutate(createForm, {
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
    setEditForm({ name: city.name, slug: city.slug })
    setEditError('')
  }

  const handleUpdate = (cityId: number) => {
    setEditError('')
    updateMut.mutate({ cityId, ...editForm }, {
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
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      {/* Create City */}
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Neue Stadt</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Stadt anlegen</h2>
        <div className="mt-6 space-y-4">
          <Input
            placeholder="Name (z.B. Berlin) *"
            value={createForm.name}
            onChange={e => setCreateForm(s => ({ ...s, name: e.target.value }))}
            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
          />
          <Input
            placeholder="Slug (z.B. berlin) *"
            value={createForm.slug}
            onChange={e => setCreateForm(s => ({ ...s, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
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

      {/* City List */}
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
