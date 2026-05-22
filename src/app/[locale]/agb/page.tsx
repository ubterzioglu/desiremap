import Link from 'next/link'
import { LegalPlaceholderPage, getLegalPlaceholderMetadata } from '@/components/legal/LegalPlaceholderPage'
import { getLocalizedPath } from '@/lib/navigation'

const pageMessage = 'Diese AGB regeln Reservierungen, Zahlungen, Stornierungen, Rückerstattungen und die Nutzung rechtlich sensibler DesireMap-Funktionen.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return {
    ...getLegalPlaceholderMetadata(locale, 'agb', 'AGB', pageMessage),
    robots: { index: true, follow: true },
  }
}

export default async function AgbPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const datenschutzPath = getLocalizedPath(locale, '/datenschutz')

  return (
    <LegalPlaceholderPage locale={locale} title="AGB" message={pageMessage} eyebrow="Recht & Checkout">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">1. Geltungsbereich und Vertragsrolle</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung reservierungsnaher Funktionen auf DesireMap. Soweit DesireMap digitale Kontakt-, Anfrage- oder Reservierungsoberflächen bereitstellt, handelt DesireMap als Plattformbetreiber und technischer Vermittler. Der konkrete Leistungs- oder Besuchsvertrag kommt – sofern nicht ausdrücklich anders angegeben – zwischen dem Nutzer und dem jeweiligen Betrieb zustande.
        </p>
        <p>
          Für alle Datenverarbeitungen im Zusammenhang mit Anfrage, Reservierung, Zahlung, Identitätsprüfung, Stornierung, Rückerstattung oder Support gilt ergänzend die{' '}
          <Link href={datenschutzPath} className="font-medium text-[#ffb1c6] underline underline-offset-2 hover:text-[#ffd1dc]">
            Datenschutzerklärung
          </Link>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">2. Voraussetzungen für Reservierung und Nutzung</h2>
        <p>
          Reservierung, Anfrage und Besuch sind ausschließlich volljährigen Personen gestattet. Nutzer müssen wahrheitsgemäße, vollständige und aktuelle Angaben machen. Falsche Identitäts-, Kontakt- oder Zahlungsdaten können zur Ablehnung, Sperrung, Stornierung oder Dokumentation als Missbrauchsfall führen.
        </p>
        <p>
          Jeder Nutzer ist verpflichtet, sich vor Absenden über Hausregeln, Leistungsumfang, Einlassbedingungen, Kleiderordnung, Ausweispflichten, Gesundheits- und Sicherheitsvorgaben des jeweiligen Betriebs zu informieren.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">3. Reservierung, Annahme und Verfügbarkeit</h2>
        <p>
          Eine über DesireMap ausgelöste Reservierung stellt zunächst eine verbindliche Anfrage oder einen verbindlichen Buchungswunsch dar. Erst die ausdrückliche Bestätigung, Annahme oder systemseitige Finalisierung durch den dafür vorgesehenen Prozess macht die Reservierung verbindlich, sofern im jeweiligen Flow nichts Abweichendes angegeben ist.
        </p>
        <p>
          Angezeigte Zeitfenster, Preise, Dauer, Plätze, Services oder Sonderwünsche stehen stets unter dem Vorbehalt tatsächlicher Verfügbarkeit. Technische Zwischenspeicher, Verfügbarkeitsfenster, Holds, idempotente Wiederholungen oder Systemmigrationen können dazu führen, dass ein Nutzer den Checkout beginnt, aber keine finale Reservierung zustande kommt.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">4. Zahlungsbedingungen, Gebühren und Fälligkeit</h2>
        <p>
          Sofern im jeweiligen Checkout oder Betrieb nicht anders ausgewiesen, sind alle Preisangaben unverbindliche Richtwerte bis zur finalen Bestätigung. Der endgültige Betrag kann sich aus Dauer, gewähltem Angebot, Zusatzleistungen, Anzahlung, Sicherheitsleistung, Gebühren, Steuern oder individuellen Konditionen des Betriebs ergeben.
        </p>
        <p>
          Anzahlungen, Vorautorisierungen, Sicherheitsleistungen oder No-Show-Gebühren können verlangt werden, sobald der Betrieb oder der eingesetzte Zahlungsdienst dies vorsieht. Zahlungen werden erst dann fällig, wenn sie im Flow ausdrücklich angefordert oder vertraglich wirksam vereinbart wurden.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">5. Stornierung, Spätabsage, No-Show und Rückerstattung</h2>
        <p>
          Stornierung ist nur innerhalb des jeweils kommunizierten Zeitfensters kostenfrei. Nach Ablauf dieser Frist kann der Betrieb ganz oder teilweise Stornierungskosten, Spätabsagegebühren oder No-Show-Kosten berechnen. Als Spätabsage gilt jede Absage nach Ablauf der kostenlosen Frist; als No-Show gilt insbesondere das unentschuldigte Nichterscheinen, das verspätete Erscheinen mit Unmöglichkeit der Durchführung oder die erhebliche Nichterreichbarkeit des Nutzers.
        </p>
        <p>
          Rückerstattung erfolgt nur, wenn dafür eine ausdrückliche Rechtsgrundlage, eine betriebliche Kulanzentscheidung, eine dokumentierte Fehlbelastung oder eine technische Fehlbuchung vorliegt. Bereits entstandene Zahlungsdienstkosten, reservierte Kapazitäten, Vorbereitungsleistungen oder nachweisbare Ausfälle können von einer Rückerstattung ganz oder teilweise ausgenommen sein.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">6. Änderungen, Ablehnung und Betriebsvorbehalt</h2>
        <p>
          Betriebe dürfen Reservierungen ablehnen, verschieben, kürzen oder unter angemessenen Gründen widerrufen, insbesondere bei Sicherheitsbedenken, Überbuchung, Ausfall, Hausverbot, Verdacht auf Missbrauch, unzulässigem Verhalten oder gesetzlichen Verpflichtungen. DesireMap darf reservierungsnahe Funktionen technisch sperren, wenn Migrationen, Integrationsfehler, Verfügbarkeitsprobleme oder Compliance-Anforderungen dies erforderlich machen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#dae2fd]">7. Datenschutzbezug, Nachweise und Kommunikation</h2>
        <p>
          Alle Informationen zu Kontaktangaben, Reservierungshistorie, Supportkommunikation, Zahlungsbezug, Stornierung, Rückerstattung und Missbrauchsprävention sind datenschutzrechtlich relevant. Maßgebliche Informationen zu Kategorien personenbezogener Daten, Speicherdauer, Empfängern und Rechtsgrundlagen finden Sie in der{' '}
          <Link href={datenschutzPath} className="font-medium text-[#ffb1c6] underline underline-offset-2 hover:text-[#ffd1dc]">
            Datenschutzerklärung
          </Link>.
        </p>
      </section>
    </LegalPlaceholderPage>
  )
}
