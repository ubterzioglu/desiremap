import { LegalPlaceholderPage, getLegalPlaceholderMetadata } from '@/components/legal/LegalPlaceholderPage'

const statusMessage = 'Diese Seite wird vorbereitet. Inhalte folgen bald.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return getLegalPlaceholderMetadata(locale, 'kontakt', 'Kontakt', statusMessage)
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <LegalPlaceholderPage locale={locale} title="Kontakt" message={statusMessage} />
}
