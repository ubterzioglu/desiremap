'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Crown, Eye, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginPageProps = { onBack: () => void; loginMessage?: string; onLogin: () => void; onAdminLogin: () => void }

export function LoginPage({ onBack, loginMessage, onLogin, onAdminLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="relative z-10 max-w-md mx-auto px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"><ArrowLeft className="w-5 h-5" />Zurueck zur Startseite</button>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-8 pb-6 text-center border-b border-white/5"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#8b1a4a] to-[#6b3fa0] flex items-center justify-center"><Crown className="w-8 h-8 text-white" /></div><h1 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Willkommen zurueck' : 'Konto erstellen'}</h1><p className="text-gray-400 text-sm">{isLogin ? 'Melden Sie sich an, um fortzufahren' : 'Registrieren Sie sich fuer Premium-Zugang'}</p></div>
          {loginMessage && <div className="mx-8 mt-6 p-4 rounded-xl bg-[#8b1a4a]/10 border border-[#8b1a4a]/20"><div className="flex items-start gap-3"><Shield className="w-5 h-5 text-[#b76e79]" /><p className="text-sm text-gray-300">{loginMessage}</p></div></div>}
          <div className="p-8 space-y-5">{!isLogin && <div><Label className="text-gray-300 text-sm mb-2 block">Name</Label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><Input placeholder="Ihr Name" className="bg-white/5 border-white/10 pl-12 h-12 text-white" /></div></div>}<div><Label className="text-gray-300 text-sm mb-2 block">E-Mail</Label><Input type="email" placeholder="ihre@email.de" className="bg-white/5 border-white/10 h-12 text-white" /></div><div><Label className="text-gray-300 text-sm mb-2 block">Passwort</Label><div className="relative"><Input type={showPassword ? 'text' : 'password'} placeholder="........" className="bg-white/5 border-white/10 pr-12 h-12 text-white" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"><Eye className="w-5 h-5" /></button></div></div><Button onClick={onLogin} className="w-full h-12 bg-linear-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white border-0 rounded-xl text-base">{isLogin ? 'Anmelden' : 'Registrieren'}<ArrowRight className="w-5 h-5 ml-2" /></Button><p className="text-center text-gray-400 text-sm">{isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'} <button onClick={() => setIsLogin((value) => !value)} className="text-[#b76e79] hover:text-[#d48a9a] transition-colors font-medium">{isLogin ? 'Registrieren' : 'Anmelden'}</button></p><p className="text-center"><button onClick={onAdminLogin} className="text-gray-600 hover:text-gray-500 transition-colors text-xs">Admin</button></p></div>
        </div>
      </div>
    </div>
  )
}
