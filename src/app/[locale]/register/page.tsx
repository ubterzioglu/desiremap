'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LoginPage } from '@/components/pages/LoginPage'

function useNavTranslations() {
  const t = useTranslations('nav')
  return { home: t('home'), discover: t('discover'), cities: t('cities'), premium: t('premium'), advertise: t('advertise'), login: t('login'), register: t('register'), myAccount: t('myAccount') }
}

export default function RegisterRoute() {
  const locale = useLocale()
  const navTranslations = useNavTranslations()
  const t = useTranslations('authPages')
  const googleAuthStartUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_START_URL?.trim() || null
  const googleAuthUrl = googleAuthStartUrl === null
    ? null
    : `${googleAuthStartUrl}?intent=register&locale=${encodeURIComponent(locale)}&returnTo=${encodeURIComponent(`/${locale}/register`)}`

  return (
    <main className="flex min-h-screen flex-col" style={{ background: '#0b1326' }}>
      <Header locale={locale} translations={navTranslations} isLoggedIn={false} />
      <LoginPage
        googleAuthUrl={googleAuthUrl}
        title={t('registerTitle')}
        subtitle={t('registerSubtitle')}
        primaryCta={t('continueWithGoogle')}
        secondaryPrompt={t('alreadyHaveAccount')}
        secondaryCta={t('loginLink')}
        secondaryHref={`/${locale}/login`}
        securityNote={t('securityNote')}
        unavailableMessage={t('googleUnavailable')}
      />
      <Footer locale={locale} />
    </main>
  )
}
