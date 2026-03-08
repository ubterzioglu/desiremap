'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Crown, Eye, EyeOff, Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type RegisterPageProps = {
  onBack: () => void
  onLogin: () => void
}

export function RegisterPage({ onBack, onLogin }: RegisterPageProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleOAuthEnabled, setGoogleOAuthEnabled] = useState(false)

  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(data => setGoogleOAuthEnabled(data.googleOAuth))
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    setError('')

    if (!email || !password || !name) {
      setError('Bitte fuellen Sie alle Felder aus')
      return
    }

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben')
      return
    }

    setIsLoading(true)

    try {
      // Register
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        setError(registerData.error || 'Registrierung fehlgeschlagen')
        return
      }

      // Auto login after registration
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!loginResponse.ok) {
        setError('Registrierung erfolgreich, aber Anmeldung fehlgeschlagen')
      } else {
        router.push('/de/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'
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
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Konto erstellen</h1>
            <p className="text-gray-400 text-sm">Registrieren Sie sich fuer Premium-Zugang</p>
          </div>

          {/* Google OAuth Button - only show if configured */}
          {googleOAuthEnabled && (
            <>
              <div className="px-8 pt-8">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 border-0 rounded-xl text-base font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Mit Google registrieren
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 px-8 py-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-sm">oder</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* Form */}
          <div className={`px-8 space-y-5 ${googleOAuthEnabled ? '' : 'pt-8'}`}>
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Ihr Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 pl-12 h-12 text-white"
                />
              </div>
            </div>
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
                  placeholder="Mindestens 8 Zeichen"
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

          {/* Actions */}
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
                  Registrieren
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-center text-gray-400 text-sm">
              Bereits ein Konto?{' '}
              <button
                onClick={onLogin}
                className="text-[#b76e79] hover:text-[#d48a9a] transition-colors font-medium"
              >
                Anmelden
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
