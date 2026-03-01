'use client'

import { useRouter } from 'next/navigation'
import { RegisterPage } from '@/components/pages/RegisterPage'

export default function Register() {
  const router = useRouter()

  return (
    <RegisterPage
      onBack={() => router.push('/de')}
      onLogin={() => router.push('/de/login')}
    />
  )
}
