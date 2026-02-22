'use client'

import { useState } from 'react'
import { ArrowRight, Bell, Calendar, Check, Crown, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Bordell } from '@/types'

type ReservationModalProps = { open: boolean; onOpenChange: (open: boolean) => void; bordell: Bordell | null }

export function ReservationModal({ open, onOpenChange, bordell }: ReservationModalProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('30')
  const [autoReserve, setAutoReserve] = useState(false)
  const isPremium = false
  if (!bordell) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/10 text-white max-w-md">
        <DialogHeader><DialogTitle className="text-xl flex items-center gap-2"><Calendar className="w-5 h-5 text-[#b76e79]" />Reservierung</DialogTitle><DialogDescription className="text-gray-400">{bordell.name} - {bordell.location}</DialogDescription></DialogHeader>
        {isPremium && <div className="bg-[#8b1a4a]/20 rounded-lg p-3 flex items-center gap-2 border border-[#8b1a4a]/30 text-sm"><Crown className="w-4 h-4 text-[#b76e79]" /><span className="text-white font-medium">Premium</span><span className="text-gray-400">- Prioritaets-Reservierung aktiv</span></div>}
        <div className="flex items-center justify-between my-4">{[1, 2, 3].map((item) => <div key={item} className="flex items-center"><div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all', step >= item ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white' : 'bg-white/5 text-gray-500')}>{step > item ? <Check className="w-4 h-4" /> : item}</div>{item < 3 && <div className={cn('w-12 h-0.5 mx-2', step > item ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0]' : 'bg-white/10')} />}</div>)}</div>
        {step === 1 && <div className="space-y-4"><div><Label className="text-gray-300 mb-2 block">Datum</Label><Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white/5 border-white/10 text-white" /></div><div><Label className="text-gray-300 mb-2 block">Verfuegbare Zeiten</Label><div className="grid grid-cols-3 gap-2">{bordell.availableSlots?.map((time) => <button key={time} onClick={() => setSelectedTime(time)} className={cn('py-2 rounded-lg text-sm font-medium transition-all', selectedTime === time ? 'bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10')}>{time}</button>)}</div></div><div><Label className="text-gray-300 mb-2 block">Dauer</Label><Select value={duration} onValueChange={setDuration}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#1a1a24] border-white/10"><SelectItem value="30">30 Min</SelectItem><SelectItem value="60">1 Stunde</SelectItem><SelectItem value="90">1.5 Stunden</SelectItem></SelectContent></Select></div><div className="bg-white/5 rounded-lg p-4"><div className="flex items-start gap-3"><input type="checkbox" id="autoReserve" checked={autoReserve} onChange={(e) => setAutoReserve(e.target.checked)} className="mt-1 rounded bg-white/10 border-white/20" disabled={!isPremium} /><div className="flex-1"><Label htmlFor="autoReserve" className={cn('text-sm font-medium flex items-center gap-2', !isPremium && 'text-gray-500')}><Bell className="w-4 h-4" />Automatische Reservierung</Label><p className="text-gray-500 text-xs mt-1">{isPremium ? 'Muesaitlik acilinca otomatik rezervasyon' : 'Nur fuer Premium-Mitglieder'}</p></div>{!isPremium && <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30">Premium</Badge>}</div></div></div>}
        {step === 2 && <div className="space-y-4"><div><Label className="text-gray-300 mb-2 block">Name</Label><Input placeholder="Ihr Name" className="bg-white/5 border-white/10 text-white" /></div><div><Label className="text-gray-300 mb-2 block">E-Mail</Label><Input type="email" placeholder="ihre@email.de" className="bg-white/5 border-white/10 text-white" /></div><div><Label className="text-gray-300 mb-2 block">Telefon</Label><Input type="tel" placeholder="+49 ..." className="bg-white/5 border-white/10 text-white" /></div></div>}
        {step === 3 && <div className="space-y-4"><div className="bg-white/5 rounded-lg p-4"><h4 className="text-sm font-medium text-gray-300 mb-3">Uebersicht</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-400">Betrieb</span><span className="text-white">{bordell.name}</span></div><div className="flex justify-between"><span className="text-gray-400">Datum</span><span className="text-white">{selectedDate || 'Heute'}</span></div><div className="flex justify-between"><span className="text-gray-400">Uhrzeit</span><span className="text-white">{selectedTime}</span></div><div className="flex justify-between"><span className="text-gray-400">Dauer</span><span className="text-white">{duration} Min</span></div><Separator className="bg-white/10 my-2" /><div className="flex justify-between font-medium"><span className="text-gray-300">Preis ca.</span><span className="text-[#b76e79]">{bordell.priceRange}</span></div></div></div>{autoReserve && <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg p-3"><Bell className="w-4 h-4" />Automatische Reservierung aktiv</div>}<div className="flex items-start gap-2 text-xs text-gray-400"><Shield className="w-4 h-4 text-[#b76e79] mt-0.5 flex-shrink-0" /><p>Diskrete Abrechnung. Stornierung bis 2h vorher kostenlos.</p></div></div>}
        <div className="flex gap-3 mt-6">{step > 1 && <Button variant="outline" onClick={() => setStep((value) => value - 1)} className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">Zurueck</Button>}{step < 3 ? <Button onClick={() => setStep((value) => value + 1)} className="flex-1 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0">Weiter <ArrowRight className="w-4 h-4 ml-2" /></Button> : <Button onClick={() => onOpenChange(false)} className="flex-1 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0"><Check className="w-4 h-4 mr-2" /> Reservieren</Button>}</div>
      </DialogContent>
    </Dialog>
  )
}
