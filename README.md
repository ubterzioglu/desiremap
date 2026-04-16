# DesireMap

Deutschlands führendes Verzeichnis für FKK Clubs, Laufhäuser, Bordelle,
Studios und Privat-Adressen.

**Production:** https://desiremap.de

---

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State:** Zustand (client) + TanStack Query (server)
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl (de, en)
- **Runtime:** Bun
- **Deployment:** Coolify (self-hosted, Docker)

## Anforderungen

- Bun >= 1.3
- Node >= 20 (`.nvmrc` vorhanden)
- Läuft auf Linux, macOS, WSL2

## Setup

~~~bash
# Dependencies installieren
bun install

# Environment konfigurieren
cp .env.example .env
# .env bearbeiten, NEXT_PUBLIC_API_URL setzen

# Dev-Server starten
bun run dev
~~~

Öffne http://localhost:3000

## Scripts

| Befehl | Zweck |
|---|---|
| `bun run dev` | Dev-Server (Port 3000, Log: `dev.log`) |
| `bun run build` | Production Build (Standalone für Docker) |
| `bun run start` | Production Server lokal |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript Check (tsc --noEmit) |
| `bun test` | Unit Tests (Bun runner) |

## Projektstruktur

~~~
src/
  app/              Next.js App Router (Pages, Layouts)
  components/       React Components
    ui/             shadcn/ui (generated, nicht manuell editieren)
  hooks/            Custom Hooks
  lib/              Utils, API Client, Zustand Stores
    stores/         Zustand Stores

messages/           i18n JSON (de.json, en.json)
public/             Statische Assets
docs/               Projekt-Dokumentation
Dockerfile          Coolify Build Target
~~~

## Backend

Backend ist ein separates Repo:
**[desiremap_core_backend](https://github.com/ozbakirsahincan/desiremap_core_backend)**

REST API, Token-basierte Auth. Base URL wird über `NEXT_PUBLIC_API_URL`
konfiguriert.

## Deployment

Automatisches Deployment über **Coolify** (self-hosted auf unserem VPS):

1. Push auf `main` -> Coolify Webhook triggert Build
2. Build via `Dockerfile` (Next.js Standalone Output)
3. Coolify deployt Container, Caddy als Reverse Proxy

**Environment Variables** werden im Coolify Panel verwaltet
(siehe `.env.example` für Referenz).

Details: siehe `DEPLOY.md`.

## Entwicklung

- **Branching:** `feat/xxx`, `fix/xxx`, `chore/xxx`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
- **Vor jedem PR:** `bun run typecheck && bun run lint` müssen sauber sein
- **shadcn/ui:** `src/components/ui/` ist generiert — nicht manuell bearbeiten

## KI-unterstützte Entwicklung

Dieses Projekt wird mit KI-Tools entwickelt (Claude Code, Codex, GLM).
Der gesamte Projektkontext für KI-Tools ist in **`AGENTS.md`** zentralisiert.

Neue Team-Mitglieder: bitte vor dem ersten KI-Task `AGENTS.md` lesen.

## Team

- **Frontend:** Shahindzhan
- **Backend:** siehe Backend Repo
- **QA + Marketing:** siehe `PROJECT.md`

## Lizenz

Proprietär — (c) 2026 DesireMap. Alle Rechte vorbehalten.

---

**Status:** MVP in Entwicklung. Roadmap und Scope: siehe `PROJECT.md`.