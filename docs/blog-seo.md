1️⃣ Article (Ana İskelet – OLMAZSA OLMAZ)

Blog sayfasının omurgası.
Google blogu ilk buradan anlar.

ZORUNLU ALANLAR
@type: Article
headline
image
datePublished
dateModified
author
publisher
mainEntityOfPage

Alan Açıklamaları

headline → H1 ile birebir

image → En az 1200px genişlikte

author → Person veya Organization

publisher → Organization (logo şart)

mainEntityOfPage → canonical URL

OPSİYONEL AMA GÜÇLÜ
description
articleBody
keywords
wordCount
inLanguage
about
mentions

2️⃣ BlogPosting (Article’ın Blog’a Özel Versiyonu)

👉 Article yerine veya Article + BlogPosting birlikte kullanılabilir

@type: BlogPosting
headline
image
datePublished
dateModified
author
publisher
mainEntityOfPage

ARTILARI

Google blog olduğunu daha net anlar

Discover ve News tarafında avantaj sağlar

3️⃣ Author (Yazar Schema’sı)

Blogu kimin yazdığı çok kritik (E-E-A-T).

ZORUNLU
@type: Person
name

OPSİYONEL AMA ÇOK DEĞERLİ
url
image
sameAs
jobTitle
description

sameAs örnekleri

LinkedIn

Twitter (X)

GitHub

Kişisel site

4️⃣ Organization (Publisher – YAYINCI)

Google “bu site kime ait?” sorusunu buradan çözer.

ZORUNLU
@type: Organization
name
logo
url

OPSİYONEL
sameAs
contactPoint
foundingDate
address

5️⃣ BreadcrumbList (KESİNLİKLE OLMALI)

Blog iç linkleme + SERP görünümü için altın değerinde.

@type: BreadcrumbList
itemListElement

itemListElement içinde:
position
name
item

6️⃣ FAQPage (Blog içinde SSS varsa)

Bloglarda en çok rich result getiren schema.

ZORUNLU
@type: FAQPage
mainEntity

Question içinde:
@type: Question
name
acceptedAnswer

7️⃣ ImageObject (GÖRSEL GÜCÜ)

Özellikle Discover için önemli.

@type: ImageObject
url
width
height

OPSİYONEL
caption

8️⃣ Speakable (Sesli Arama – ŞART DEĞİL AMA SEVİLİR)

Türkiye’de yaygın değil ama ileriye yatırım.

@type: SpeakableSpecification
cssSelector

9️⃣ WebPage (Sayfa Kimliği)

Article’ın üst kimliği gibi düşünebilirsin.

@type: WebPage
name
url

OPSİYONEL
description
breadcrumb

🔟 WebSite (Site Kimliği)

Genelde global schema’da olur ama blog için de bağlanır.

@type: WebSite
name
url

OPSİYONEL
potentialAction (SearchAction)

1️⃣1️⃣ Comment / Interaction (Varsa)

Etkileşim sinyali verir.

commentCount
interactionStatistic

1️⃣2️⃣ About / Mentions (KONU ODAĞI)

Blog’un neyi anlattığını Google’a net söylersin.

about
mentions

Örnek type’lar:

Thing

Product

Service

SoftwareApplication

1️⃣3️⃣ isPartOf (Blog Kategorisi)
isPartOf


Kategori sayfasına bağlar.

1️⃣4️⃣ HasPart (İçerik Parçaları)
hasPart


Özellikle:

Video

Görsel galeri

PDF

1️⃣5️⃣ VideoObject (Blogda video varsa)
@type: VideoObject
name
description
thumbnailUrl
uploadDate
contentUrl
embedUrl

1️⃣6️⃣ Review / Rating (ÇOK NADİR AMA DEĞERLİ)

Blogda ürün, yazılım, hizmet inceleniyorsa.

@type: Review
reviewRating
author

1️⃣7️⃣ Accessibility (ŞART DEĞİL AMA PLUS)
accessibilityFeature
accessibilityHazard

