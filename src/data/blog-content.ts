import { getCategoryPath, getCityPath, getLocalizedPath } from '@/lib/navigation'

type PremiumContentLinks = {
  homePath: string
  berlinCityPath: string
  hamburgCityPath: string
  muenchenCityPath: string
  koelnCityPath: string
  frankfurtCityPath: string
  stuttgartCityPath: string
  duesseldorfCityPath: string
  laufhausPath: string
  bordellPath: string
  fkkPath: string
}

function getPremiumContentLinks(locale: string): PremiumContentLinks {
  return {
    homePath: getLocalizedPath(locale, '/'),
    berlinCityPath: getCityPath(locale, 'berlin'),
    hamburgCityPath: getCityPath(locale, 'hamburg'),
    muenchenCityPath: getCityPath(locale, 'muenchen'),
    koelnCityPath: getCityPath(locale, 'koeln'),
    frankfurtCityPath: getCityPath(locale, 'frankfurt'),
    stuttgartCityPath: getCityPath(locale, 'stuttgart'),
    duesseldorfCityPath: getCityPath(locale, 'duesseldorf'),
    laufhausPath: getCategoryPath(locale, 'laufhaus'),
    bordellPath: getCategoryPath(locale, 'bordell'),
    fkkPath: getCategoryPath(locale, 'fkk'),
  }
}

function buildPremiumIntroContent() {
  return `
<p class="blog-intro"><strong>DesireMap</strong> ist Deutschlands führende Plattform für Premium-Erotik. Wir verbinden anspruchsvolle Gäste mit den besten <strong>FKK Clubs</strong>, <strong>Laufhäusern</strong> und <strong>Bordellen</strong> in ganz Deutschland. Auf <strong>DesireMap</strong> finden Sie ausschließlich verifizierte Betriebe mit höchsten Qualitätsstandards.</p>

<h2>Was ist DesireMap?</h2>

<p><strong>DesireMap</strong> ist mehr als nur ein Verzeichnis – wir sind Ihr vertrauensvoller Begleiter in der Welt der erotischen Dienstleistungen. Was <strong>DesireMap</strong> einzigartig macht:</p>

<ul>
  <li><strong>847+ verifizierte Betriebe</strong> in ganz Deutschland</li>
  <li><strong>Strenge Qualitätskontrolle</strong> jedes gelisteten Etablissements</li>
  <li><strong>Echte Bewertungen</strong> von echten Gästen</li>
  <li><strong>Diskrete Kontaktaufnahme</strong> ohne Registrierungszwang</li>
</ul>

<p>Das <strong>DesireMap</strong>-Team besucht und prüft jeden Betrieb persönlich. Nur wer unsere strengen Kriterien erfüllt, erhält das <strong>DesireMap</strong> Premium-Siegel. So garantieren wir Ihnen ein unvergessliches Erlebnis.</p>

<h3>Unser Verifizierungsprozess</h3>

<p>Bevor ein Betrieb auf <strong>DesireMap</strong> erscheint, durchläuft er einen mehrstufigen Prozess:</p>

<ol>
  <li><strong>Existenzprüfung</strong> – Ist der Betrieb real und erreichbar?</li>
  <li><strong>Qualitätsaudit</strong> – Erfüllt er unsere Hygiene- und Servicestandards?</li>
  <li><strong>Referenzprüfung</strong> – Was sagen Gäste über den Betrieb?</li>
  <li><strong>Regelmäßige Kontrollen</strong> – Wir prüfen laufend nach</li>
</ol>

<h3>Die Vision hinter DesireMap</h3>

<p><strong>DesireMap</strong> wurde gegründet, um Transparenz in eine Branche zu bringen, die sie braucht. Wir glauben, dass jeder Anspruch auf <strong>Qualität</strong>, <strong>Diskretion</strong> und <strong>Sicherheit</strong> hat – ohne Kompromisse.</p>
`
}

