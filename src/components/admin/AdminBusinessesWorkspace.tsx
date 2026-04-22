'use client'

import { useState } from 'react'
import { Building2, ChevronDown, ChevronUp, Plus, UserPlus } from 'lucide-react'
import { useAdminBusinesses, useCreateBusiness, useCreateOperator } from '@/hooks/useQueries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emptyBiz = { legalName: '', displayName: '', billingEmail: '', billingPhone: '' }
const emptyOp = { email: '', password: '', displayName: '' }

export function AdminBusinessesWorkspace() {
  const { data: businesses = [], isLoading } = useAdminBusinesses()

  const [bizForm, setBizForm] = useState(emptyBiz)
  const [bizError, setBizError] = useState('')
  const [bizSuccess, setBizSuccess] = useState('')

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [opForm, setOpForm] = useState(emptyOp)
  const [opError, setOpError] = useState('')
  const [opSuccess, setOpSuccess] = useState('')

  const createBizMut = useCreateBusiness()
  const createOpMut = useCreateOperator()

  const handleCreateBiz = () => {
    setBizError('')
    setBizSuccess('')
    createBizMut.mutate(bizForm, {
      onSuccess: () => {
        setBizForm(emptyBiz)
        setBizSuccess('Business erfolgreich erstellt!')
        setTimeout(() => setBizSuccess(''), 4000)
      },
      onError: (e: Error) => setBizError(e.message),
    })
  }

  const handleCreateOp = (businessId: string) => {
    setOpError('')
    setOpSuccess('')
    createOpMut.mutate({ businessId, ...opForm }, {
      onSuccess: () => {
        setOpForm(emptyOp)
        setOpSuccess('Operator-Account erstellt! Passwort-Reset beim ersten Login erforderlich.')
        setTimeout(() => setOpSuccess(''), 6000)
      },
      onError: (e: Error) => setOpError(e.message),
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      {/* Create Business */}
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Neues Business</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Business anlegen</h2>
        <div className="mt-6 space-y-4">
          <Input placeholder="Firmenname (legal) *" value={bizForm.legalName} onChange={e => setBizForm(s => ({ ...s, legalName: e.target.value }))} className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
          <Input placeholder="Anzeigename *" value={bizForm.displayName} onChange={e => setBizForm(s => ({ ...s, displayName: e.target.value }))} className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
          <Input placeholder="Rechnungs-E-Mail *" type="email" value={bizForm.billingEmail} onChange={e => setBizForm(s => ({ ...s, billingEmail: e.target.value }))} className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
          <Input placeholder="Telefon (optional)" value={bizForm.billingPhone} onChange={e => setBizForm(s => ({ ...s, billingPhone: e.target.value }))} className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
          {bizError && <p className="text-sm text-red-400">{bizError}</p>}
          {bizSuccess && <p className="text-sm text-teal-400">{bizSuccess}</p>}
          <Button onClick={handleCreateBiz} disabled={createBizMut.isPending || !bizForm.legalName || !bizForm.displayName || !bizForm.billingEmail} className="w-full rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300">
            <Plus className="mr-2 h-4 w-4" />
            {createBizMut.isPending ? 'Wird erstellt...' : 'Business erstellen'}
          </Button>
        </div>
      </section>

      {/* Business List */}
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Businesses ({businesses.length})</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Alle Betriebe</h2>
        <div className="mt-5 space-y-3">
          {isLoading && <p className="text-sm text-slate-400">Lädt...</p>}
          {businesses.map(biz => (
            <div key={biz.id} className="rounded-[24px] border border-white/10 bg-white/[0.03]">
              <button
                onClick={() => { setExpandedId(expandedId === biz.id ? null : biz.id); setOpForm(emptyOp); setOpError(''); setOpSuccess('') }}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{biz.display_name}</div>
                    <div className="text-xs text-slate-500">{biz.billing_email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${biz.status === 'ACTIVE' ? 'bg-teal-400/10 text-teal-300' : 'bg-red-400/10 text-red-300'}`}>{biz.status}</span>
                  {expandedId === biz.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </button>

              {expandedId === biz.id && (
                <div className="border-t border-white/10 px-5 pb-5 pt-4">
                  <div className="mb-3 text-xs text-slate-500">Public ID: <span className="font-mono text-slate-400">{biz.public_id}</span></div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Operator-Account erstellen</div>
                  <div className="space-y-3">
                    <Input placeholder="E-Mail *" type="email" value={opForm.email} onChange={e => setOpForm(s => ({ ...s, email: e.target.value }))} className="h-10 border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500" />
                    <Input placeholder="Anzeigename *" value={opForm.displayName} onChange={e => setOpForm(s => ({ ...s, displayName: e.target.value }))} className="h-10 border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500" />
                    <Input placeholder="Initiales Passwort *" type="password" value={opForm.password} onChange={e => setOpForm(s => ({ ...s, password: e.target.value }))} className="h-10 border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500" />
                    {opError && <p className="text-xs text-red-400">{opError}</p>}
                    {opSuccess && <p className="text-xs text-teal-400">{opSuccess}</p>}
                    <Button size="sm" onClick={() => handleCreateOp(biz.id)} disabled={createOpMut.isPending || !opForm.email || !opForm.password || !opForm.displayName} className="w-full rounded-xl bg-teal-400/20 text-teal-200 hover:bg-teal-400/30 border border-teal-400/20">
                      <UserPlus className="mr-2 h-3.5 w-3.5" />
                      {createOpMut.isPending ? 'Erstellt...' : 'Operator-Account anlegen'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
