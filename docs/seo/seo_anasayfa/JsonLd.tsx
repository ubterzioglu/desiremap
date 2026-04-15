/**
 * JsonLd — Schema.org inject component
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Component. Her schema ayrı <script> bloğuna yazılır.
 * Ayrı bloklar: hata izolasyonu + Google parse hızı.
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
