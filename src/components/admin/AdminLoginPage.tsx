'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useAdminAuth } from '@/components/providers/AdminAuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLoginPage() {
  const router = useRouter()
  const { login: adminLogin } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben.')
      return
    }

    setIsLoading(true)

    try {
      await adminLogin(email, password)
      router.replace('/dashboard')
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Login fehlgeschlagen'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#07111f] px-6 py-10 text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_30%),linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px] opacity-50 pointer-events-none" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1280px] items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(15,118,110,0.16))] p-8 shadow-[0_30px_120px_rgba(15,23,42,0.45)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              admin.desiremap.de
            </div>
            <h1 className="mt-6 max-w-[12ch] text-5xl font-semibold tracking-tight text-white">Super Admin Login fuer die gesamte Plattformsteuerung.</h1>
            <p className="mt-5 max-w-[62ch] text-base leading-8 text-slate-300">
              Zentraler Zugang zur Verwaltung aller Betriebe, Operatoren, Venues und Events. Kein Operator-Login — das ist die Super-Admin-Ebene.
            </p>
          </section>

          <section className="rounded-[36px] border border-white/10 bg-slate-950/85 p-8 backdrop-blur-xl shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Secure Sign In</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Willkommen zurueck</h2>
              <p className="mt-2 text-sm text-slate-400">Melde dich an, um direkt in das Super Admin Dashboard zu wechseln.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 block text-sm text-slate-300">E-Mail</Label>
                <Input
                  type="email"
                  placeholder="admin@desiremap.de"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 border-white/10 bg-white/5 text-white"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm text-slate-300">Passwort</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 border-white/10 bg-white/5 pr-12 text-white"
                  />
                  <button
                    type="button"
                    data-testid="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-teal-400 text-slate-950 hover:bg-teal-300">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    In Dashboard wechseln
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
