# Graph Report - frontend  (2026-05-14)

## Corpus Check
- 235 files · ~357,138 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1142 nodes · 1774 edges · 113 communities (103 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8ce1c38d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 97|Community 97]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 60 edges
2. `Schema.org (JSON-LD) — kullanılan şemalar ve alanları` - 33 edges
3. `Input()` - 19 edges
4. `getStructuredData()` - 18 edges
5. `DesireMap.de — AGENTS.md` - 18 edges
6. `Backend API Endpoint Reference` - 18 edges
7. `getSearchPath()` - 17 edges
8. `SEO Audit Raporu - DesireMap Bordellmarkt` - 17 edges
9. `Ana sayfada hedef ürün/kategori listesi (opsiyonel ama güçlü)` - 15 edges
10. `getBlogPostStructuredData()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `getLocaleData()` --calls--> `getHomeSeoMetadata()`  [INFERRED]
  src/app/[locale]/layout.tsx → src/lib/seo/home.ts
- `handleBack()` --calls--> `getSearchPath()`  [INFERRED]
  src/app/[locale]/bordell/[slug]/ProductDetailPageContent.tsx → src/lib/navigation.ts
- `generateMetadata()` --calls--> `getProductMetadata()`  [INFERRED]
  src/app/[locale]/blog/[slug]/page.tsx → src/lib/structuredData.ts
- `BordellDetailPage()` --calls--> `getProductDetailStructuredData()`  [INFERRED]
  src/app/[locale]/bordell/[slug]/page.tsx → src/lib/structuredData.ts
- `CustomerLoginPage()` --calls--> `getLocalizedPath()`  [INFERRED]
  src/app/[locale]/login/page.tsx → src/lib/navigation.ts

## Communities (113 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (40): getAllBlogPostSlugs(), getBlogPostBySlug(), apiCall(), apiCallAgainstBase(), collapseDuplicatedApiSegments(), joinApiUrl(), normalizeApiBaseUrl(), createHeaders() (+32 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (21): handleSubmit(), parseOptionalPrice(), GoogleOAuthButton(), handleCityChange(), handleKeyDown(), handleKeyDown(), handleSearch(), useGoogleOAuth() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (21): handleBack(), generateMetadata(), getCityBySlug(), CategoriesSection(), HomePage(), usePublicEstablishments(), useScrollHeader(), useSearchPage() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (47): ✅ %100 SEO UYUMLU - TÜM ŞEMALAR MEVCUT, 10. SpeakableSpecification Eksik (Ana Sayfa), 1. ~~H1 Etiketi Görünmez~~ → KOD DÜZELTİLDİ, 1. LocalBusiness Şeması Ekle (Her Ürün İçin), 2. ~~Product JSON-LD URL'leri Hatalı~~ → KOD DÜZELTİLDİ, 2. Review Şemaları Ekle, 3. ~~Mock Data ID Tutarsızlığı~~ → KOD DÜZELTİLDİ, 3. Performance İyileştirmeleri (+39 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (45): 10) MerchantReturnPolicy SCHEMASI alanları, 11) Country SCHEMASI alanları, 12) OfferShippingDetails SCHEMASI alanları, 13) MonetaryAmount SCHEMASI alanları, 14) DefinedRegion SCHEMASI alanları, 15) ShippingDeliveryTime SCHEMASI alanları, 16) QuantitativeValue SCHEMASI alanları, 17) OpeningHoursSpecification SCHEMASI alanları (+37 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (16): handleSeed(), addToRemoveQueue(), dispatch(), genId(), reducer(), toast(), useToast(), LocaleInit() (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (37): getArticleSchema(), getAuthorSchema(), getBlogBreadcrumbSchema(), getBlogFAQSchema(), getBlogImageSchema(), getBlogPostingSchema(), getBlogPostStructuredData(), getBlogSectionSchema() (+29 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (37): code:ts (import { describe, expect, test } from 'bun:test'), code:bash (bun test src/lib/seo/metadata-contracts.test.ts -t "trustSta), code:bash (bun test src/lib/seo/metadata-contracts.test.ts), code:bash (git add messages/tr.json messages/ar.json src/app/[locale]/l), code:ts (import { generateMetadata as generateBlogPageMetadata } from), code:bash (bun test src/lib/seo/metadata-contracts.test.ts), code:bash (bun test src/lib/seo/metadata-contracts.test.ts), code:bash (git add src/app/[locale]/blog/page.tsx src/app/[locale]/sear) (+29 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (34): 10) ItemList SCHEMASI alanları ->, 11) (ItemList içindeki) ListItem alanları ->, 12) Product SCHEMASI alanları ->, 13) Brand SCHEMASI alanları ->, 14) Offer SCHEMASI alanları ->, 15) MerchantReturnPolicy SCHEMASI alanları ->, 16) Country SCHEMASI alanları ->, 17) OfferShippingDetails SCHEMASI alanları -> (+26 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (27): 10. GEO Policy, 1. Translation Repair, 2. Canonical Policy, 3. Hreflang Policy, 4. Open Graph And Social Metadata, 5. Robots Meta Policy, 6. X-Robots-Tag Policy, 7. robots.txt Policy (+19 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (3): SearchHeader(), ListingCard(), Badge()

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (24): Aşama: MVP, Backend API, Claude Code / GLM 5.1 (Claude Code üzerinden), Code Navigation (ALWAYS use LSP/Serena), Codex CLI, Codex için ek, Deployment, DesireMap.de — AGENTS.md (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (23): 1. `1e90420` - fix: update Tailwind v4 gradient classes and add AGENTS.md, 1. Object Lookup Pattern, 2. `32d531a` - refactor: reduce code complexity to pass lint (max 8), 2. Sub-Component Extraction, 3. Helper Function Extraction, After, Before, Build Verification (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (9): useIsMobile(), Sheet(), SheetDescription(), SheetHeader(), SheetTitle(), SidebarMenuButton(), useSidebar(), Skeleton() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (8): useAdminSeed(), useCreateAddress(), useCustomerAddresses(), useCustomerBadges(), useCustomerProfile(), useCustomerVisits(), useDeleteAddress(), usePublicCityCounts()

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (18): Architektur (High-Level), DesireMap — Projekt Übersicht, Entscheidungslog, Kommunikation, MVP (aktueller Fokus), Out of Scope (auch langfristig nicht), Post-MVP (nach Launch), Q2 2026 — MVP Launch (+10 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (16): Anforderungen, Backend, Dependencies installieren, Deployment, DesireMap, Dev-Server starten, Entwicklung, .env bearbeiten, NEXT_PUBLIC_API_URL setzen (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (7): useDeprovisionBusinessOperator(), useDisableBusinessOperator(), useReactivateBusinessOperator(), runRootRequest(), getConfiguredVenuePublicId(), isAdminHostname(), proxy()

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (14): 2. Authentication System, Auth Guards, code:typescript (interface TokenPayload {), code:typescript (// Authorization header: "Bearer <token>"), code:typescript (const blacklist = new Set<string>()), code:typescript (requireAuth(request)           // Returns AuthResult | AuthE), code:typescript (interface AuthResult {), code:typescript (export async function hash(password: string): Promise<string) (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (7): useAdminAuthenticated(), useAdminBusinesses(), useAdminCities(), useAdminOperators(), useAdminStats(), useAdminVenues(), OperatorDashboardWorkspace()

### Community 22 - "Community 22"
Cohesion: 0.19
Nodes (4): useAdminEvents(), useCancelEvent(), useCreateEvent(), usePublishEvent()

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (11): Ana Kelime Yoğunluğu, 📝 BLOG CONTENT GUIDELINES, code:block1 (H1: Ana Başlık (1 adet - ana kelime)), 📁 DOSYA REFERANSLARI, E-E-A-T Sinyalleri, İçerik Uzunluğu, H1-H2-H3 Hiyerarşisi, ✅ IMPLEMENTED SCHEMAS (DesireMap Blog) (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (3): ScrollArea(), handleKeyPress(), sendMessage()

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (10): 11. Testing, 12. Key Files Reference, 5. State Management, code:typescript (interface AuthState {), code:typescript (interface AdminState {), code:bash (bun test                           # All tests), code:typescript (import { describe, expect, test } from 'bun:test'), DesireMap Backend Architecture (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.2
Nodes (10): 5. Member Reservation Flow, code:json ({ "decision": "RECONFIRM | DECLINE" }), code:json ({), code:json ({), code:json ({), `POST /member/events/:eventPublicId/holds`, `POST /member/events/:eventPublicId/waitlist`, `POST /member/holds/:holdPublicId/reservations` (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (8): 1. İçerikte tanım cümlesi var mı?, 2. Alt niyet kümeleri kapsanmış mı? (0/6), 3. Görsellerin altında açıklama var mı?, 4. İçeriği kimin yazdığı belli mi?, 5. Yayın tarihi belirtilmiş mi?, 6. Son güncelleme tarihi var mı?, Hatalı Maddeler, Spindora - GEO İçerik Analizi Hataları

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (8): 12. Operator Reservation Operations, 4. Member Dashboard, 9. Pricing Rules, Backend API Endpoint Reference, code:json ({), General Rules, Module Map, `POST .../pricing-rules` body

### Community 33 - "Community 33"
Cohesion: 0.25
Nodes (3): useCreateCity(), useDeleteCity(), useUpdateCity()

### Community 34 - "Community 34"
Cohesion: 0.32
Nodes (4): getSearchableFields(), matchesSearchQuery(), searchBordells(), sortBordellsByRanking()

### Community 35 - "Community 35"
Cohesion: 0.25
Nodes (8): 2. Operator Auth, code:json ({), code:json ({ "email": "admin@nordicsauna.de" }), code:json ({), `POST /operator-auth/invitations/accept`, `POST /operator-auth/login`, `POST /operator-auth/password-reset/confirm`, `POST /operator-auth/password-reset/request`

### Community 36 - "Community 36"
Cohesion: 0.25
Nodes (8): 14. Security & Risk, code:json ({), code:json ({), Member Restrictions (Venue Scope), `POST .../restrictions` body, `POST .../risk-signals` body, Risk Signals, Session Revocation

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (8): 3. API Routes Structure, code:block10 (/api/), code:typescript (async function checkAdminAccess() {), code:typescript (const session = await getServerSession(authOptions)), code:typescript (const schema = z.object({), code:typescript (const isAdmin = session.user.role === 'admin'), Common Route Patterns, Route Categories

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (8): 1. Database Layer, code:typescript (// src/lib/db.ts), code:block2 (User (CUSTOMER | OWNER | ADMIN)), Data Models, Enums, JSON Fields, Prisma Client Pattern, Technology

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): Admin (admin.ts), Core (index.ts), Feb 22, 2026, Files, Key Types, Module Info, Recent Activity

### Community 42 - "Community 42"
Cohesion: 0.29
Nodes (6): Agent Name, Allowed Tools, Core Principles:, Example Workflow Trigger, GLM-5 Agent Configuration for Claude Code, Instructions

### Community 43 - "Community 43"
Cohesion: 0.29
Nodes (7): 10. Environment Variables, code:env (DATABASE_URL=postgresql://...), code:env (PASETO_PRIVATE_KEY=base64_encoded_ed25519_private_key), code:env (GOOGLE_CLIENT_ID=...), Google OAuth, PASETO, Required

### Community 45 - "Community 45"
Cohesion: 0.33
Nodes (5): 1. Tarih ve tazelik, 2. Dış referans çeşitliliği, 3. Video / gömülü içerik / modern görsel, Hatalı Maddeler, Spindora - GEO (Yapay Zeka) Analizi Hataları

### Community 46 - "Community 46"
Cohesion: 0.33
Nodes (6): 6. Operator Business & Venue Setup, code:json ({), code:json ({), `POST /operator/businesses`, `POST /operator/businesses/:businessAccountPublicId/venues` body, Venue Endpoints

### Community 47 - "Community 47"
Cohesion: 0.33
Nodes (6): 7. Response Patterns, code:typescript (return NextResponse.json({ /* data */ }, { status: 201 })), code:typescript (// Validation error), Error Responses, Status Code Usage, Success Response

### Community 48 - "Community 48"
Cohesion: 0.33
Nodes (5): Components, Dependencies, Feb 22, 2026, Module Info, Recent Activity

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (5): Components, Dependencies, Feb 22, 2026, Module Info, Recent Activity

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (5): Components, Dependencies, Feb 22, 2026, Module Info, Recent Activity

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (5): Components, Dependencies, Feb 22, 2026, Module Info, Recent Activity

### Community 58 - "Community 58"
Cohesion: 0.4
Nodes (4): Admin, Customer, Customer 2, Test Users

### Community 59 - "Community 59"
Cohesion: 0.4
Nodes (5): 13. Operator Management, Business Scope, code:json ({), `POST .../invitations` body, Venue Scope (Invitations)

### Community 60 - "Community 60"
Cohesion: 0.4
Nodes (5): 1. Member Auth, code:json ({), code:json ({), `POST /member-auth/request-otp`, `POST /member-auth/verify-otp`

### Community 61 - "Community 61"
Cohesion: 0.4
Nodes (5): 9. Business Logic Patterns, Admin Stats Aggregation, Booking Creation, code:typescript (if (status === 'APPROVED') {), Review Approval

### Community 62 - "Community 62"
Cohesion: 0.4
Nodes (4): Exports, Feb 22, 2026, Module Info, Recent Activity

### Community 63 - "Community 63"
Cohesion: 0.83
Nodes (3): createSystemMessage(), createUserMessage(), generateMessageId()

### Community 67 - "Community 67"
Cohesion: 0.83
Nodes (3): getSessionUserFromRequest(), parseAuthUser(), requireAdminSession()

### Community 69 - "Community 69"
Cohesion: 0.5
Nodes (3): Feb 22, 2026, Module Info, Recent Activity

### Community 70 - "Community 70"
Cohesion: 0.5
Nodes (3): 4. Client API Layer, API Modules, Core Function

### Community 71 - "Community 71"
Cohesion: 0.5
Nodes (4): 8. Seed Data, code:typescript (if (process.env.NODE_ENV === 'production') {), Protected in Production, Seeded Entities

### Community 72 - "Community 72"
Cohesion: 0.5
Nodes (3): Feb 22, 2026, Module Info, Recent Activity

### Community 73 - "Community 73"
Cohesion: 0.5
Nodes (3): Feb 22, 2026, Module Info, Recent Activity

### Community 74 - "Community 74"
Cohesion: 0.5
Nodes (3): Feb 22, 2026, Module Info, Recent Activity

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (3): 3. Public Browse, code:block6 (cityId, serviceTypeId, page, limit), Query params — `GET /public/establishments`

### Community 79 - "Community 79"
Cohesion: 0.67
Nodes (3): 11. Event Form Fields, code:json ({), `POST .../form-fields` body

### Community 80 - "Community 80"
Cohesion: 0.67
Nodes (3): 10. Promo Codes, code:json ({), `POST .../promo-codes` body

### Community 81 - "Community 81"
Cohesion: 0.67
Nodes (3): 15. Subscriptions, code:json ({), `POST .../subscription/change` body

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (3): 8. Ticket Tiers, code:json ({), `POST .../ticket-tiers` body

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (3): 7. Operator Event Lifecycle, code:json ({), `POST .../events` body

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (3): 6. Middleware, Route Protection Matrix, Token Flow

## Knowledge Gaps
- **340 isolated node(s):** `Admin`, `Customer`, `Customer 2`, `1. Tarih ve tazelik`, `2. Dış referans çeşitliliği` (+335 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 7` to `Community 1`, `Community 2`, `Community 5`, `Community 11`, `Community 14`, `Community 15`, `Community 24`, `Community 26`, `Community 28`, `Community 29`, `Community 30`, `Community 40`, `Community 41`, `Community 44`, `Community 53`, `Community 54`, `Community 55`, `Community 56`, `Community 64`, `Community 65`, `Community 66`, `Community 76`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `Input()` connect `Community 1` to `Community 33`, `Community 11`, `Community 14`, `Community 22`, `Community 24`, `Community 57`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getStructuredData()` (e.g. with `HomePage()` and `getHomeSeoMetadata()`) actually correct?**
  _`getStructuredData()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Admin`, `Customer`, `Customer 2` to the rest of the system?**
  _340 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._