function buildPremiumCategorySections({
  berlinCityPath,
  duesseldorfCityPath,
  fkkPath,
  koelnCityPath,
  muenchenCityPath,
  laufhausPath,
  frankfurtCityPath,
  hamburgCityPath,
  bordellPath,
}: PremiumContentLinks) {
  return `
<h2>Unsere Premium-Betriebe</h2>

<p>Auf <strong>DesireMap</strong> finden Sie drei Hauptkategorien von Etablissements. Jede Kategorie bietet einzigartige Erlebnisse:</p>

<h3>FKK Clubs – Wellness trifft Erotik</h3>

<p><strong>FKK Clubs</strong> auf <strong>DesireMap</strong> bieten ein ganzheitliches Erlebnis. Saunen, Pools, Bars und private Bereiche schaffen eine entspannte Atmosphäre. Das Konzept: Ein Eintrittspreis gewährt Zugang zu allen Annehmlichkeiten.</p>

<div class="highlight-box">
  <p><strong>Unser Tipp:</strong> In <a href="${berlinCityPath}">Berlin</a> finden Sie verifizierte FKK Clubs mit transparenten Bewertungen und diskreter Orientierung.</p>
</div>

<p>Weitere starke Einstiege auf <strong>DesireMap</strong>:</p>

<ul>
  <li><a href="${duesseldorfCityPath}">Düsseldorf</a> – eleganter Wellness-Fokus und hochwertige Club-Auswahl</li>
  <li>FKK Clubs in <a href="${berlinCityPath}">Berlin</a> entdecken</li>
  <li>Alle <a href="${fkkPath}">FKK Clubs</a> auf einen Blick</li>
</ul>

<h3>Laufhäuser – Vielfalt auf mehreren Etagen</h3>

<p><strong>Laufhäuser</strong> sind auf <strong>DesireMap</strong> besonders beliebt wegen ihrer Flexibilität. Mehrere Etagen, verschiedene Damen – Sie wählen, was Ihnen gefällt. Kein Eintritt, Sie zahlen nur für die Dienstleistung.</p>

<div class="highlight-box">
  <p><strong>Rekordhalter:</strong> <a href="${koelnCityPath}">Köln</a> bleibt einer der wichtigsten Laufhaus-Märkte in Deutschland – mit hoher Dichte und klarer Vergleichsintention.</p>
</div>

<p>Mehr <strong>Laufhäuser</strong> auf <strong>DesireMap</strong>:</p>

<ul>
  <li><a href="${muenchenCityPath}">München</a> – zentrale Lage, diskrete Häuser und planbare Besuche</li>
  <li>Alle <a href="${laufhausPath}">Laufhäuser</a> durchsuchen</li>
</ul>

<h3>Bordelle – Diskretion und Privatsphäre</h3>

<p><strong>Bordelle</strong> auf <strong>DesireMap</strong> stehen für maximale Diskretion. Private Zimmer, persönliche Beratung, individuelle Dienstleistungen. Ideal für Gäste, die Wert auf Privatsphäre legen.</p>

<div class="highlight-box">
  <p><strong>Premium-Empfehlung:</strong> <a href="${frankfurtCityPath}">Frankfurt</a> bietet hochwertige Bordell- und Club-Adressen mit klarer Orientierung für diskrete Besuche.</p>
</div>

<p>Weitere <strong>Bordelle</strong> auf <strong>DesireMap</strong>:</p>

<ul>
  <li><a href="${hamburgCityPath}">Hamburg</a> – diskretes Ambiente und starke Innenstadt-Lagen</li>
  <li>Alle <a href="${bordellPath}">Bordelle</a> erkunden</li>
</ul>
`
}

function buildPremiumCitySections({
  berlinCityPath,
  hamburgCityPath,
  muenchenCityPath,
  koelnCityPath,
  frankfurtCityPath,
  stuttgartCityPath,
}: PremiumContentLinks) {
  return `
<h2>Städte auf DesireMap</h2>

<p><strong>DesireMap</strong> ist in allen deutschen Großstädten vertreten. Entdecken Sie die erotischen Hotspots:</p>

<h3>Berlin – Die Hauptstadt des Vergnügens</h3>

<p>Berlin auf <strong>DesireMap</strong>: Über 150 Betriebe, von FKK Clubs bis zu exklusiven Bordellen. Die Hauptstadt bietet für jeden Geschmack etwas.</p>

<p><strong>Stadtfokus:</strong> <a href="${berlinCityPath}">Berlin auf DesireMap</a> – großer Markt mit Wellness-Clubs, Studios und diskreten Adressen.</p>

<p>→ <a href="${berlinCityPath}">Alle Berliner Betriebe auf DesireMap</a></p>

<h3>Hamburg – Der Norden genießt</h3>

<p>Hamburg auf <strong>DesireMap</strong>: Die Reeperbahn ist legendär, aber auch abseits der Partymeile finden Sie Premium-Adressen.</p>

<p><strong>Stadtfokus:</strong> <a href="${hamburgCityPath}">Hamburg auf DesireMap</a> – diskrete Betriebe und klare Orientierung in zentralen Lagen.</p>

<p>→ <a href="${hamburgCityPath}">Alle Hamburger Betriebe auf DesireMap</a></p>

<h3>München – Bayerische Exklusivität</h3>

<p>München auf <strong>DesireMap</strong>: Etwas exklusiver, etwas privater. Die bayerische Hauptstadt setzt auf Qualität statt Quantität.</p>

<p><strong>Stadtfokus:</strong> <a href="${muenchenCityPath}">München auf DesireMap</a> – private, hochwertige und planbare Angebote.</p>

<p>→ <a href="${muenchenCityPath}">Alle Münchner Betriebe auf DesireMap</a></p>

<h3>Weitere Städte</h3>

<ul>
  <li><a href="${koelnCityPath}">Köln</a> – Heimat eines der bekanntesten Laufhaus-Märkte</li>
  <li><a href="${frankfurtCityPath}">Frankfurt</a> – Finanzmetropole mit starkem Erotik-Angebot</li>
  <li><a href="${stuttgartCityPath}">Stuttgart</a> – etablierte Adressen und diskrete Auswahl</li>
</ul>
`
}

