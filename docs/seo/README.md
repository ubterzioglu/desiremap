# DesireMap – Schema & Teknik SEO Altyapısı

## Folder Structure

```
src/lib/seo/                          ← Bu klasörü buraya kopyalayın
├── types/
│   └── schema.types.ts               ← Tüm tip tanımları (domain modeli)
├── utils/
│   └── constants.ts                  ← Site config, kategori config, şehirler
├── schemas/
│   └── builders.ts                   ← Pure schema builder fonksiyonları
├── composers/
│   ├── page-composers.ts             ← Sayfa tipine göre schema array'i üretir
│   ├── metadata-generators.ts        ← generateMetadata() için Metadata objesi
│   └── mappers.ts                    ← NestJS DTO → Schema data (anti-corruption)
└── USAGE_EXAMPLES.ts                 ← Her sayfa tipi için kullanım örneği

src/components/seo/
└── JsonLd.tsx                        ← Schema'ları <script> tag'lerine yazar
```

## Katman Mimarisi

```
NestJS API Response
       ↓
   mappers.ts          ← Backend'den bağımsız, alan adlarını soyutlar
       ↓
 PageSchemaData         ← Tip-güvenli contract
       ↓
 page-composers.ts      ← Sayfa tipine göre doğru schema'ları seçer
       ↓
   builders.ts          ← Schema.org JSON-LD objelerini üretir
       ↓
  JsonLd.tsx            ← <script type="application/ld+json"> olarak DOM'a yazar
```

## Sayfa Tipleri → Schema Eşleşmesi

| Sayfa Tipi  | Schema'lar                                              |
|-------------|--------------------------------------------------------|
| Ana Sayfa   | Organization, WebSite+SearchAction, WebPage, BreadcrumbList, ItemList, FAQPage |
| Kategori    | WebPage, BreadcrumbList, ItemList, FAQPage             |
| Şehir       | WebPage, BreadcrumbList, LocalBusiness (şehir), ItemList, FAQPage |
| Mekan       | WebPage, BreadcrumbList, EntertainmentBusiness/LocalBusiness, FAQPage, ItemList (related) |
| Guide       | Article, WebPage, BreadcrumbList, FAQPage, ItemList (related) |

## Kritik Notlar

### Adult Content Sinyalizasyonu
`metadata-generators.ts` içindeki `ADULT_META_TAGS` her sayfaya eklenir:
- `rating: 'adult'` → Google adult content signal
- `RATING: 'RTA-5042-1996-1400-1577-RTA'` → JMStV uyumu
- Schema içinde `audience.audienceType: 'Adult'` + `requiredMinAge: 18`

**Bu ikisi birbirini tamamlar** — SafeSearch filtresi arkasına girmez,
ama "adult mekan" olarak doğru kategorize edilirsiniz.

### GEO için Zorunlu Alanlar
- `VenueDetail.geo` → latitude/longitude (her mekan için)
- `CityPageSchemaData.geo` → şehir merkezi koordinatı
- `buildVenueSchema` → `GeoCoordinates` schema bloğu
- `composeCityPageSchemas` → şehir bazlı `LocalBusiness` schema

### SearchAction (AI Citation için)
`buildWebSiteSchema()` içindeki `potentialAction.SearchAction`,
Perplexity ve ChatGPT'nin DesireMap'i arama aracı olarak tanımasını sağlar.
URL template'i gerçek arama endpoint'inizle eşleştirin.

### FAQPage Kalitesi
Her `answer` minimum **40 kelime** olmalı.
AI sistemleri (Perplexity, Gemini, Claude) kısa cevapları citation olarak kullanmaz.

### Backend Değişikliklerinde Ne Güncellenir
Sadece `mappers.ts` — diğer katmanlar etkilenmez.

## Kurulum

```bash
# Bu klasörü projenize kopyalayın:
cp -r desiremap-schema/ your-project/src/lib/seo/
cp JsonLd.tsx your-project/src/components/seo/

# TypeScript path alias'ı ekleyin (tsconfig.json):
# "@/lib/seo/*": ["src/lib/seo/*"]
```

## Sonraki Adım: İçerik Sistemi

Schema altyapısı kurulduktan sonra sıradaki katman:
**Master Template + Değişken Sistemi** — mekan adı, şehir, kategori
inject edilerek homojen içerik üretimi.
