# DesireMap.de — AGENTS.md

Bu dosya tüm AI tool'ları için tek context kaynağıdır.
Claude Code, Codex CLI, GLM, Cursor — hangisi olursa olsun ÖNCE BUNU OKU.

## Proje
Almanya yetişkin sektör directory sitesi (FKK, Laufhaus, Bordell, Studio, Privat).
Kullanıcı şehir + kategori ile arar, Betrieb (işletme) detayını görür.

Production: https://desiremap.de (Coolify self-hosted, VPS)
Deployment: Dockerfile üzerinden, Coolify otomatik build
Staging: yok (doğrudan production, MVP aşamasında)

## Takım
- Frontend: Shahindzhan (bu repo)
- Backend: ayrı repo (desiremap_core_backend), REST API
- Test + Marketing: 1 kişi

## Aşama: MVP
Şu an MVP'yi bitirmeye odaklıyız. MVP KAPSAMI DIŞI hiçbir şey yapılmaz.

### MVP içinde (aktif geliştirme)
- Arama (şehir + kategori filtreleri)
- Betrieb detay sayfası
- Şehir sayfaları (SEO)
- Kategori sayfaları (SEO)
- Login/register (token-based auth)
- Basit admin (işletme CRUD)
- Blog okuma sayfaları (SEO için backlink yapısı — içerik sonradan girilecek)

### MVP DIŞI (yapma, önerme, kod yazma)
- Socket.io / realtime canlı görüntü verification (post-MVP)
- OTP akışları — rezervasyon doğrulama, işletme doğrulama (post-MVP)
- Blog admin panel / markdown editör (post-MVP, şimdilik blog statik)
- Rezervasyon sistemi (post-MVP)

## Stack (KESIN, değiştirme)
- Next.js 16 App Router, React 19
- TypeScript 5 strict
- Tailwind 4 + shadcn/ui (src/components/ui/)
- Zustand (client state) + persist middleware (localStorage YERİNE)
- TanStack Query (server state)
- React Hook Form + Zod (TÜM formlar)
- next-intl (i18n, messages/ — de + en)
- Bun (npm/yarn DEĞİL)

## Klasör yapısı
src/app/           — Next.js sayfalar (App Router, server components default)
src/components/    — React component'leri
src/components/ui/ — shadcn/ui, KESINLIKLE DOKUNMA
src/hooks/         — custom hook'lar (use* prefix)
src/lib/           — util, api client, Zustand store'ları
src/lib/stores/    — Zustand store'ları (her store kendi dosyası)
messages/          — i18n JSON (de.json, en.json)
public/            — statik asset
Dockerfile         — Coolify build hedefi, DİKKATLE değiştir

## Script'ler
bun run dev        — dev server (port 3000)
bun run build      — production build (standalone, Docker için)
bun run lint       — eslint
bun run typecheck  — tsc --noEmit
bun test           — bun test runner

## Her task sonunda KESINLIKLE
1. bun run typecheck — 0 hata
2. bun run lint — 0 hata
3. Değiştirilen dosya listesi
4. Build kırıldıysa DUR, bana bildir
5. Yeni paket EKLEME — sor önce

## Kod kuralları
- Server Component default, 'use client' SADECE useState/useEffect/onClick için
- Form = React Hook Form + Zod, istisna yok
- API çağrısı = TanStack Query + lib/api.ts helper (inline fetch YOK)
- Zustand store = lib/stores/ altında, her store kendi dosyasında
- shadcn/ui component'i varsa custom yazma — önce ui/ klasörüne bak
- Tailwind utility-first, custom CSS YOK
- localStorage doğrudan KULLANMA — Zustand persist middleware
- any YASAK, unknown kullan ve narrow et
- Default export yerine named export (component'ler hariç)

## i18n kuralı
- Hardcoded metin YASAK (özellikle SEO etkiler)
- Tüm kullanıcı-facing metin messages/de.json + messages/en.json
- Component'te: const t = useTranslations('namespace')
- de birincil dil (Alman pazarı), en ikincil

## SEO kuralı (kritik, bu siteden para SEO üzerinden geliyor)
- Her sayfa: metadata export (title, description, openGraph)
- Şehir/kategori sayfaları: generateStaticParams + dynamic metadata
- Yapısal veri (JSON-LD): Betrieb detay, LocalBusiness schema
- Image: next/image zorunlu, alt text boş bırakma
- URL: kebab-case, Almanca slug (örn. /stadt/muenchen, /kategorie/fkk-club)

## Backend API
- Base URL: NEXT_PUBLIC_API_URL env
- Auth: token-based, lib/stores/auth.ts (Zustand + persist)
- Hata: TanStack Query + sonner toast
- Endpoint listesi: backend repo README

## Deployment
- Coolify self-hosted (bizim VPS)
- Dockerfile üzerinden build
- Otomatik deploy: main branch push → Coolify webhook
- .env Coolify panelinden (repo'da .env.example referans)

## Yapma
- README.md güncelleme (ayrı iş, istenirse)
- Yeni paket ekleme (sor önce)
- src/components/ui/ düzenleme (shadcn generated)
- Vercel referansı (artık Coolify'dayız)
- "İyileştirme" niyetiyle dokunulmayan dosyayı değiştirme
- MVP dışı feature'a kod yazma (socket.io, otp, reservation vb.)

## Git kuralı
- Branch: feat/xxx, fix/xxx, chore/xxx
- Commit: conventional (feat:, fix:, chore:, refactor:, docs:)
- PR AÇMA, sadece branch + push (insan açar)
- Yarım işte commit atma

## Model-spesifik notlar

### Claude Code / GLM 5.1 (Claude Code üzerinden)
- TodoWrite ile plan çıkar, onay bekle
- Her TODO sonunda typecheck çalıştır

### Codex CLI
- Task öncesi plan yaz, onay bekle
- Commit conventional format

## Codex için ek
- Her task'tan önce plan çıkar, onay bekle
- Commit mesajı: "type(scope): description" (conventional)
- Otomatik PR açma, sadece branch oluştur
  
## Guidelines

### Code Navigation (ALWAYS use LSP/Serena)
**Prefer LSP-based tools over grep for code exploration:**

**LSP Tool Operations:**
- `goToDefinition` - Jump to symbol definition
- `findReferences` - Find all usages
- `hover` - Get type info and docs
- `documentSymbol` - List symbols in a file
- `workspaceSymbol` - Search symbols project-wide
- `goToImplementation` - Find implementations
- `incomingCalls` / `outgoingCalls` - Call hierarchy

**Serena MCP (LSP-backed):**
- `find_symbol` - Find and read symbol bodies
- `get_symbols_overview` - File structure overview
- `find_referencing_symbols` - Find where symbols are used
- `replace_symbol_body` - Edit symbol definitions
- `insert_before_symbol` / `insert_after_symbol` - Add code

**Only use Grep/Glob for:**
- String/text searches in code
- File name patterns
- Non-code files (config, markdown, etc.)

### LSP Setup Status
- **TypeScript LSP**: Configured via Serena (`.serena/project.yml` — `languages: [typescript]`). Works with `tsconfig.json`.
- **ESLint**: Flat config (`eslint.config.mjs`), runs via `bun lint`. No separate ESLint LSP needed.
- **Serena**: Active at both root and `frontend/` levels with TypeScript language server.
