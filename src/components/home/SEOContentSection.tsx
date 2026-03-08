'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, MapPin, Star, Shield, Clock, Phone } from 'lucide-react'

type SEOContentSectionProps = {
  locale: string
}

export function SEOContentSection({ locale }: SEOContentSectionProps) {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/listing-bg.jpg" alt="" fill className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8b1a4a]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#6b3fa0]/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* EINLEITUNG */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Der führende Erotik-Guide in Deutschland
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Willkommen auf dem <strong className="text-white">Bordellmarkt</strong>, Ihrem verlässlichen Begleiter für die Suche nach erstklassigen Erotik-Etablissements in Deutschland. Unser Portal verbindet anspruchsvolle Gentlemen mit verifizierten Adressen und bietet Ihnen die Möglichkeit, verschiedene Kategorien diskret zu entdecken. Seit Jahren etabliert sich der <strong className="text-white">Bordellmarkt</strong> als die erste Anlaufstelle für qualitätsbewusste Besucher, die Wert auf Diskretion, Qualität und erstklassigen Service legen.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Auf unserem <strong className="text-white">Bordellmarkt</strong> finden Sie sorgfältig geprüfte Betriebe in allen großen deutschen Städten. Ob Sie einen exklusiven <Link href={`/${locale}/search?category=fkk`} className="text-[#b76e79] hover:underline">FKK Club</Link> in <Link href={`/${locale}/search?city=Berlin`} className="text-[#b76e79] hover:underline">Berlin</Link>, ein traditionelles <strong className="text-white">Laufhaus</strong> in <Link href={`/${locale}/search?city=Hamburg`} className="text-[#b76e79] hover:underline">Hamburg</Link> oder ein diskretes <strong className="text-white">Studio</strong> in <Link href={`/${locale}/search?city=München`} className="text-[#b76e79] hover:underline">München</Link> suchen – der <strong className="text-white">Bordellmarkt</strong> präsentiert Ihnen nur die besten Adressen. Jeder Eintrag wird regelmäßig aktualisiert und verifiziert.
          </p>
        </motion.div>

        {/* FKK CLUBS */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Wellness und Entspannung erleben
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Die <strong className="text-white">FKK Clubs</strong> gehören zu den beliebtesten Kategorien auf dem <strong className="text-white">Bordellmarkt</strong>. Diese einzigartigen Etablissements bieten ein entspanntes Ambiente, wo Sie den Alltag hinter sich lassen können. Auf dem <strong className="text-white">Bordellmarkt</strong> präsentieren wir Ihnen erstklassige Adressen wie den legendären Artemis in Berlin oder das exklusive Paradise in Stuttgart. Die Clubs zeichnen sich durch hohe Hygienestandards, erstklassigen Service und eine angenehme Atmosphäre aus.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Was macht die Adressen auf dem <strong className="text-white">Bordellmarkt</strong> so besonders? Neben Wellness-Bereichen mit Saunen und Pools bieten diese Etablissements auch exquisite Gastronomie. Der <strong className="text-white">Bordellmarkt</strong> listet nur Adressen, die strenge Qualitätskriterien erfüllen. Von <Link href={`/${locale}/search?city=Frankfurt`} className="text-[#b76e79] hover:underline">Frankfurt</Link> bis <Link href={`/${locale}/search?city=Köln`} className="text-[#b76e79] hover:underline">Köln</Link> finden Sie passende Adressen für Ihre Bedürfnisse.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Sauna & Wellness</span>
              </div>
              <p className="text-gray-400 text-sm">Die Adressen auf dem Portal bieten erstklassige Wellness-Einrichtungen</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Verifizierte Damen</span>
              </div>
              <p className="text-gray-400 text-sm">Jeder Betrieb wird regelmäßig überprüft</p>
            </div>
          </div>
        </motion.div>

        {/* LAUFHAUS */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Tradition und Vielfalt entdecken
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Das traditionelle <strong className="text-white">Laufhaus</strong> hat auf dem <strong className="text-white">Bordellmarkt</strong> einen besonderen Stellenwert. Hier können Besucher in entspannter Atmosphäre verschiedene Damen kennenlernen. Der <strong className="text-white">Bordellmarkt</strong> führt renommierte Adressen wie das berühmte Pascha in Köln oder das elegante Royal in München. Ein <strong className="text-white">Laufhaus</strong> bietet die Möglichkeit, verschiedene Bereiche zu erkunden und sich spontan zu entscheiden.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Auf dem <strong className="text-white">Bordellmarkt</strong> finden Sie detaillierte Informationen: Öffnungszeiten, Ausstattung, Preise und Bewertungen anderer Besucher. Das Konzept ist besonders beliebt bei denen, die Wert auf Auswahl und Flexibilität legen. Der <strong className="text-white">Bordellmarkt</strong> stellt sicher, dass alle gelisteten Adressen aktuell und verifiziert sind.
          </p>
        </motion.div>

        {/* STUDIOS */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Private Atmosphäre genießen
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Die <strong className="text-white">Studios</strong> auf dem <strong className="text-white">Bordellmarkt</strong> repräsentieren eine intimere Alternative zu größeren Etablissements. Diese kleineren, oft privat geführten Adressen bieten einen persönlichen Service in diskreter Umgebung. Der <strong className="text-white">Bordellmarkt</strong> verzeichnet hochwertige Anbieter in allen Metropolregionen Deutschlands. Ob Sie ein <strong className="text-white">Studio</strong> in <Link href={`/${locale}/search?city=Düsseldorf`} className="text-[#b76e79] hover:underline">Düsseldorf</Link> oder <Link href={`/${locale}/search?city=Stuttgart`} className="text-[#b76e79] hover:underline">Stuttgart</Link> suchen – wir haben die passende Adresse.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Was zeichnet diese Anbieter aus? Persönliche Betreuung, individuelle Terminvereinbarungen und höchste Diskretion. Viele offerieren zudem spezielle Services und тематические Räume. Der <strong className="text-white">Bordellmarkt</strong> aktualisiert regelmäßig die Informationen zu allen gelisteten Betrieben.
          </p>
        </motion.div>

        {/* PRIVAT */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Der Bordellmarkt für persönliche Erlebnisse
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Die Kategorie Privat auf dem <strong className="text-white">Bordellmarkt</strong> richtet sich an Gentlemen, die eine exklusive und persönliche Erfahrung suchen. Hier finden Sie selbstständige Damen, die ihre Dienste in privatem Rahmen anbieten. Der <strong className="text-white">Bordellmarkt</strong> verifiziert alle <strong className="text-white">Privat</strong>-Angebote sorgfältig, um Sicherheit und Qualität zu gewährleisten. Diese Kategorie ist ideal für Besucher, die eine individuellere Erfahrung bevorzugen.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Jedes <strong className="text-white">Privat</strong>-Inserat enthält detaillierte Informationen, Fotos und Kontaktmöglichkeiten. Der <strong className="text-white">Bordellmarkt</strong> schützt die Privatsphäre aller Beteiligten und ermöglicht eine sichere Kommunikation. Die Damen in dieser Kategorie legen Wert auf Diskretion und Kundenzufriedenheit.
          </p>
        </motion.div>

        {/* VORTEILE */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Warum der Bordellmarkt Ihre erste Wahl sein sollte
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Der <strong className="text-white">Bordellmarkt</strong> unterscheidet sich von anderen Verzeichnissen durch seine strenge Qualitätskontrolle. Jeder Betrieb auf dem <strong className="text-white">Bordellmarkt</strong> durchläuft einen Verifizierungsprozess, der Echtheit und Aktualität garantiert. Mit über 847 gelisteten Betrieben ist der <strong className="text-white">Bordellmarkt</strong> das umfassendste Verzeichnis seiner Art in Deutschland. Der <strong className="text-white">Bordellmarkt</strong> bietet Ihnen Qualität und Vertrauen. Vertrauen Sie auf unsere langjährige Erfahrung und Kompetenz.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <Shield className="w-8 h-8 text-[#b76e79] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">100% Verifiziert</h3>
              <p className="text-gray-400 text-sm">Alle Adressen werden geprüft</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <MapPin className="w-8 h-8 text-[#b76e79] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Deutschlandweit</h3>
              <p className="text-gray-400 text-sm">Alle Regionen abgedeckt</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <Star className="w-8 h-8 text-[#b76e79] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Echte Bewertungen</h3>
              <p className="text-gray-400 text-sm">Authentische Rezensionen</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <Clock className="w-8 h-8 text-[#b76e79] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Aktuelle Infos</h3>
              <p className="text-gray-400 text-sm">Täglich aktualisiert</p>
            </div>
          </div>
        </motion.div>

        {/* STÄDTE */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Deutschlandweit vertreten
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Der <strong className="text-white">Bordellmarkt</strong> ist in allen wichtigen deutschen Städten vertreten. In <Link href={`/${locale}/search?city=Berlin`} className="text-[#b76e79] hover:underline">Berlin</Link> finden Sie über 124 Betriebe, darunter erstklassige Adressen. Auch <Link href={`/${locale}/search?city=Hamburg`} className="text-[#b76e79] hover:underline">Hamburg</Link> ist mit 87 Etablissements stark vertreten. Die Hansestadt bietet eine vielfältige Auswahl für jeden Geschmack.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Das Rheinland bietet besonders viele Möglichkeiten: <Link href={`/${locale}/search?city=Köln`} className="text-[#b76e79] hover:underline">Köln</Link> mit 92 und <Link href={`/${locale}/search?city=Düsseldorf`} className="text-[#b76e79] hover:underline">Düsseldorf</Link> mit 48 Betrieben. Der <strong className="text-white">Bordellmarkt</strong> präsentiert auch in <Link href={`/${locale}/search?city=Frankfurt`} className="text-[#b76e79] hover:underline">Frankfurt</Link>, <Link href={`/${locale}/search?city=München`} className="text-[#b76e79] hover:underline">München</Link>, <Link href={`/${locale}/search?city=Stuttgart`} className="text-[#b76e79] hover:underline">Stuttgart</Link> und <Link href={`/${locale}/search?city=Nürnberg`} className="text-[#b76e79] hover:underline">Nürnberg</Link> eine breite Auswahl an verifizierten Adressen. Jede Stadt hat ihre eigenen Highlights und Spezialitäten.
          </p>
        </motion.div>

        {/* RESERVIERUNG */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Online Reservierung bequem nutzen
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Der <strong className="text-white">Bordellmarkt</strong> ermöglicht Ihnen die direkte Online-Reservierung bei vielen gelisteten Betrieben. Diese Funktion spart Zeit und garantiert Ihren Wunschtermin. Besonders bei beliebten Adressen ist die Reservierung empfehlenswert. Planen Sie Ihren Besuch im Voraus und vermeiden Sie Wartezeiten.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Premium-Mitglieder des <strong className="text-white">Bordellmarkt</strong> genießen zusätzliche Vorteile: Prioritäts-Reservierung, automatische Buchung bei Verfügbarkeit und exklusive Rabatte. Der <strong className="text-white">Bordellmarkt</strong> macht das Planen Ihres Besuchs so einfach wie nie zuvor. Profitieren Sie von unserem modernen Buchungssystem und genießen Sie einen erstklassigen Service.
          </p>
        </motion.div>

        {/* SICHERHEIT */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Sicherheit und Diskretion auf dem Bordellmarkt
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Der <strong className="text-white">Bordellmarkt</strong> legt höchsten Wert auf die Sicherheit und Privatsphäre seiner Nutzer. Alle Daten werden verschlüsselt übertragen und gespeichert. Die Bewertungen helfen Ihnen, trustworthy Betriebe zu identifizieren und die richtige Wahl zu treffen. Ihre Sicherheit steht an erster Stelle.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Diskretion ist ein Kernwert des <strong className="text-white">Bordellmarkt</strong>. Ihre Aktivitäten bleiben vertraulich und werden nicht an Dritte weitergegeben. Diese Verpflichtung macht das Portal zur vertrauenswürdigsten Plattform in Deutschland. Vertrauen Sie auf unsere jahrelange Erfahrung im Bereich Diskretion und Datenschutz.
          </p>
        </motion.div>

        {/* EMPFEHLUNGEN */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Top-Empfehlungen unseres Teams
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Das Team des <strong className="text-white">Bordellmarkt</strong> hat für Sie die besten Adressen zusammengestellt. Zu unseren Top-Empfehlungen gehören: der Artemis in Berlin mit seiner beeindruckenden Wellness-Landschaft, das Pascha in Köln als Europas größtes seiner Art, und das Diamond in Frankfurt für VIP-Erlebnisse. Diese Betriebe zeichnen sich durch außergewöhnlichen Service aus.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Diese Premium-Betriebe auf dem <strong className="text-white">Bordellmarkt</strong> bieten erstklassige Ausstattung und konstant hohe Bewertungen. Die Empfehlungen werden regelmäßig basierend auf Besucher-Feedback und Qualitätsprüfungen aktualisiert. Entdecken Sie die besten Adressen Deutschlands auf unserem Portal.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Häufig gestellte Fragen
          </h2>
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-3">Was kostet die Nutzung?</h3>
              <p className="text-gray-400">Die grundlegende Nutzung des <strong className="text-white">Bordellmarkt</strong> ist kostenlos. Premium-Funktionen wie Prioritäts-Reservierung und exklusive Rabatte erfordern eine Mitgliedschaft.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-3">Wie werden Betriebe verifiziert?</h3>
              <p className="text-gray-400">Jeder Betrieb durchläuft einen mehrstufigen Verifizierungsprozess. Das Team prüft Existenz, Aktualität und Qualität der angebotenen Services.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-3">Kann ich anonym bleiben?</h3>
              <p className="text-gray-400">Ja, der <strong className="text-white">Bordellmarkt</strong> schützt Ihre Privatsphäre. Sie können diskret nach Adressen suchen und Reservierungen tätigen.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="bg-gradient-to-r from-[#8b1a4a]/20 to-[#6b3fa0]/20 rounded-2xl p-8 border border-[#8b1a4a]/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Jetzt durchsuchen
            </h3>
            <p className="text-gray-300 mb-6">
              Entdecken Sie verifizierte Adressen auf dem führenden <strong className="text-white">Bordellmarkt</strong> Deutschlands. Über 847 Betriebe warten auf Ihren Besuch. Der <strong className="text-white">Bordellmarkt</strong> verbindet Sie mit den besten Adressen.
            </p>
            <Link href={`/${locale}/search`} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8b1a4a] to-[#6b3fa0] hover:from-[#a8255c] hover:to-[#7d4fb5] text-white font-semibold rounded-xl transition-all">
              <Phone className="w-5 h-5" />
              Alle Betriebe ansehen
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
