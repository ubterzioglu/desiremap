'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowRight, Bell, Calendar, Check, Crown, Loader2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useCreateBooking } from '@/hooks/useQueries'
import type { Bordell } from '@/types'

type StepProps = {
  bordell: Bordell
  selectedDate: string
  selectedTime: string
  duration: string
  autoReserve: boolean
  isPremium: boolean
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
  onDurationChange: (v: string) => void
  onAutoReserveChange: (v: boolean) => void
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between my-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
            step >= item
              ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white'
              : 'bg-white/5 text-gray-500'
          )}>
            {step > item ? <Check className="w-4 h-4" /> : item}
          </div>
          {item < 3 && (
            <div className={cn(
              'w-12 h-0.5 mx-2',
              step > item ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0]' : 'bg-white/10'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

function Step1({ 
  bordell, selectedDate, selectedTime, duration, autoReserve, isPremium,
  onDateChange, onTimeChange, onDurationChange, onAutoReserveChange 
}: StepProps) {
  const timeSlots = bordell.availableSlots || ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00', '21:00', '22:00']
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 mb-2 block">Datum</Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <Label className="text-gray-300 mb-2 block">Verfuegbare Zeiten</Label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              className={cn(
                'py-2 rounded-lg text-sm font-medium transition-all',
                selectedTime === time
                  ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-gray-300 mb-2 block">Dauer</Label>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a24] border-white/10">
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="60">1 Stunde</SelectItem>
            <SelectItem value="90">1.5 Stunden</SelectItem>
            <SelectItem value="120">2 Stunden</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="autoReserve"
            checked={autoReserve}
            onChange={(e) => onAutoReserveChange(e.target.checked)}
            className="mt-1 rounded bg-white/10 border-white/20"
            disabled={!isPremium}
          />
          <div className="flex-1">
            <Label htmlFor="autoReserve" className={cn(
              'text-sm font-medium flex items-center gap-2',
              !isPremium && 'text-gray-500'
            )}>
              <Bell className="w-4 h-4" />
              Automatische Reservierung
            </Label>
            <p className="text-gray-500 text-xs mt-1">
              {isPremium ? 'Muesaitlik acilinca otomatik rezervasyon' : 'Nur fuer Premium-Mitglieder'}
            </p>
          </div>
          {!isPremium && (
            <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] border-[#8b1a4a]/30">Premium</Badge>
          )}
        </div>
      </div>
    </div>
  )
}

interface Step2Props {
  name: string
  email: string
  phone: string
  notes: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onNotesChange: (v: string) => void
}

function Step2({ name, email, phone, notes, onNameChange, onEmailChange, onPhoneChange, onNotesChange }: Step2Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 mb-2 block">Name</Label>
        <Input
          placeholder="Ihr Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div>
        <Label className="text-gray-300 mb-2 block">E-Mail</Label>
        <Input
          type="email"
          placeholder="ihre@email.de"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div>
        <Label className="text-gray-300 mb-2 block">Telefon (optional)</Label>
        <Input
          type="tel"
          placeholder="+49 ..."
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div>
        <Label className="text-gray-300 mb-2 block">Notizen (optional)</Label>
        <Input
          placeholder="Sonderwuensche..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
    </div>
  )
}

function Step3({ 
  bordell, selectedDate, selectedTime, duration, autoReserve 
}: Pick<StepProps, 'bordell' | 'selectedDate' | 'selectedTime' | 'duration' | 'autoReserve'>) {
  const durationNum = parseInt(duration)
  const pricePerHour = bordell.minPrice || 50
  const estimatedPrice = (durationNum / 60) * pricePerHour

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Uebersicht</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Betrieb</span>
            <span className="text-white">{bordell.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Datum</span>
            <span className="text-white">{selectedDate || 'Heute'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Uhrzeit</span>
            <span className="text-white">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dauer</span>
            <span className="text-white">{duration} Min</span>
          </div>
          <Separator className="bg-white/10 my-2" />
          <div className="flex justify-between font-medium">
            <span className="text-gray-300">Preis ca.</span>
            <span className="text-[#b76e79]">€{estimatedPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>
      {autoReserve && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg p-3">
          <Bell className="w-4 h-4" />
          Automatische Reservierung aktiv
        </div>
      )}
      <div className="flex items-start gap-2 text-xs text-gray-400">
        <Shield className="w-4 h-4 text-[#b76e79] mt-0.5 flex-shrink-0" />
        <p>Diskrete Abrechnung. Stornierung bis 2h vorher kostenlos.</p>
      </div>
    </div>
  )
}

function StepButtons({ 
  step, 
  canProceed,
  onBack, 
  onNext, 
  onSubmit,
  isLoading 
}: { 
  step: number
  canProceed: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isLoading: boolean
}) {
  return (
    <div className="flex gap-3 mt-6">
      {step > 1 && (
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
        >
          Zurueck
        </Button>
      )}
      {step < 3 ? (
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="flex-1 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0"
        >
          Weiter <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird reserviert...</>
          ) : (
            <><Check className="w-4 h-4 mr-2" /> Reservieren</>
          )}
        </Button>
      )}
    </div>
  )
}

type ReservationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bordell: Bordell | null
}

export function ReservationModal({ open, onOpenChange, bordell }: ReservationModalProps) {
  const { data: session } = useSession()
  const createBooking = useCreateBooking()
  
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [autoReserve, setAutoReserve] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const isPremium = false
  const isAuthenticated = !!session?.user

  // Pre-fill user data if authenticated
  useState(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
    }
  })

  const resetForm = () => {
    setStep(1)
    setSelectedDate('')
    setSelectedTime('')
    setDuration('60')
    setAutoReserve(false)
    setName('')
    setEmail('')
    setPhone('')
    setNotes('')
    setSuccess(false)
    setError('')
  }

  const canProceed = () => {
    if (step === 1) {
      return !!(selectedDate && selectedTime)
    }
    if (step === 2) {
      return !!(name && email)
    }
    return true
  }

  const handleSubmit = async () => {
    if (!bordell || !isAuthenticated) return
    
    setError('')
    
    const durationNum = parseInt(duration)
    const pricePerHour = bordell.minPrice || 50
    const estimatedPrice = (durationNum / 60) * pricePerHour

    try {
      await createBooking.mutateAsync({
        bordellId: bordell.id,
        date: selectedDate,
        time: selectedTime,
        duration: durationNum,
        price: estimatedPrice,
        notes: notes || undefined
      })
      
      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Reservierung fehlgeschlagen')
    }
  }

  if (!bordell) return null

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0f0f14] border-white/10 text-white max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reservierung erfolgreich!</h3>
            <p className="text-gray-400">Sie erhalten eine Bestaetigung per E-Mail.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0f0f14] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#b76e79]" />
              Anmeldung erforderlich
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Bitte melden Sie sich an, um eine Reservierung zu erstellen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                onOpenChange(false)
                window.location.href = '/de/login'
              }}
              className="flex-1 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white"
            >
              Anmelden
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/10 text-gray-300"
            >
              Abbrechen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const stepProps = {
    bordell,
    selectedDate,
    selectedTime,
    duration,
    autoReserve,
    isPremium,
    onDateChange: setSelectedDate,
    onTimeChange: setSelectedTime,
    onDurationChange: setDuration,
    onAutoReserveChange: setAutoReserve
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent className="bg-[#0f0f14] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#b76e79]" />
            Reservierung
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {bordell.name} - {bordell.location}
          </DialogDescription>
        </DialogHeader>
        
        {isPremium && (
          <div className="bg-[#8b1a4a]/20 rounded-lg p-3 flex items-center gap-2 border border-[#8b1a4a]/30 text-sm">
            <Crown className="w-4 h-4 text-[#b76e79]" />
            <span className="text-white font-medium">Premium</span>
            <span className="text-gray-400">- Prioritaets-Reservierung aktiv</span>
          </div>
        )}
        
        <StepIndicator step={step} />
        
        {step === 1 && <Step1 {...stepProps} />}
        {step === 2 && (
          <Step2
            name={name}
            email={email}
            phone={phone}
            notes={notes}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onNotesChange={setNotes}
          />
        )}
        {step === 3 && (
          <Step3
            bordell={bordell}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            duration={duration}
            autoReserve={autoReserve}
          />
        )}
        
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
            {error}
          </div>
        )}
        
        <StepButtons
          step={step}
          canProceed={canProceed()}
          onBack={() => setStep((v) => v - 1)}
          onNext={() => setStep((v) => v + 1)}
          onSubmit={handleSubmit}
          isLoading={createBooking.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
