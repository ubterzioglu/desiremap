'use client'

import Link from 'next/link'
import { Chrome, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

type LoginPageProps = {
  googleAuthUrl: string | null
  title: string
  subtitle: string
  primaryCta: string
  secondaryPrompt: string
  secondaryCta: string
  secondaryHref: string
  securityNote: string
  unavailableMessage: string
}

export function LoginPage({
  googleAuthUrl,
  title,
  subtitle,
  primaryCta,
  secondaryPrompt,
  secondaryCta,
  secondaryHref,
  securityNote,
  unavailableMessage,
}: LoginPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24 sm:px-6">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#8B1A4A]">
            <Shield className="h-7 w-7 text-[#ffb1c6]" />
          </div>
          <h1 className="mb-2 text-[28px] leading-9 font-semibold tracking-tight text-[#dae2fd]">{title}</h1>
          <p className="text-base leading-6 text-[#a48a90]">{subtitle}</p>
        </div>

        <div className="rounded-lg border border-[#2d3449] bg-[#171f33] p-6 sm:p-8">
          <div className="space-y-4">
            <Button
              asChild={googleAuthUrl !== null}
              disabled={googleAuthUrl === null}
              size="lg"
              className="h-12 w-full rounded bg-[#8B1A4A] text-sm font-semibold text-[#ffb1c6] hover:bg-[#a11f57]"
              type="button"
            >
              {googleAuthUrl === null ? (
                <span>
                  <Chrome className="mr-2 h-4 w-4" />
                  {primaryCta}
                </span>
              ) : (
                <a href={googleAuthUrl}>
                  <Chrome className="mr-2 h-4 w-4" />
                  {primaryCta}
                </a>
              )}
            </Button>

            {googleAuthUrl === null ? (
              <div className="rounded border border-[#93000a] bg-[#93000a]/10 p-3 text-center text-sm text-[#ffb4ab]">
                {unavailableMessage}
              </div>
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
