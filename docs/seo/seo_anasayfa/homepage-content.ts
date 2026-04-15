/**
 * Ana Sayfa İçerik Motoru
 * ─────────────────────────────────────────────────────────────────────────────
 * Ana sayfa için özel template sistemi.
 *
 * Google ve AI sistemleri için kritik kurallar:
 *
 * 1. İlk paragraf (opening) — min 40 kelime, direkt cevap.
 *    Perplexity ve ChatGPT bu paragrafı "featured answer" olarak kullanır.
 *    "DesireMap ist..." ile başlamaz — kullanıcı sorgusuna cevap verir.
 *
 * 2. Her H2 section bağımsız bir konu → aynı keyword iki section'da yanyana geçmez.
 *
 * 3. Sayısal veriler (mekan sayısı, şehir sayısı) cümle içinde geçer →
 *    Google bu verileri "öne çıkan snippet" olarak indexler.
 *
 * 4. E-E-A-T sinyali: "manuell geprüft", "ProstSchG", "verifiziert" kelimeleri
 *    her section'da bir kez geçer — daha fazlası spam sinyali.
 */

// ─── Ana sayfa veri tipi ──────────────────────────────────────────────────────

export interface HomeContentVars {
  totalVenueCount: number
  totalCityCount: number
  currentYear: number
}

// ─── 1. Hero / Açılış (H1 altı — direkt cevap paragrafı) ─────────────────────
// Google bu metni "desiremap.de nedir?" sorusuna cevap olarak indexler.
// AI sistemleri bu paragrafı citation olarak kullanır.
// Kural: DesireMap ismi ikinci cümlede — keyword stuffing değil.

export function generateHeroDescription(vars: HomeContentVars): string {
  return (
    `Wer in Deutschland einen seriösen Erwachsenenclub sucht, findet auf einer Plattform alles, was er braucht: ` +
    `geprüfte Adressen, aktuelle Öffnungszeiten und – wo verfügbar – eine direkte Reservierungsmöglichkeit. ` +
    `DesireMap bündelt ${vars.totalVenueCount.toLocaleString('de-DE')} verifizierte Locations ` +
    `in ${vars.totalCityCount} Städten und verzichtet dabei bewusst auf explizite Inhalte. ` +
    `Alle gelisteten Betriebe erfüllen die Anforderungen des Prostitutionsschutzgesetzes (ProstSchG) ` +
    `und werden regelmäßig auf Aktualität geprüft.`
  )
}

// ─── 2. "Wie es funktioniert" bölümü ─────────────────────────────────────────
// HowTo schema için de kullanılır — Google rich result.

export interface HowToStep {
  position: number
  name: string
  text: string  // min 20 kelime
}

export function generateHowToSteps(): HowToStep[] {
  return [
    {
      position: 1,
      name: 'Stadt oder Kategorie wählen',
      text:
        'Geben Sie Ihre Stadt ein oder wählen Sie eine Kategorie – FKK Club, Bordell, Saunaclub oder Escort. ' +
        'DesireMap zeigt alle verifizierten Betriebe in Ihrer Nähe, gefiltert nach Öffnungszeiten und Ausstattung.',
    },
    {
      position: 2,
      name: 'Location vergleichen',
      text:
        'Jeder Eintrag enthält geprüfte Informationen zu Adresse, Öffnungszeiten, Ausstattung und Bewertungen. ' +
        'Alle Angaben wurden durch das DesireMap-Team verifiziert – ohne explizite Inhalte, sachlich und diskret.',
    },
    {
      position: 3,
      name: 'Direkt reservieren',
      text:
        'Bei Locations mit aktivierter Reservierungsfunktion können Sie Termine direkt über DesireMap anfragen. ' +
        'Die Anfrage wird verschlüsselt übermittelt und in der Regel innerhalb von 24 Stunden bestätigt.',
    },
  ]
}

// ─── 3. Warum DesireMap — USP bölümü ─────────────────────────────────────────
// "Pornografi yok" ana differentiator'ı burada açıkça belirtilir.
// E-E-A-T için kritik — güven sinyali.

export interface UspItem {
  title: string
  description: string  // min 25 kelime
}

