'use client'

import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/pages/LoginPage'

export default function Login() {
  const router = useRouter()

  return (
    <LoginPage
      onBack={() => router.push('/de')}
      onRegister={() => router.push('/de/register')}
    />
  )
}
