'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Crown, Eye, EyeOff, Loader2, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/lib/api'

function LoginHeader({ isLogin }: { isLogin: boolean }) {
  return (
    <div className="p-8 pb-6 text-center border-b border-white/5">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center">
        <Crown className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Willkommen zurueck' : 'Konto erstellen'}
      </h1>
      <p className="text-gray-400 text-sm">
        {isLogin ? 'Melden Sie sich an, um fortzufahren' : 'Registrieren Sie sich fuer Premium-Zugang'}
      </p>
    </div>
  )
}

interface LoginFieldsProps {
  isLogin: boolean
  showPassword: boolean
  name: string
  email: string
  password: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onTogglePassword: () => void
}

function LoginFields({
  isLogin,
  showPassword,
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onTogglePassword
}: LoginFieldsProps) {
  return (
    <div className="p-8 space-y-5">
      {!isLogin && (
        <div>
          <Label className="text-gray-300 text-sm mb-2 block">Name</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Ihr Name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-white/5 border-white/10 pl-12 h-12 text-white"
            />
          </div>
        </div>
      )}
      <div>
        <Label className="text-gray-300 text-sm mb-2 block">E-Mail</Label>
        <Input
          type="email"
          placeholder="ihre@email.de"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
            className="bg-white/5 border-white/10 pr-12 h-12 text-white"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

interface LoginActionsProps {
  isLogin: boolean
  isLoading: boolean
  error: string
  onLogin: () => void
  onToggleMode: () => void
  onAdminLogin: () => void
}

function LoginActions({
  isLogin,
  isLoading,
  error,
  onLogin,
  onToggleMode,
  onAdminLogin
}: LoginActionsProps) {
  return (
    <div className="px-8 pb-8 space-y-4">
      {error && (
        <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-3">
          {error}
        </div>
      )}
      <Button
        onClick={onLogin}
        disabled={isLoading}
        className="w-full h-12 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-base"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {isLogin ? 'Anmelden' : 'Registrieren'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
      <p className="text-center text-gray-400 text-sm">
        {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}{' '}
        <button
          onClick={onToggleMode}
          className="text-[#b76e79] hover:text-[#d48a9a] transition-colors font-medium"
        >
          {isLogin ? 'Registrieren' : 'Anmelden'}
        </button>
      </p>
      <p className="text-center">
        <button
          onClick={onAdminLogin}
          className="text-gray-600 hover:text-gray-500 transition-colors text-xs"
        >
          Admin
        </button>
      </p>
    </div>
  )
}

type LoginPageProps = {
  onBack: () => void
  loginMessage?: string
  onAdminLogin: () => void
}

export function LoginPage({ onBack, loginMessage, onAdminLogin }: LoginPageProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    
    if (!email || !password) {
      setError('Bitte fuellen Sie alle Felder aus')
      return
    }

    if (!isLogin && !name) {
      setError('Bitte geben Sie Ihren Namen an')
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        // Login with NextAuth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) {
          setError('Ungueltige Anmeldedaten')
        } else {
          router.push('/de/dashboard')
        }
      } else {
        // Register
        await authApi.register({ email, password, name })
        
        // Auto login after registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) {
          setError('Registrierung erfolgreich, aber Anmeldung fehlgeschlagen')
        } else {
          router.push('/de/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
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
          <LoginHeader isLogin={isLogin} />
          
          {loginMessage && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-[#8b1a4a]/10 border border-[#8b1a4a]/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#b76e79]" />
                <p className="text-sm text-gray-300">{loginMessage}</p>
              </div>
            </div>
          )}
          
          <LoginFields
            isLogin={isLogin}
            showPassword={showPassword}
            name={name}
            email={email}
            password={password}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
          />
          
          <LoginActions
            isLogin={isLogin}
            isLoading={isLoading}
            error={error}
            onLogin={handleSubmit}
            onToggleMode={() => {
              setIsLogin((v) => !v)
              setError('')
            }}
            onAdminLogin={onAdminLogin}
          />
        </div>
      </div>
    </div>
  )
}
