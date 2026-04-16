# DesireMap — Projekt Übersicht

> Single source of truth für Projekt-Status, Scope und Roadmap.
> Für technische Setup-Anweisungen: `README.md`.
> Für KI-Tool-Kontext: `AGENTS.md`.

---

## Vision

DesireMap ist das führende deutsche Online-Verzeichnis für FKK Clubs,
Laufhäuser, Bordelle, Studios und Privat-Adressen.

Kernversprechen an den Nutzer:

- **Verifiziert** — geprüfte, vertrauenswürdige Einträge
- **Diskret** — neutrale Sprache, kein reißerischer Ton
- **Aktuell** — Öffnungszeiten, Preise, Bewertungen werden gepflegt
- **Strukturiert** — klare Navigation nach Stadt und Kategorie

## Zielgruppe

- **Primär:** Deutschsprachige Nutzer, die gezielt nach verifizierten
  Adressen suchen (Desktop + Mobile, SEO-driven Traffic)
- **Sekundär:** Betriebe, die ihre Präsenz in DesireMap pflegen
  (Premium-Listings, Werbung)

## Team

| Rolle | Person | Verantwortung |
|---|---|---|
| Frontend | Shahindzhan | Next.js App, UI, SEO-Struktur |
| Backend | [Name] | REST API, DB, Auth, Business-Logik |
| QA + Marketing | [Name] | Testing, Content, SEO-Strategie |

## Architektur (High-Level)

~~~
  +-----------------+         +-----------------+
  |  Next.js SSR    | --API-->|  Backend REST   |
  |  (dieses Repo)  |         |  (ozbakir...)   |
  +-----------------+         +-----------------+
          |                           |
          v                           v
     Coolify VPS                 Coolify VPS
     (Docker)                    (Docker + DB)
~~~

## Scope

### MVP (aktueller Fokus)

**Ziel:** Eine funktionsfähige, SEO-optimierte Directory-Site mit
verifizierten Einträgen und Basis-Admin.

- [x] Homepage (Kategorien + Städte + Featured)
- [x] Such-Seite (`/search`) mit Kategorie-Filter
- [x] Stadt-Seiten (`/stadt/[city]`)
- [ ] Kategorie-Seiten (`/search?category=...`)
- [ ] Betrieb-Detailseite (`/betrieb/[slug]`)
- [ ] Login / Register (Token-Auth)
- [ ] Basis Admin (Betrieb CRUD)
- [ ] Blog-Lesesystem (statisches Rendering, SEO-fokussiert)
- [ ] i18n de + en
- [ ] SEO: Metadata, JSON-LD (LocalBusiness), Sitemap, robots.txt
- [ ] Mobile-responsive
- [ ] Performance: LCP < 2.5s, CLS < 0.1

### Post-MVP (nach Launch)

Diese Features sind **geplant, aber nicht aktiv**. Keine Packages installiert,
kein Code geschrieben bis MVP abgeschlossen ist.

- **OTP-Verifizierung** (Reservierungs- und Betriebsbestätigung)
  - Backend in Entwicklung, kein Zeitdruck
  - Frontend: `input-otp` Package wird dann hinzugefügt
- **Socket.io Live-Verifizierung**
  - Live-Video-Call zwischen Kunde und Betrieb zur Identitätsbestätigung
  - Post-MVP, Timeline offen
- **Blog Admin Panel**
  - Markdown-Editor für eigene redaktionelle Inhalte
  - Backlink-Strategie: SEO-Content, **nicht** von Betrieben erstellt
- **Reservierungssystem**
  - Direkt-Buchung über DesireMap
- **Premium-Features für Betriebe**
  - Erweiterte Listings, Statistiken, Verwaltungs-Dashboard

### Out of Scope (auch langfristig nicht)

- Zahlungsabwicklung auf der Plattform
- Escort-Vermittlung (nur Orts-/Betriebs-Verzeichnis)
- User-generated Content außerhalb moderierter Bewertungen

## SEO-Strategie

SEO ist der **wichtigste Traffic-Kanal**. Jede Entscheidung muss
SEO-konform sein.

**Blog-Strategie:**

- Eigene redaktionelle Inhalte (nicht von Betrieben)
- Backlink-Struktur zwischen Blog-Artikeln, Stadt-Seiten und Kategorien
- Deutscher Markt, deutschsprachige Long-Tail-Keywords
- Content wird vom Team geschrieben (nicht KI-generiert für Publikation)

**Technische SEO-Anforderungen:**

- Server-Side Rendering (Next.js App Router, Server Components default)
- Strukturierte Daten: LocalBusiness Schema auf Betrieb-Seiten
- Metadata pro Seite: title, description, openGraph, canonical
- Sitemap automatisch generiert
- URL-Struktur: kebab-case, deutsche Slugs
- `next/image` für alle Bilder, alt-Text Pflicht

## Qualitätskriterien

**Vor jedem Merge auf `main`:**

- [ ] `bun run typecheck` — 0 Fehler
- [ ] `bun run lint` — 0 Fehler
- [ ] Lokaler Build erfolgreich (`bun run build`)
- [ ] Manuell getestet auf Desktop + Mobile
- [ ] Neue UI-Texte in `messages/de.json` + `messages/en.json`

**Performance-Budgets:**

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle size: Warning bei > 200KB initial JS

## Roadmap

### Q2 2026 — MVP Launch

- Alle MVP-Items abgeschlossen
- Initiale 100+ Betriebe im System (bereits 847 laut Site)
- Soft-Launch, SEO-Monitoring

### Q3 2026 — Wachstum

- Blog-Content Pipeline (mind. 2 Artikel/Woche)
- Admin Panel für Betriebs-Selbstpflege
- OTP-Verifizierung (wenn Backend fertig)

### Q4 2026 — Verifikation

- Socket.io Live-Video-Verification
- Premium-Tier für Betriebe
- Reservierungs-MVP

## Wichtige Links

- **Production:** https://desiremap.de
- **Frontend Repo:** https://github.com/ubterzioglu/desiremap
- **Backend Repo:** https://github.com/ozbakirsahincan/desiremap_core_backend
- **Deployment:** Coolify (self-hosted VPS)

## Entscheidungslog

Wichtige Architektur-Entscheidungen werden hier kurz dokumentiert.

**2026-04 — Coolify statt Vercel**

- Grund: Volle Kontrolle, geringere Kosten, Docker-basiert
- Trade-off: Mehr Ops-Aufwand, dafür kein Vendor-Lock-in

**2026-04 — Zustand + TanStack Query statt Redux/RTK**

- Grund: Kleineres Team, weniger Boilerplate, bessere DX
- Trade-off: Weniger "enterprise", für MVP angemessen

**2026-04 — Bun statt npm/pnpm**

- Grund: Schnellere Installs, integriertes Test-Runner
- Trade-off: Ökosystem noch jünger, gelegentliche Kompatibilitätsprobleme

**2026-04 — AI-Tooling konsolidiert auf `AGENTS.md`**

- Grund: Verhinderung von Context-Chaos zwischen 11+ AI-Tools
- Alle KI-Tools (Claude Code, Codex, GLM) lesen dieselbe Datei

## Kommunikation

- **Daily Work:** [Kanal, z.B. Telegram, Slack, Discord]
- **Urgent:** Direkt-Nachricht
- **Dokumentation:** dieses Repo (`README.md`, `PROJECT.md`, `AGENTS.md`)
- **Issues:** GitHub Issues

---

*Letzte Aktualisierung: April 2026*
*Owner: Shahindzhan*