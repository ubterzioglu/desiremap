import { redirect } from 'next/navigation'

export default async function KundeLoginRedirect({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const path = locale === 'de' ? '/login' : `/${locale}/login`
  redirect(path)
}
