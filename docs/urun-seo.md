## Ürün Sayfaları SEO Özeti - DesireMap Bordellmarkt

### Yapı (kısa)
- **Amaç**: Ürün sayfalarında (Bordell detay sayfaları) tekil içerik + net bilgi mimarisi + güçlü iç link ağı + zengin Schema.org (JSON-LD) ile arama niyetini karşılamak.
- **Sayfa türleri**:
  - **Ana sayfa (`/[locale]/page.tsx`)**: Hedef ürün/kategori odağı + ItemList/Product listesi + FAQ.
  - **Ürün detay (`/[locale]/bordell/[slug]/page.tsx`)**: Ürün bazlı meta + içerik bölümleri + breadcrumb + ilgili ürünler iç link bloğu + ürün schema.

### H1–H2–H3 hiyerarşisi
- **H1**: Sayfanın ana hedef anahtar kelimesi (Bordell adı). Her sayfada **tek H1**.
- **H2**: Ana bölümler (örn. "Was ist [Bordell]?", "Leistungen und Services", "Lage und Erreichbarkeit", "Damen und Atmosphäre", "Bewertungen", "FAQ", "Kontakt").
- **H3**: H2 altındaki alt başlıklar (örn. "Hauptservices", "Preise", "Adresse", "Öffnungszeiten"). **Seviye atlanmıyor** (H1→H2→H3).

### İç linkleme (internal linking)
- **İlgili Modeller bloğu**: Hedef anahtar kelimeler için ürün sayfalarında karşılıklı linkleme:
  - `/[locale]/bordell/[slug]`
  - `/[locale]/search?city=[city]`
  - `/[locale]/search?category=[type]`
- **İçerik içinde bağlamsal linkler**: Metin içinde ilgili ürün/kategori sayfalarına referans.
- **Breadcrumb**: Anasayfa → Şehir → Kategori → Ürün.
- **Site geneli**: Menü ve footer linkleri ile kategori/kurumsal sayfalara dağıtım.

### Canonical / URL tekilleştirme
- **Ana sayfa canonical**: query parametreleri temizlenmiş, `/` tekilleştirme.
- **Ürün sayfaları**: `slug` üzerinden tek URL hedefi (schema `@id` ve `url` bu yapıya göre).

---

## Schema.org (JSON-LD) — kullanılan şemalar ve alanları

> Not: Ürün sayfalarında tek kaynak var:
> - **`src/lib/structuredData.ts` → `getProductDetailStructuredData()`** (kapsamlı graph)
>
> Aşağıdaki alan listeleri, projede kullanılan tüm şema tiplerini ve alanlarını kapsar.

### 1) WebSite SCHEMASI alanları
- `@type`(WebSite), `@id`, `name`, `url`, `inLanguage`, `potentialAction`, `publisher`, `description`

### 2) SearchAction SCHEMASI alanları
- `@type`(SearchAction), `target`, `query-input`

### 3) EntryPoint SCHEMASI alanları
- `@type`(EntryPoint), `urlTemplate`

### 4) Organization SCHEMASI alanları
- `@type`(Organization), `@id`, `name`, `url`, `logo`, `sameAs`, `contactPoint`

### 5) ImageObject SCHEMASI alanları
- `@type`(ImageObject), `url`, `width`, `height`

### 6) ContactPoint SCHEMASI alanları
- `@type`(ContactPoint), `telephone`, `contactType`, `areaServed`, `availableLanguage`

### 7) Product SCHEMASI alanları
- `@type`(Product), `@id`, `name`, `image`, `description`, `brand`, `url`, `sku`, `mpn`, `offers`, `aggregateRating`, `review`

### 8) Brand SCHEMASI alanları
- `@type`(Brand), `name` (DesireMap)

### 9) Offer SCHEMASI alanları
- `@type`(Offer), `url`, `priceCurrency`, `price`, `priceValidUntil`, `availability`, `itemCondition`, `seller`, `hasMerchantReturnPolicy`, `shippingDetails`

### 10) MerchantReturnPolicy SCHEMASI alanları
- `@type`(MerchantReturnPolicy), `applicableCountry`, `returnPolicyCategory`, `merchantReturnDays`, `returnMethod`, `returnFees`

### 11) Country SCHEMASI alanları
- `@type`(Country), `name`

### 12) OfferShippingDetails SCHEMASI alanları
- `@type`(OfferShippingDetails), `shippingRate`, `shippingDestination`, `deliveryTime`

### 13) MonetaryAmount SCHEMASI alanları
- `@type`(MonetaryAmount), `value`, `currency`

### 14) DefinedRegion SCHEMASI alanları
- `@type`(DefinedRegion), `addressCountry`

