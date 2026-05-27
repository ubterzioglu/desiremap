'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Chrome, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { BackendApiError, memberAuthApi } from '@/lib/backend-client'
import { useMemberAuthStore } from '@/stores/memberAuthStore'

type LoginPageProps = {
  googleAuthFailedMessage: string
  googleAuthNotConfiguredMessage: string
  googleClientId: string | null
  googleIntent: 'login' | 'register'
  googleSetupMessage: string
  googleSigningInMessage: string
  locale: string
  title: string
  subtitle: string
  primaryCta: string
  successHref: string
  secondaryPrompt: string
  secondaryCta: string
  secondaryHref: string
  securityNote: string
}

export function LoginPage({
  googleAuthFailedMessage,
  googleAuthNotConfiguredMessage,
  googleClientId,
  googleIntent,
  googleSetupMessage,
  googleSigningInMessage,
  locale,
  title,
  subtitle,
  primaryCta,
  successHref,
  secondaryPrompt,
  secondaryCta,
  secondaryHref,
  securityNote,
}: LoginPageProps) {
  const buttonContainerRef = useRef<HTMLDivElement | null>(null)
  const [googleScriptReady, setGoogleScriptReady] = useState(false)
  const [googleScriptFailed, setGoogleScriptFailed] = useState(false)
  const { replace, refresh } = useRouter()
  const queryClient = useQueryClient()
  const setSession = useMemberAuthStore((state) => state.setSession)
  const { isPending, mutate } = useMutation({
    mutationFn: (idToken: string) => memberAuthApi.loginWithGoogle({ idToken }),
    onSuccess: async (session) => {
      setSession(session)
      await queryClient.invalidateQueries()
      replace(successHref)
      refresh()
    },
    onError: (error) => {
      const description = error instanceof BackendApiError && error.errorCode === 'GOOGLE_AUTH_NOT_CONFIGURED'
        ? googleAuthNotConfiguredMessage
        : googleAuthFailedMessage

      toast({
        title,
        description,
        variant: 'destructive',
      })
    },
  })

  const handleGoogleCredential = useCallback((response: GoogleCredentialResponse) => {
    const credential = typeof response.credential === 'string' ? response.credential.trim() : ''

    if (!credential) {
      toast({
        title,
        description: googleAuthFailedMessage,
        variant: 'destructive',
      })
      return
    }

    mutate(credential)
  }, [googleAuthFailedMessage, mutate, title])

  useEffect(() => {
    if (!googleScriptReady || !googleClientId || !buttonContainerRef.current) {
      return
    }

    const googleAccountsApi = window.google?.accounts?.id

    if (!googleAccountsApi) {
      return
    }

    buttonContainerRef.current.innerHTML = ''

    googleAccountsApi.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: googleIntent === 'register' ? 'signup' : 'signin',
      locale,
      ux_mode: 'popup',
    })

    googleAccountsApi.renderButton(buttonContainerRef.current, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 376,
      locale,
    })
  }, [googleClientId, googleIntent, googleScriptReady, handleGoogleCredential, locale])

  const showRenderedGoogleButton = googleClientId !== null && googleScriptReady && !googleScriptFailed
  const showGoogleSetupHint = !showRenderedGoogleButton && !isPending
  const googleHintMessage = googleScriptFailed ? googleAuthFailedMessage : googleSetupMessage

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24 sm:px-6">
      {googleClientId !== null ? (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => {
            setGoogleScriptReady(true)
            setGoogleScriptFailed(false)
          }}
          onError={() => {
            setGoogleScriptReady(false)
            setGoogleScriptFailed(true)
          }}
        />
      ) : null}
      <div className="w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-lg bg-[#8B1A4A]">
            <Shield className="size-7 text-[#ffb1c6]" />
          </div>
          <h1 className="mb-2 text-[28px] leading-9 font-semibold tracking-tight text-[#dae2fd]">{title}</h1>
          <p className="text-base leading-6 text-[#a48a90]">{subtitle}</p>
        </div>

        <div className="rounded-lg border border-[#2d3449] bg-[#171f33] p-6 sm:p-8">
          <div className="space-y-4">
            {showRenderedGoogleButton ? (
              <div className={isPending ? 'pointer-events-none opacity-70 transition-opacity' : 'transition-opacity'}>
                <div ref={buttonContainerRef} className="flex min-h-12 w-full items-center justify-center overflow-hidden rounded" />
              </div>
            ) : (
              <Button
                disabled
                size="lg"
                className="h-12 w-full rounded bg-[#8B1A4A] text-sm font-semibold text-[#ffb1c6] hover:bg-[#8B1A4A]"
                type="button"
              >
                <span>
                  <Chrome className="mr-2 size-4" />
                  {primaryCta}
                </span>
              </Button>
            )}

            {isPending ? (
              <p aria-live="polite" role="status" className="text-center text-sm text-[#a48a90]">{googleSigningInMessage}</p>
            ) : null}

            {showGoogleSetupHint ? (
              <p aria-live="polite" role="status" className="text-center text-sm text-[#a48a90]">{googleHintMessage}</p>
            ) : null}
          </div>

          <div className="mt-6 text-center text-sm text-[#a48a90]">
            {secondaryPrompt}{' '}
            <Link className="font-medium text-[#B76E79] hover:underline" href={secondaryHref}>
              {secondaryCta}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] leading-4 text-[#564146]">{securityNote}</p>
      </div>
    </div>
  )
}
