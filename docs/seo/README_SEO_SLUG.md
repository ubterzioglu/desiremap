# DesireMap Frontend — SEO & İçerik Sistemi

## Tam Folder Structure

```
app/
├── robots.ts                          ← GPTBot/ClaudeBot/PerplexityBot açık
├── sitemap.ts                         ← Dinamik XML sitemap
├── [locale]/
│   ├── layout.tsx                     ← RTA meta tag buraya girer
│   ├── page.tsx                       ← Ana sayfa
│   ├── venue/
│   │   └── [slug]/
│   │       └── page.tsx               ← ISR 24h, içerik motoru entegre ✓
│   ├── search/
│   │   └── page.tsx                   ← SSR dinamik, noindex kontrolü ✓
│   ├── [category]/                    ← bordell/, fkk-clubs/, escort/...
│   │   └── page.tsx
│   ├── stadt/
│   │   └── [city]/
│   │       └── page.tsx
│   ├── guide/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   └── admin/page.tsx

middleware.ts                          ← Locale routing, de prefix yok ✓
next.config.ts                        ← Image domains, headers ✓

lib/
├── api/
│   └── client.ts                      ← NestJS fetch katmanı, cache stratejisi ✓
└── seo/
    ├── types/
    │   └── schema.types.ts            ← Domain tip modeli ✓
    ├── utils/
    │   └── constants.ts               ← Site config, kategori config ✓
    ├── schemas/
    │   └── builders.ts                ← Pure schema builder'lar ✓
    ├── composers/
    │   ├── page-composers.ts          ← Sayfa bazlı schema array ✓
    │   ├── metadata-generators.ts     ← generateMetadata() helper'ları ✓
    │   └── mappers.ts                 ← NestJS DTO → Schema (anti-corruption) ✓
    └── content/
        └── content-engine.ts          ← Master template + değişken injection ✓

components/
└── seo/
    └── JsonLd.tsx                     ← Schema <script> inject ✓

types/
└── schema.types.ts                    ← Re-export (path alias için)
```

---

## Sistem Mimarisi

```
NestJS API
    ↓
lib/api/client.ts          ← Cache stratejisi burada (ISR vs no-store)
    ↓
lib/seo/composers/mappers.ts   ← DTO → Schema data (anti-corruption)
    ↓
lib/seo/content/content-engine.ts  ← İçerik paragrafları üretir
    ↓
lib/seo/composers/page-composers.ts ← Schema array compose eder
    ↓
app/[locale]/venue/[slug]/page.tsx  ← Hepsini birleştirir
    ├── JsonLd.tsx          → <script type="application/ld+json">
    └── HTML içerik        → Semantik, paragraf bazlı, min 40 kelime/section
```

---

## Render Stratejisi

| Sayfa          | Strateji      | Cache      | Açıklama                              |
|----------------|---------------|------------|---------------------------------------|
| Ana sayfa      | ISR           | 1 saat     | Günlük değişen içerik                |
| Kategori       | ISR           | 1 saat     | Mekan sayısı değişebilir             |
| Şehir          | ISR           | 1 saat     | Mekan sayısı değişebilir             |
| Venue detay    | ISR           | **24 saat**| Mekan bilgisi sık değişmez           |
| Search         | **SSR**       | no-store   | Her zaman taze                        |
| Guide/Blog     | ISR           | 7 gün      | Statik içerik                        |

---

## İçerik Motoru Mantığı

### Template rotation
`selectTemplate(templates, seed)` → slug'dan deterministik hash üretir.
Aynı slug → her build'de aynı template → cache tutarlılığı.
Farklı mekanlar → farklı template'ler → Google duplicate tespitini önler.

### Homojen dağılım
Keyword (mekan adı, şehir, kategori) cümle **ortasına** inject edilir.
Başa veya sona değil → keyword stuffing değil, doğal dil.

### Min 40 kelime / paragraf
Google'ın 2+ cümle indexleme eşiği.
FAQ cevapları min 40 kelime → AI citation için yeterli uzunluk.

### Section bağımsızlığı
Her `<section>` kendi paragrafını üretir.
Aynı keyword arka arkaya 2 section'da geçmez.

---

## SEO Kritik Noktalar

### Adult content sinyalizasyonu (iki katman)
```
app/[locale]/layout.tsx içine:
<meta name="rating" content="adult" />
<meta name="RATING" content="RTA-5042-1996-1400-1577-RTA" />
```
+ Schema içinde `audience.requiredMinAge: 18`

### AI sistemleri için robots.txt
GPTBot, ClaudeBot, PerplexityBot → `Allow: /`
Bu 3 bot kapalıysa Perplexity ve ChatGPT sizi cite edemez.

### Search sayfası SEO stratejisi
- `?city=Berlin` → indexle (yüksek hacimli)
- `?category=fkk-club` → indexle
- `?city=Berlin&category=fkk-club` → indexle
- `?q=pascha&city=Köln&category=bordell` → **noindex** (çok spesifik)
Logic: `metadata-generators.ts` içinde `paramCount` kontrolü.

### Pagination rel="prev/next"
Search sayfası Pagination component'i `rel="prev"` ve `rel="next"` link tag'i ekler.
Google bunu crawl sinyali olarak kullanır.

---

## Kurulum

```bash
# 1. Schema sistemini lib/seo/ altına kopyalayın
# 2. API client'ı lib/api/client.ts olarak ekleyin
# 3. middleware.ts projenin root'una kopyalayın
# 4. next.config.ts'i güncelleyin
# 5. JsonLd.tsx'i components/seo/ altına ekleyin

# Backend arkadaşınız DTO'ları değiştirirse:
# SADECE lib/seo/composers/mappers.ts güncellenir
```

---

## Sonraki Adım

Schema + içerik sistemi kuruldu. Sırada:
- **Ana sayfa page.tsx** — composeHomePageSchemas + içerik motoru
- **Şehir sayfası page.tsx** — composeCityPageSchemas + yakın şehir listesi
- **Kategori sayfası page.tsx** — composeCategoryPageSchemas