export function generateUspItems(): UspItem[] {
  return [
    {
      title: 'Verifizierte Betriebe',
      description:
        'Jede Location auf DesireMap wird manuell überprüft. Betriebe ohne gültige behördliche Erlaubnis ' +
        'gemäß ProstSchG werden nicht aufgenommen. Nutzer können Verstöße direkt melden.',
    },
    {
      title: 'Ohne explizite Inhalte',
      description:
        'DesireMap verzichtet vollständig auf pornografische oder explizite Inhalte. ' +
        'Alle Beschreibungen sind sachlich, informativ und neutral gehalten – ' +
        'ein bewusster Gegenentwurf zu den meisten Branchenplattformen.',
    },
    {
      title: 'Direkte Reservierung',
      description:
        'Termine anfordern, ohne direkt beim Betrieb anrufen zu müssen. ' +
        'Die Buchungsanfrage läuft verschlüsselt über DesireMap – diskret und unkompliziert.',
    },
    {
      title: 'Aktuelle Informationen',
      description:
        'Öffnungszeiten, Ausstattung und Preise werden regelmäßig aktualisiert. ' +
        'Betriebe können Änderungen selbst über das DesireMap-Partnerprogramm einpflegen.',
    },
  ]
}

// ─── 4. Kategoriler tanıtım metni ────────────────────────────────────────────

export interface CategoryIntro {
  slug: string
  label: string
  plural: string
  intro: string  // min 30 kelime — category page için de kullanılabilir
}

export function generateCategoryIntros(): CategoryIntro[] {
  return [
    {
      slug: 'fkk-clubs',
      label: 'FKK Club',
      plural: 'FKK Clubs',
      intro:
        'FKK Clubs in Deutschland bieten Gästen ein Umfeld, in dem Freikörperkultur und Entspannung im Vordergrund stehen. ' +
        'DesireMap listet ausschließlich legal betriebene FKK Clubs mit transparenten Öffnungszeiten und verifizierten Bewertungen.',
    },
    {
      slug: 'bordelle',
      label: 'Bordell',
      plural: 'Bordelle',
      intro:
        'Bordelle in Deutschland unterliegen seit 2017 dem Prostitutionsschutzgesetz und benötigen eine behördliche Betriebserlaubnis. ' +
        'Auf DesireMap finden Sie ausschließlich zugelassene Betriebe mit geprüften Informationen.',
    },
    {
      slug: 'swinger-clubs',
      label: 'Swingerclub',
      plural: 'Swingerclubs',
      intro:
        'Swingerclubs sind in Deutschland legal und richten sich an Paare und Einzelpersonen ab 18 Jahren. ' +
        'DesireMap zeigt verifizierte Swingerclubs mit aktuellen Eintrittspreisen und Veranstaltungshinweisen.',
    },
    {
      slug: 'sauna-clubs',
      label: 'Sauna Club',
      plural: 'Sauna Clubs',
      intro:
        'Sauna Clubs verbinden Wellness mit einem offenen, erwachsenenorientierten Ambiente. ' +
        'Alle auf DesireMap gelisteten Sauna Clubs wurden auf ihre Seriosität und Legalität überprüft.',
    },
  ]
}

// ─── 5. Güven / Zahlen bölümü ─────────────────────────────────────────────────

export function generateTrustSection(vars: HomeContentVars): string {
  return (
    `Seit ${vars.currentYear - 1} baut DesireMap das größte verifizierte Verzeichnis für Erwachsenenlocations in Deutschland auf. ` +
    `Aktuell sind ${vars.totalVenueCount.toLocaleString('de-DE')} Betriebe in ${vars.totalCityCount} Städten gelistet – ` +
    `von Hamburg bis München, von Köln bis Berlin. ` +
    `Alle Einträge werden manuell geprüft; automatisch generierte oder unverifizierte Inhalte erscheinen nicht auf der Plattform.`
  )
}

// ─── 6. Ana sayfa FAQ'ları ────────────────────────────────────────────────────
// GEO için en kritik bölüm. Her cevap min 40 kelime.
// Sorular gerçek kullanıcı intent'lerine göre seçildi.