### 15) ShippingDeliveryTime SCHEMASI alanları
- `@type`(ShippingDeliveryTime), `handlingTime`, `transitTime`

### 16) QuantitativeValue SCHEMASI alanları
- `@type`(QuantitativeValue), `minValue`, `maxValue`, `unitCode`

### 17) OpeningHoursSpecification SCHEMASI alanları
- `@type`(OpeningHoursSpecification), `dayOfWeek`, `opens`, `closes`

### 18) AggregateRating SCHEMASI alanları
- `@type`(AggregateRating), `ratingValue`, `reviewCount`, `bestRating`, `worstRating`

### 19) Review SCHEMASI alanları (ürün sayfaları için)
- `@type`(Review), `@id`, `author`, `datePublished`, `reviewBody`, `reviewRating`

### 20) Person SCHEMASI alanları (Review author için)
- `@type`(Person), `name`

### 21) Rating SCHEMASI alanları (Review rating için)
- `@type`(Rating), `ratingValue`, `bestRating`, `worstRating`

### 22) WebPage SCHEMASI alanları
- `@type`(WebPage), `@id`, `url`, `name`, `description`, `isPartOf`, `breadcrumb`, `inLanguage`, `datePublished`, `dateModified`, `primaryImageOfPage`, `speakable`, `mainEntity`

### 23) SpeakableSpecification SCHEMASI alanları (sesli arama için)
- `@type`(SpeakableSpecification), `cssSelector`

### 24) BreadcrumbList SCHEMASI alanları
- `@type`(BreadcrumbList), `@id`, `itemListElement`

### 25) ListItem SCHEMASI alanları
- `@type`(ListItem), `position`, `name`, `item`

### 26) FAQPage SCHEMASI alanları
- `@type`(FAQPage), `@id`, `mainEntity`

### 27) Question SCHEMASI alanları
- `@type`(Question), `name`, `acceptedAnswer`

### 28) Answer SCHEMASI alanları
- `@type`(Answer), `text`

### 29) LocalBusiness SCHEMASI alanları (ek olarak)
- `@type`(LocalBusiness), `@id`, `name`, `description`, `url`, `telephone`, `email`, `address`, `geo`, `openingHoursSpecification`, `priceRange`, `aggregateRating`, `image`, `sameAs`

### 30) PostalAddress SCHEMASI alanları
- `@type`(PostalAddress), `streetAddress`, `addressLocality`, `addressCountry`

### 31) GeoCoordinates SCHEMASI alanları
- `@type`(GeoCoordinates), `latitude`, `longitude`

### 32) ItemList SCHEMASI alanları (related products)
- `@type`(ItemList), `@id`, `name`, `numberOfItems`, `itemListElement`

---

## Dosya referansı (nerede üretiliyor)
- **Ürün sayfası Schema Graph**: `src/lib/structuredData.ts` → `getProductDetailStructuredData()`
- **Ürün sayfası iç link bloğu (related products)**: `src/app/[locale]/bordell/[slug]/ProductDetailPageContent.tsx`
- **Ana sayfa schema'ları**: `src/lib/structuredData.ts` → `getStructuredData()`
- **Ürün SEO içerik bölümü**: `src/app/[locale]/bordell/[slug]/ProductSEOContent.tsx`

---

## Implementasyon Detayları

### Meta Tags (ürün sayfaları)
```typescript
// getProductMetadata() fonksiyonu ile üretilir
{
  title: "[Bordell Adı] - [Tip] in [Şehir] | Bordellmarkt",
  description: "[Bordell Adı] in [Şehir]. [Açıklama özeti]... Verifiziert auf dem Bordellmarkt.",
  canonical: "https://desiremap.de/[locale]/bordell/[slug]",
  openGraph: {
    type: "website",
    title, description,
    images: [{ url: coverImage, width: 1200, height: 630 }]
  }
}
```

### Breadcrumb Yapısı
1. Home → `/${locale}`
2. Şehir → `/${locale}/search?city=${city}`
3. Kategori → `/${locale}/search?category=${type}`
4. Ürün Adı (mevcut sayfa)

### İç Link Stratejisi
- "Bordellmarkt" ana sayfasına link (keyword: bordellmarkt)
- Kategori sayfalarına link (keyword: fkk, laufhaus, bordell, studio, privat)
- Şehir sayfalarına link (keyword: berlin, hamburg, münchen, etc.)
- Related products bölümü (3 benzer işletme)

### Keyword Yoğunluğu (ürün sayfaları)
- **Bordellmarkt**: Her içerik bölümünde 1-2 kez doğal olarak
- **[Bordell Adı]**: Sayfa başına 5-10 kez
- **[Tip]**: FKK Club, Laufhaus, Bordell, Studio, Privat - bağlama uygun
- **[Şehir]**: Lokal SEO için önemli
