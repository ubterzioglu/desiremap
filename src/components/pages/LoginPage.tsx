'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sanitizeEmail, sanitizePassword, isValidEmail, sanitizePayload } from '@/lib/sanitize'

function domHash(el: HTMLElement): string {
  const html = el.outerHTML
  let h = 0
  for (let i = 0; i < html.length; i++) {
    h = ((h << 5) - h + html.charCodeAt(i)) | 0
  }
  return h.toString(36)
}

export function LoginPage() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const fingerprint = useRef<string>('')

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (btnRef.current) {
      fingerprint.current = domHash(btnRef.current)
    }
  }, [])

  const tick = useCallback(() => {
    setError('')

    // DOM integrity check
    if (btnRef.current && domHash(btnRef.current) !== fingerprint.current) {
      setError('Sicherheitsverletzung erkannt. Seite wird neu geladen.')
      setTimeout(() => window.location.reload(), 1500)
      return
    }

    // Sanitize inputs
    const cleanEmail = sanitizeEmail(email)
    const cleanPassword = sanitizePassword(password)

    if (!cleanEmail || !cleanPassword) {
      setError('Bitte fuellen Sie alle Felder aus.')
      return
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Bitte geben Sie eine gueltige E-Mail-Adresse ein.')
      return
    }

    // Build sanitized payload — blocks prototype pollution, $keys, nested objects
    const payload = sanitizePayload({ email: cleanEmail, password: cleanPassword })

    // TODO: Auth will be implemented later — payload is sanitized and ready
    void payload
    setError('Login wird aktuell ueberarbeitet.')
  }, [email, password])

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24 sm:px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#8B1A4A]">
            <Shield className="h-7 w-7 text-[#ffb1c6]" />
          </div>
          <h1 className="mb-2 text-[28px] leading-9 font-semibold tracking-tight text-[#dae2fd]">
            Willkommen zurueck
          </h1>
          <p className="text-base leading-6 text-[#a48a90]">Melden Sie sich an, um fortzufahren</p>
        </div>

        <div className="rounded-lg border border-[#2d3449] bg-[#171f33] p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[12px] leading-4 font-bold tracking-[0.05em] text-[#dcbfc5] uppercase">
                E-Mail
              </label>
              <Input
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded border border-[#2d3449] bg-[#131b2e] text-sm text-[#dae2fd]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] leading-4 font-bold tracking-[0.05em] text-[#dcbfc5] uppercase">
                Passwort
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="........"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded border border-[#2d3449] bg-[#131b2e] pr-12 text-sm text-[#dae2fd]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#564146] transition-colors hover:text-[#a48a90]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded border border-[#93000a] bg-[#93000a]/10 p-3 text-center text-sm text-[#ffb4ab]">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <Button
              ref={btnRef}
              type="button"
              onClick={tick}
              className="h-12 w-full rounded bg-[#8B1A4A] text-sm font-semibold text-[#ffb1c6] hover:bg-[#a11f57]"
            >
              Anmelden
            </Button>
            <p className="text-center text-sm text-[#a48a90]">
              Noch kein Konto?{' '}
              <span className="cursor-pointer font-medium text-[#B76E79]">Registrieren</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] leading-4 text-[#564146]">
          Geschuetzt &amp; Diskret — Ihre Daten sind sicher
        </p>
      </div>
    </div>
  )
}
