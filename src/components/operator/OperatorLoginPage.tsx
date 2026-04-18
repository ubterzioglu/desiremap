'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function OperatorLoginPage() {
  const router = useRouter()
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben.')
      return
    }
    setIsLoading(true)
    try {
      const session = await authApi.login({ email, password }, 'admin')
      setSession(session)
      router.replace('/business/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#07111f] px-6 py-10 text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.1),_transparent_40%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px] pointer-events-none" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1100px] items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left — branding */}
          <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(79,70,229,0.14))] p-8 shadow-[0_30px_120px_rgba(15,23,42,0.5)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-indigo-200">
              <Building2 className="h-3.5 w-3.5" />
              Betreiber-Portal
            </div>
            <h1 className="mt-6 max-w-[14ch] text-4xl font-semibold tracking-tight text-white leading-tight">
              Ihr Betrieb. Ihre Events. Ihre Gäste.
            </h1>
            <p className="mt-5 max-w-[55ch] text-base leading-8 text-slate-300">
              Verwalten Sie Ihre Venues, veröffentlichen Sie Events und behalten
              Sie den Überblick über Reservierungen — alles in einem Workspace.
            </p>

            <div className="mt-10 space-y-3">
              {[
                'Venues & Events verwalten',
                'Reservierungen & Check-ins einsehen',
                'Operatoren Ihres Betriebs steuern',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-400/20">
                    <ShieldCheck className="h-3 w-3 text-indigo-300" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-10 text-xs text-slate-500">
              Sie sind Super Admin?{' '}
              <a href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Admin-Login →
              </a>
            </p>
          </section>

          {/* Right — form */}
          <section className="rounded-[36px] border border-white/10 bg-slate-950/85 p-8 backdrop-blur-xl shadow-[0_30px_120px_rgba(2,6,23,0.5)]">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Operator Login</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Willkommen zurück</h2>
              <p className="mt-2 text-sm text-slate-400">
                Melden Sie sich mit Ihren Betreiber-Zugangsdaten an.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block text-sm text-slate-300">E-Mail</Label>
                <Input
                  type="email"
                  placeholder="betrieb@example.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm text-slate-300">Passwort</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="h-12 border-white/10 bg-white/5 pr-12 text-white placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="h-12 w-full rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Zum Betreiber-Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-600">
                Kein Zugang? Wenden Sie sich an den Administrator.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
