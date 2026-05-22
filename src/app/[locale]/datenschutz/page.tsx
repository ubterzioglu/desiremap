import Link from 'next/link'
import { LegalPlaceholderPage, getLegalPlaceholderMetadata } from '@/components/legal/LegalPlaceholderPage'
import { getLocalizedPath } from '@/lib/navigation'

const pageMessage = 'Diese Datenschutzerklärung beschreibt die Verarbeitung personenbezogener Daten im Zusammenhang mit Suche, Anfrage, Reservierung, Support und rechtlich sensiblen Checkout-Prozessen.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return {
    ...getLegalPlaceholderMetadata(locale, 'datenschutz', 'Datenschutz', pageMessage),
    robots: { index: true, follow: true },
  }
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const agbPath = getLocalizedPath(locale, '/agb')

  return (
    <LegalPlaceholderPage locale={locale} title="Datenschutz" message={pageMessage} eyebrow="Datenschutz & Reservierung">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">1. Personenbezogene Daten im Reservierungskontext</h2>
        <p>
          Im Rahmen von Suche, Kontakt, Anfrage, Reservierung, Support, Zahlungsabwicklung, Missbrauchsprävention und Rückerstattung kann DesireMap personenbezogene Daten verarbeiten. Dazu gehören insbesondere Name, E-Mail-Adresse, Telefonnummer, Reservierungszeitpunkt, ausgewählter Betrieb, gewünschte Dauer, technische Kennungen, Kommunikationsinhalte, Supportverläufe, Zahlungsreferenzen sowie Stornierungs- und No-Show-Informationen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">2. Zwecke und Rechtsgrundlagen</h2>
        <p>
          Die Verarbeitung erfolgt zur Bereitstellung der Plattform, zur Beantwortung von Anfragen, zur Abwicklung von Reservierungsschritten, zur Fehleranalyse, zur Missbrauchsabwehr, zur Durchsetzung rechtlicher Ansprüche, zur Nachweisführung gegenüber Betrieben und Zahlungsdienstleistern sowie zur Erfüllung gesetzlicher Pflichten. Rechtsgrundlagen können insbesondere Vertragserfüllung, vorvertragliche Maßnahmen, berechtigte Interessen, Einwilligung und gesetzliche Aufbewahrungspflichten sein.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">3. Reservierung, Stornierung und Rückerstattung</h2>
        <p>
          Wenn ein Nutzer eine Reservierung startet, können Angaben zur Verfügbarkeit, zum angefragten Zeitfenster, zu Zahlungsstatus, Stornierung, Spätabsage, Nichterscheinen und Rückerstattung dokumentiert werden. Solche Daten sind erforderlich, um den Prozess nachvollziehbar, revisionssicher und konfliktfest zu gestalten. Einzelheiten zu Rechtsfolgen, Gebühren, Stornierung und No-Show finden Sie ergänzend in den{' '}
          <Link href={agbPath} className="font-medium text-[#ffb1c6] underline underline-offset-2 hover:text-[#ffd1dc]">
            AGB
          </Link>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">4. Empfänger, Auftragsverarbeiter und Betriebe</h2>
        <p>
          Personenbezogene Daten können – soweit für den konkreten Zweck erforderlich – an eingebundene Hosting-Anbieter, technische Dienstleister, Analyse- und Sicherheitswerkzeuge, Kommunikationsdienstleister, Zahlungsdienste sowie den ausgewählten Betrieb oder dessen autorisierte Betreiberrollen übermittelt werden. Eine Weitergabe erfolgt nur in dem Umfang, der zur Durchführung oder Absicherung des jeweiligen Vorgangs notwendig ist.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">5. Speicherfristen und Nachweisinteressen</h2>
        <p>
          Reservierungsnahe Daten werden nur so lange gespeichert, wie dies für die Durchführung, Nachverfolgung, Fehleranalyse, Missbrauchsabwehr, buchhalterische Dokumentation, Rückerstattung, Rechtsverteidigung oder gesetzliche Pflichten erforderlich ist. Soweit Daten für Stornierung, Rückerstattung, Zahlungsstreitigkeiten oder No-Show-Fälle relevant sind, kann eine längere Speicherung auf Grundlage berechtigter Interessen oder gesetzlicher Vorgaben erfolgen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">6. Ihre Rechte und Bezug zu den AGB</h2>
        <p>
          Betroffene Personen haben – soweit gesetzlich vorgesehen – Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Beschwerde bei einer Aufsichtsbehörde. Soweit die Datenverarbeitung unmittelbar mit Reservierung, Stornierung, Rückerstattung, Zahlungsbedingungen oder No-Show-Folgen zusammenhängt, sind die materiellen Regeln ergänzend in den{' '}
          <Link href={agbPath} className="font-medium text-[#ffb1c6] underline underline-offset-2 hover:text-[#ffd1dc]">
            AGB
          </Link>{' '}
          beschrieben.
        </p>
      </section>
    </LegalPlaceholderPage>
  )
}
