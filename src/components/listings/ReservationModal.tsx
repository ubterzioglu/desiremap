 'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ArrowRight, Bell, Calendar, Check, Crown, Loader2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getLocalizedPath } from '@/lib/navigation'
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
    <div className="my-4 flex items-center justify-between">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center">
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all',
            step >= item
              ? 'bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white'
              : 'bg-white/5 text-gray-500'
          )}>
            {step > item ? <Check className="h-4 w-4" /> : item}
          </div>
          {item < 3 && (
            <div className={cn(
              'mx-2 h-0.5 w-12',
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
        <Label className="mb-2 block text-gray-300">Datum</Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="border-white/10 bg-white/5 text-white"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <Label className="mb-2 block text-gray-300">Verfuegbare Zeiten</Label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              className={cn(
                'rounded-lg py-2 text-sm font-medium transition-all',
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
        <Label className="mb-2 block text-gray-300">Dauer</Label>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger className="border-white/10 bg-white/5 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#1a1a24]">
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="60">1 Stunde</SelectItem>
            <SelectItem value="90">1.5 Stunden</SelectItem>
            <SelectItem value="120">2 Stunden</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="autoReserve"
            checked={autoReserve}
            onChange={(e) => onAutoReserveChange(e.target.checked)}
            className="mt-1 rounded border-white/20 bg-white/10"
            disabled={!isPremium}
          />
          <div className="flex-1">
            <Label htmlFor="autoReserve" className={cn(
              'flex items-center gap-2 text-sm font-medium',
              !isPremium && 'text-gray-500'
            )}>
              <Bell className="h-4 w-4" />
              Automatische Reservierung
            </Label>
            <p className="mt-1 text-xs text-gray-500">
              {isPremium ? 'Muesaitlik acilinca otomatik rezervasyon' : 'Nur fuer Premium-Mitglieder'}
            </p>
          </div>
          {!isPremium && (
            <Badge className="border-[#8b1a4a]/30 bg-[#8b1a4a]/20 text-[#b76e79]">Premium</Badge>
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
        <Label className="mb-2 block text-gray-300">Name</Label>
        <Input
          placeholder="Ihr Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="border-white/10 bg-white/5 text-white"
        />
      </div>
      <div>
        <Label className="mb-2 block text-gray-300">E-Mail</Label>
        <Input
          type="email"
          placeholder="ihre@email.de"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="border-white/10 bg-white/5 text-white"
        />
      </div>
      <div>
        <Label className="mb-2 block text-gray-300">Telefon (optional)</Label>
        <Input
          type="tel"
          placeholder="+49 ..."
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="border-white/10 bg-white/5 text-white"
        />
      </div>
      <div>
        <Label className="mb-2 block text-gray-300">Notizen (optional)</Label>
        <Input
          placeholder="Sonderwuensche..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="border-white/10 bg-white/5 text-white"
        />
      </div>
    </div>
  )
}

type Step3Props = Pick<StepProps, 'bordell' | 'selectedDate' | 'selectedTime' | 'duration' | 'autoReserve'> & {
  acceptedTerms: boolean
  agbPath: string
  legacyReservationNotice: string
  termsDescription: string
  termsLabel: string
  termsLinkLabel: string
  onAcceptedTermsChange: (value: boolean) => void
}

function Step3({
  bordell,
  selectedDate,
  selectedTime,
  duration,
  autoReserve,
  acceptedTerms,
  agbPath,
  legacyReservationNotice,
  onAcceptedTermsChange,
  termsDescription,
  termsLabel,
  termsLinkLabel,
}: Step3Props) {
  const durationNum = parseInt(duration)
  const pricePerHour = bordell.minPrice || 50
  const estimatedPrice = (durationNum / 60) * pricePerHour

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white/5 p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-300">Uebersicht</h4>
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
          <Separator className="my-2 bg-white/10" />
          <div className="flex justify-between font-medium">
            <span className="text-gray-300">Preis ca.</span>
            <span className="text-[#b76e79]">€{estimatedPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>
      {autoReserve && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-xs text-green-400">
          <Bell className="h-4 w-4" />
          Automatische Reservierung aktiv
        </div>
      )}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="acceptedTerms"
            checked={acceptedTerms}
            aria-invalid={!acceptedTerms}
            onCheckedChange={(checked) => onAcceptedTermsChange(Boolean(checked))}
            className="mt-1 border-white/20 bg-white/10 text-white"
          />
          <div className="space-y-2">
            <Label htmlFor="acceptedTerms" className="text-sm font-medium text-white">
              {termsLabel}
            </Label>
            <p className="text-xs leading-6 text-gray-400">
              {termsDescription.replace(/\s*AGB\.?$/, '')}{' '}
              <Link href={agbPath} className="font-medium text-[#ffb1c6] underline underline-offset-2 hover:text-[#ffd1dc]">
                {termsLinkLabel}
              </Link>.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-gray-400">
        <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#b76e79]" />
        <p>{legacyReservationNotice}</p>
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
    <div className="mt-6 flex gap-3">
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
          className="flex-1 border-0 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white hover:from-[#a8255c] hover:to-[#7d4fb5]"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!canProceed || isLoading}
          className="flex-1 border-0 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] text-white hover:from-[#a8255c] hover:to-[#7d4fb5]"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird reserviert...</>
          ) : (
            <><Check className="mr-2 h-4 w-4" /> Reservieren</>
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
  const createBooking = useCreateBooking()
  const locale = useLocale()
  const tReservation = useTranslations('reservation')
  const agbPath = getLocalizedPath(locale, '/agb')

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [autoReserve, setAutoReserve] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const isPremium = false

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
    setAcceptedTerms(false)
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
    return acceptedTerms
  }

  const handleSubmit = async () => {
    if (!bordell || !acceptedTerms) {
      setError(tReservation('termsRequired'))
      return
    }

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
        ...(notes.length > 0 ? { notes } : {}),
      })

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reservierung fehlgeschlagen')
    }
  }

  if (!bordell) return null

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border-white/10 bg-[#0f0f14] text-white">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Reservierung erfolgreich!</h3>
            <p className="text-gray-400">Sie erhalten eine Bestaetigung per E-Mail.</p>
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
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) resetForm()
      onOpenChange(nextOpen)
    }}>
      <DialogContent className="max-w-md border-white/10 bg-[#0f0f14] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-[#b76e79]" />
            Reservierung
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {bordell.name} - {bordell.location}
          </DialogDescription>
        </DialogHeader>

        {isPremium && (
          <div className="flex items-center gap-2 rounded-lg border border-[#8b1a4a]/30 bg-[#8b1a4a]/20 p-3 text-sm">
            <Crown className="h-4 w-4 text-[#b76e79]" />
            <span className="font-medium text-white">Premium</span>
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
            acceptedTerms={acceptedTerms}
            agbPath={agbPath}
            legacyReservationNotice={tReservation('legacyReservationNotice')}
            onAcceptedTermsChange={(value) => {
              setAcceptedTerms(value)
              if (value) {
                setError('')
              }
            }}
            termsDescription={tReservation('termsDescription')}
            termsLabel={tReservation('termsLabel')}
            termsLinkLabel={tReservation('termsLinkLabel')}
          />
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <StepButtons
          step={step}
          canProceed={canProceed()}
          onBack={() => setStep((value) => value - 1)}
          onNext={() => setStep((value) => value + 1)}
          onSubmit={handleSubmit}
          isLoading={createBooking.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
