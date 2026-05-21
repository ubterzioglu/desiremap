'use client'

import Image from 'next/image'
import { useEffect, useState, type JSX } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  buildAgeVerificationCookie,
  hasAgeVerificationCookie,
  shouldRenderAgeGate,
} from '@/lib/ageGate'

export function AgeGate(): JSX.Element | null {
  const t = useTranslations('ageGate')
  const [hasMounted, setHasMounted] = useState(false)
  const [hasVerifiedAge, setHasVerifiedAge] = useState(false)
  const [userAgent, setUserAgent] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasMounted(true)
      setHasVerifiedAge(hasAgeVerificationCookie(document.cookie))
      setUserAgent(navigator.userAgent ?? '')
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const isOpen = shouldRenderAgeGate({
    hasMounted,
    hasVerifiedAge,
    userAgent,
  })

  if (!isOpen) return null

  function handleConfirm(): void {
    document.cookie = buildAgeVerificationCookie()
    setHasVerifiedAge(true)
  }

  function handleLeave(): void {
    window.location.href = 'https://www.google.com/'
  }

  return (
    <Dialog open>
      <DialogContent
        className="border-red-500/30 bg-zinc-950 text-zinc-50 shadow-2xl sm:max-w-xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="items-center text-center">
          <Image
            alt={t('imageAlt')}
            className="mb-2 h-28 w-28 rounded-full border border-red-500/40 object-cover"
            height={112}
            priority
            src="/18plus.png"
            width={112}
          />
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="max-w-md text-sm leading-6 text-zinc-300">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-sm leading-6 text-zinc-300">
          <p>{t('legalNote')}</p>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col sm:justify-stretch">
          <Button className="w-full bg-red-600 text-white hover:bg-red-500" onClick={handleConfirm} type="button">
            {t('confirm')}
          </Button>
          <Button className="w-full" onClick={handleLeave} type="button" variant="outline">
            {t('leave')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