function buildPremiumProcessAndCta({ homePath }: PremiumContentLinks) {
  return `
<h2>So funktioniert DesireMap</h2>

<h3>Schritt 1: Suchen</h3>

<p>Geben Sie auf <strong>DesireMap</strong> einfach Ihre Stadt oder gewünschte Kategorie ein. Filtern Sie nach:</p>

<ul>
  <li>Betriebsart (FKK, Laufhaus, Bordell)</li>
  <li>Stadt oder Region</li>
  <li>Bewertungen</li>
  <li>Preisklasse</li>
</ul>

<h3>Schritt 2: Vergleichen</h3>

<p>Jeder Betrieb auf <strong>DesireMap</strong> hat ein ausführliches Profil:</p>

<ul>
  <li>📍 Adresse und Anfahrt</li>
  <li>🕐 Öffnungszeiten</li>
  <li>💰 Preise und Angebote</li>
  <li>⭐ Echte Bewertungen</li>
  <li>📞 Kontaktdaten</li>
</ul>

<h3>Schritt 3: Kontaktieren</h3>

<p>Sie haben den passenden Betrieb gefunden? Auf <strong>DesireMap</strong> können Sie:</p>

<ul>
  <li>Direkt anrufen</li>
  <li>Online reservieren (bei Premium-Betrieben)</li>
  <li>Eine Nachricht senden</li>
</ul>

<h2>DesireMap Vorteile</h2>

<div class="benefits-grid">
  <div class="benefit">
    <h4>✓ 100% Verifiziert</h4>
    <p>Jeder Betrieb wird persönlich geprüft</p>
  </div>
  <div class="benefit">
    <h4>✓ Echte Bewertungen</h4>
    <p>Nur von verifizierten Gästen</p>
  </div>
  <div class="benefit">
    <h4>✓ Komplett kostenlos</h4>
    <p>Grundnutzung ohne Kosten</p>
  </div>
  <div class="benefit">
    <h4>✓ Maximale Diskretion</h4>
    <p>Ihre Daten bleiben privat</p>
  </div>
</div>

<h3>Premium-Mitgliedschaft</h3>

<p>Für noch mehr Vorteile auf <strong>DesireMap</strong>:</p>

<ul>
  <li><strong>Prioritätsreservierungen</strong> bei beliebten Betrieben</li>
  <li><strong>Exklusive Rabatte</strong> bei Partnerbetrieben</li>
  <li><strong>Frühzeitiger Zugang</strong> zu neuen Adressen</li>
  <li><strong>Persönliche Empfehlungen</strong> basierend auf Ihren Vorlieben</li>
</ul>

<h2 class="blog-faq">Häufig gestellte Fragen</h2>

<div class="faq-section">
  <h3>Ist DesireMap kostenlos?</h3>
  <p>Ja, die grundlegende Nutzung von <strong>DesireMap</strong> ist komplett kostenlos. Sie können suchen, vergleichen und Kontakt aufnehmen ohne zu zahlen. Die Premium-Mitgliedschaft bietet zusätzliche Vorteile.</p>

  <h3>Wie werden Betriebe verifiziert?</h3>
  <p>Das <strong>DesireMap</strong>-Team prüft jeden Betrieb persönlich. Wir kontrollieren Existenz, Hygiene-Standards, Service-Qualität und Gastzufriedenheit. Regelmäßige Nachkontrollen sichern die Qualität.</p>

  <h3>Bleibe ich anonym?</h3>
  <p>Absolut. Auf <strong>DesireMap</strong> können Sie anonym suchen und stöbern. Für eine Reservierung benötigen wir nur minimale Daten – und die bleiben bei uns.</p>

  <h3>Welche Städte deckt DesireMap ab?</h3>
  <p><strong>DesireMap</strong> ist in allen deutschen Großstädten vertreten: Berlin, Hamburg, München, Köln, Frankfurt, Düsseldorf, Stuttgart, Nürnberg und viele mehr. Insgesamt über 847 Betriebe.</p>

  <h3>Kann ich selbst eine Bewertung schreiben?</h3>
  <p>Ja! Nach Ihrem Besuch können Sie auf <strong>DesireMap</strong> eine authentische Bewertung hinterlassen. So helfen Sie anderen Gästen und tragen zur Transparenz bei.</p>
</div>

<h2>Fazit: Warum DesireMap?</h2>

<p><strong>DesireMap</strong> ist die erste Anlaufstelle für Premium-Erotik in Deutschland. Wir bieten:</p>

<ul>
  <li>✓ <strong>Vertrauen</strong> durch strenge Verifizierung</li>
  <li>✓ <strong>Transparenz</strong> durch echte Bewertungen</li>
  <li>✓ <strong>Vielfalt</strong> mit 847+ Betrieben</li>
  <li>✓ <strong>Diskretion</strong> bei jedem Schritt</li>
  <li>✓ <strong>Komfort</strong> durch einfache Suche und Buchung</li>
</ul>

<p>Entdecken Sie jetzt auf <a href="${homePath}"><strong>DesireMap</strong></a>, was Deutschland zu bieten hat. Ihr nächstes unvergessliches Erlebnis wartet.</p>

<p style="text-align: center; margin-top: 2rem;">
  <a href="${homePath}" class="cta-button">Jetzt auf DesireMap stöbern</a>
</p>
`
}

