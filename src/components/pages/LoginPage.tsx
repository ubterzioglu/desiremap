'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Crown, Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { authApi } from '@/lib/api'
import { getLocalizedPath } from '@/lib/navigation'
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton'
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginPageProps = {
  locale?: string
  onBack: () => void
  loginMessage?: string
  onRegister: () => void
}

export function LoginPage({ locale = 'de', onBack, loginMessage, onRegister }: LoginPageProps) {
  const router = useRouter()
  const setSession = useAuthStore((state) => state.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { enabled: googleOAuthEnabled, login: loginWithGoogle } = useGoogleOAuth()

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Bitte fuellen Sie alle Felder aus')
      return
    }
    setIsLoading(true)
    try {
      const session = await authApi.login({ email, password }, 'public')
      setSession(session)
      router.push(getLocalizedPath(locale, '/dashboard'))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      setError(message || 'Ungueltige Anmeldedaten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="relative z-10 max-w-md mx-auto px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurueck zur Startseite
        </button>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Willkommen zurueck</h1>
            <p className="text-gray-400 text-sm">Melden Sie sich an, um fortzufahren</p>
          </div>

          {loginMessage && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-[#8b1a4a]/10 border border-[#8b1a4a]/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#b76e79]" />
                <p className="text-sm text-gray-300">{loginMessage}</p>
              </div>
            </div>
          )}

          {googleOAuthEnabled && (
            <>
              <div className="px-8 pt-8">
                <GoogleOAuthButton label="Mit Google anmelden" onClick={loginWithGoogle} />
              </div>
              <div className="flex items-center gap-4 px-8 py-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-sm">oder</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          <div className={`px-8 space-y-5 ${googleOAuthEnabled ? '' : 'pt-8'}`}>
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">E-Mail</Label>
              <Input
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 h-12 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">Passwort</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="........"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 pr-12 h-12 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 pt-6 space-y-4">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-3">
                {error}
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-base"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Anmelden
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-center text-gray-400 text-sm">
              Noch kein Konto?{' '}
              <button
                onClick={onRegister}
                className="text-[#b76e79] hover:text-[#d48a9a] transition-colors font-medium"
              >
                Registrieren
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
