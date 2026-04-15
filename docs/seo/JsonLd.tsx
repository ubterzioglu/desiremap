/**
 * JsonLd Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Schema array'ini alır, her birini ayrı <script> bloğuna yazar.
 * Next.js App Router — Server Component olarak çalışır.
 *
 * Neden ayrı <script> blokları?
 * Google, tek büyük @graph bloğu yerine ayrı script tag'lerini daha iyi parse eder.
 * Hata izolasyonu da sağlar: bir schema geçersizse diğerleri etkilenmez.
 *
 * Kullanım (page.tsx içinde):
 *   import { JsonLd } from '@/components/seo/JsonLd'
 *   import { composeHomePageSchemas } from '@/lib/seo/composers/page-composers'
 *
 *   export default async function HomePage() {
 *     const data = await fetchHomePageData()
 *     const schemas = composeHomePageSchemas(data)
 *     return (
 *       <>
 *         <JsonLd schemas={schemas} />
 *         <main>...</main>
 *       </>
 *     )
 *   }
 */

interface JsonLdProps {
  schemas: object[]
}

export function JsonLd({ schemas }: JsonLdProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  )
}