function buildPremiumErotikPlattformContent(locale: string): string {
  const links = getPremiumContentLinks(locale)

  return [
    buildPremiumIntroContent(),
    buildPremiumCategorySections(links),
    buildPremiumCitySections(links),
    buildPremiumProcessAndCta(links),
  ].join('')
}

export const premiumErotikPlattformContent = buildPremiumErotikPlattformContent('de')
export const getPremiumErotikPlattformContent = buildPremiumErotikPlattformContent

export const premiumErotikPlattformFAQ = [
  {
    question: 'Ist DesireMap kostenlos?',
    answer: 'Ja, die grundlegende Nutzung von DesireMap ist komplett kostenlos. Sie können suchen, vergleichen und Kontakt aufnehmen ohne zu zahlen. Die Premium-Mitgliedschaft bietet zusätzliche Vorteile wie Prioritätsreservierungen und exklusive Rabatte.'
  },
  {
    question: 'Wie werden Betriebe auf DesireMap verifiziert?',
    answer: 'Das DesireMap-Team prüft jeden Betrieb persönlich in einem mehrstufigen Prozess. Wir kontrollieren Existenz, Hygiene-Standards, Service-Qualität und Gastzufriedenheit. Regelmäßige Nachkontrollen sichern die dauerhafte Qualität.'
  },
  {
    question: 'Bleibe ich auf DesireMap anonym?',
    answer: 'Absolut. Auf DesireMap können Sie vollständig anonym suchen und stöbern. Für eine Reservierung benötigen wir nur minimale Kontaktdaten – und diese werden verschlüsselt gespeichert und niemals weitergegeben.'
  },
  {
    question: 'Welche Städte deckt DesireMap ab?',
    answer: 'DesireMap ist in allen deutschen Großstädten vertreten: Berlin, Hamburg, München, Köln, Frankfurt, Düsseldorf, Stuttgart, Nürnberg und viele mehr. Insgesamt finden Sie über 847 verifizierte Betriebe auf unserer Plattform.'
  },
  {
    question: 'Kann ich selbst eine Bewertung auf DesireMap schreiben?',
    answer: 'Ja! Nach Ihrem Besuch können Sie auf DesireMap eine authentische Bewertung hinterlassen. So helfen Sie anderen Gästen bei der Entscheidung und tragen zur Transparenz der Plattform bei.'
  }
]
