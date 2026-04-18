'use client'

import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/pages/LoginPage'
import { getLocalizedPath } from '@/lib/navigation'
import { use } from 'react'

export default function CustomerLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const router = useRouter()

  return (
    <LoginPage
      locale={locale}
      onBack={() => router.push(getLocalizedPath(locale, '/'))}
      onRegister={() => router.push(getLocalizedPath(locale, '/register'))}
    />
  )
}
