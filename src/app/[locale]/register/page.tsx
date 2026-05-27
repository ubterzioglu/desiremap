import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LoginPage } from '@/components/pages/LoginPage'
import { getPostAuthRedirect, resolveGoogleClientId } from '@/lib/member-auth'

export const dynamic = 'force-dynamic'

export default async function RegisterRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'authPages' }),
  ])
  const googleClientId = resolveGoogleClientId(
    process.env.MEMBER_AUTH_GOOGLE_CLIENT_IDS ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? null,
  )
  const navTranslations = {
    home: tNav('home'),
    discover: tNav('discover'),
    cities: tNav('cities'),
    premium: tNav('premium'),
    advertise: tNav('advertise'),
    login: tNav('login'),
    register: tNav('register'),
    myAccount: tNav('myAccount'),
  }

  return (
    <main className="flex min-h-screen flex-col" style={{ background: '#0b1326' }}>
      <Header locale={locale} translations={navTranslations} isLoggedIn={false} />
      <LoginPage
        googleAuthFailedMessage={t('googleAuthFailed')}
        googleAuthNotConfiguredMessage={t('googleAuthNotConfigured')}
        googleClientId={googleClientId}
        googleIntent="register"
        googleSetupMessage={t('googleSetupMessage')}
        googleSigningInMessage={t('googleSigningIn')}
        locale={locale}
        title={t('registerTitle')}
        subtitle={t('registerSubtitle')}
        primaryCta={t('continueWithGoogle')}
        successHref={getPostAuthRedirect(locale)}
        secondaryPrompt={t('alreadyHaveAccount')}
        secondaryCta={t('loginLink')}
        secondaryHref={`/${locale}/login`}
        securityNote={t('securityNote')}
      />
      <Footer locale={locale} />
    </main>
  )
}