export function generateHomeFaqs(vars: HomeContentVars) {
  return [
    {
      question: 'Was ist DesireMap und für wen ist die Plattform gedacht?',
      answer:
        `DesireMap ist ein deutschsprachiges Online-Verzeichnis für verifizierte Erwachsenenlocations in Deutschland. ` +
        `Die Plattform richtet sich an Erwachsene ab 18 Jahren, die sachliche und geprüfte Informationen zu FKK Clubs, ` +
        `Bordellen, Saunaclubs, Swingerclubs und Escortservices suchen. ` +
        `Im Unterschied zu anderen Plattformen verzichtet DesireMap vollständig auf explizite oder pornografische Inhalte ` +
        `und legt den Fokus auf Transparenz, Seriosität und direkte Buchungsmöglichkeiten.`,
    },
    {
      question: 'Wie werden Betriebe auf DesireMap verifiziert?',
      answer:
        `Jeder Betrieb, der auf DesireMap gelistet werden möchte, durchläuft einen manuellen Prüfprozess. ` +
        `Das DesireMap-Team überprüft, ob der Betrieb über eine gültige Betriebserlaubnis gemäß dem deutschen ` +
        `Prostitutionsschutzgesetz (ProstSchG) verfügt. ` +
        `Betriebe ohne behördliche Erlaubnis oder mit negativen Hinweisen auf illegale Aktivitäten werden nicht aufgenommen. ` +
        `Bestehende Einträge werden regelmäßig auf Aktualität überprüft und bei Bedarf aktualisiert oder entfernt.`,
    },
    {
      question: 'Kann ich über DesireMap direkt einen Termin buchen?',
      answer:
        `Ja, für Locations, die das DesireMap-Buchungssystem aktiviert haben, ist eine direkte Reservierung möglich. ` +
        `Die Anfrage wird verschlüsselt über die Plattform übermittelt, ohne dass Sie direkt Kontakt mit dem Betrieb ` +
        `aufnehmen müssen. Die Bestätigung erfolgt in der Regel innerhalb von 24 Stunden. ` +
        `Nicht alle Betriebe nutzen diese Funktion – in solchen Fällen finden Sie auf der Detailseite ` +
        `direkte Kontaktinformationen.`,
    },
    {
      question: 'Ist die Nutzung von DesireMap kostenlos?',
      answer:
        `Die Suche und das Lesen von Locationinformationen auf DesireMap sind für Nutzer kostenlos. ` +
        `Für Betriebe, die ihren Eintrag erweitern, Reservierungsfunktionen aktivieren oder ihre Sichtbarkeit ` +
        `erhöhen möchten, gibt es kostenpflichtige Partnerprogramme. ` +
        `Grundeinträge mit Adresse, Kategorie und Öffnungszeiten sind für Betriebe ebenfalls kostenfrei. ` +
        `DesireMap finanziert sich ausschließlich über Betreiber-Partnerschaften, nicht über Werbung.`,
    },
    {
      question: `Wie viele Locations sind aktuell auf DesireMap gelistet?`,
      answer:
        `Aktuell sind ${vars.totalVenueCount.toLocaleString('de-DE')} verifizierte Locations in ${vars.totalCityCount} deutschen Städten auf DesireMap gelistet. ` +
        `Das Verzeichnis wächst kontinuierlich, da neue Betriebe regelmäßig den Verifizierungsprozess durchlaufen. ` +
        `Abgedeckte Kategorien umfassen FKK Clubs, Bordelle, Saunaclubs, Swingerclubs und Escortservices. ` +
        `Der geografische Schwerpunkt liegt auf deutschen Großstädten, das Verzeichnis umfasst jedoch auch kleinere Städte und ländliche Regionen.`,
    },
  ]
}

// ─── 7. HowTo schema builder ──────────────────────────────────────────────────

export function buildHowToSchema(siteUrl: string) {
  const steps = generateHowToSteps()
  return {
    '@type': 'HowTo',
    name: 'Wie finde ich einen verifizierten Club auf DesireMap?',
    description:
      'In drei Schritten zur passenden Location: Stadt wählen, vergleichen und direkt reservieren.',
    step: steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.position,
      name: s.name,
      text: s.text,
      url: `${siteUrl}/#schritt-${s.position}`,
    })),
  }
}
