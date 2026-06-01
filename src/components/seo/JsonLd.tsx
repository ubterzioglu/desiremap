interface JsonLdProps {
  schemas: object[]
}

const SCHEMA_CONTEXT = 'https://schema.org'

/**
 * Ensures every emitted script carries `@context`. Without it, consumers resolve `@type`
 * against the page base URL (e.g. `https://desiremap.de/Organization`) instead of schema.org,
 * which breaks Rich Results. Graph objects that already declare `@context` are left untouched.
 */
function ensureContext(schema: object): object {
  if ('@context' in schema) return schema
  return { '@context': SCHEMA_CONTEXT, ...schema }
}

export function serializeJsonLd(schema: object) {
  return JSON.stringify(schema, null, 0)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function JsonLd({ schemas }: JsonLdProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(ensureContext(schema)),
          }}
        />
      ))}
    </>
  )
}