---

## ✅ IMPLEMENTED SCHEMAS (DesireMap Blog)

**Dosya:** `src/lib/structuredData.ts` → `getBlogPostStructuredData()`

### Kullanılan Şemalar (12/17)

| # | Şema Tipi | Durum | Açıklama |
|---|-----------|-------|----------|
| 1 | Article | ✅ | Ana blog iskeleti |
| 2 | BlogPosting | ✅ | Blog-specific versiyon |
| 3 | Person (Author) | ✅ | E-E-A-T sinyali |
| 4 | Organization | ✅ | Publisher bilgisi |
| 5 | BreadcrumbList | ✅ | Navigasyon |
| 6 | FAQPage | ✅ | Rich result için |
| 7 | ImageObject | ✅ | Görsel optimizasyonu |
| 8 | SpeakableSpecification | ✅ | Sesli arama |
| 9 | WebPage | ✅ | Sayfa kimliği |
| 10 | WebSite | ✅ | Site kimliği |
| 11 | Blog (isPartOf) | ✅ | Blog bölümü |
| 12 | InteractionCounter | ✅ | Etkileşim istatistiği |
| 13 | VideoObject | ⚪ | Opsiyonel |
| 14 | Review | ⚪ | Opsiyonel |
| 15 | About/Mentions | ✅ | Ürün referansları |
| 16 | ListItem | ✅ | Breadcrumb içinde |
| 17 | Question/Answer | ✅ | FAQ içinde |

---

## 📝 BLOG CONTENT GUIDELINES

### Ana Kelime Yoğunluğu
- **Ana kelime:** %7 oranında (örn: “DesireMap” - 3000 kelimede ~210 kez)
- **Yan kelimeler:** %3 oranında (FKK Club, Laufhaus, Bordell, Berlin, Hamburg, München, erotik)

### İçerik Uzunluğu
- Minimum: 2500 kelime
- Hedef: 3000-4000 kelime
- Optimum: 3200 kelime

### H1-H2-H3 Hiyerarşisi
```
H1: Ana Başlık (1 adet - ana kelime)
├── H2: Ana Bölüm
│   ├── H3: Alt Başlık
│   │   └── p paragraflar
│   └── H3: Alt Başlık
│       └── p paragraflar
├── H2: Ana Bölüm
│   └── H3: Alt Başlık
│       └── p paragraflar
└── H2: Sonuç
```

### İç Linkleme (Maksimum 10 adet)
1. Ana sayfa: `/de/`
2. Şehir aramaları: `/de/search?city=Berlin`
3. Kategori aramaları: `/de/search?category=fkk`
4. Ürün sayfaları: `/de/bordell/[slug]`

### E-E-A-T Sinyalleri
- **Experience:** Gerçek kullanıcı deneyimleri
- **Expertise:** Alan uzmanlığı belirtileri
- **Authoritativeness:** Yazar bilgileri, sameAs linkleri
- **Trustworthiness:** Doğrulanmış bilgiler, güvenilir kaynaklar

---

## 📁 DOSYA REFERANSLARI

| Dosya | Açıklama |
|-------|----------|
| `src/lib/structuredData.ts` | Blog JSON-LD şemaları |
| `src/data/blog-posts.ts` | Blog post metadata |
| `src/data/blog-content.ts` | Blog post içerikleri |
| `src/app/[locale]/blog/page.tsx` | Blog liste sayfası |
| `src/app/[locale]/blog/[slug]/page.tsx` | Blog detay sayfası |

---

## 🚀 SONRAKİ ADIMLAR

1. [ ] Google Search Console’da blog sayfalarını indeksle
2. [ ] Rich Results Test ile blog şemalarını doğrula
3. [ ] Google Discover için görsel optimizasyonu yap
4. [ ] Blog RSS feed oluştur
5. [ ] İlgili blog yazıları için iç linkleme stratejisi geliştir