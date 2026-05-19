/**
 * Input Sanitization Utilities
 *
 * Protects against:
 * - XSS (script injection, event handlers, HTML elements)
 * - SQL injection (quotes, semicolons, comments, operators)
 * - Prototype pollution (__proto__, constructor, prototype)
 * - Deep object injection (nested objects in flat fields)
 * - NoSQL injection ($where, $gt, $ne, etc.)
 */

// ─── Dangerous patterns ──────────────────────────────────────────

/** Characters that must never appear in user input */
const FORBIDDEN_CHARS = /[<>"'&()=;`\\{}[\]$]/g

/** Strings that indicate injection attempts */
const INJECTION_PATTERNS = [
  /\b__proto__\b/gi,
  /\bconstructor\b/gi,
  /\bprototype\b/gi,
  /\bprototype pollution\b/gi,
  /\$\w+/g,                // $where, $gt, $ne, $or — NoSQL injection
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|FROM|WHERE)\b/gi,
  /\b(OR|AND)\s+\d+\s*=\s*\d+/gi,  // OR 1=1
  /--/g,                    // SQL comments
  /\/\*.*?\*\//g,           // Block comments
  /\b(script|onerror|onload|onclick|onmouseover|onfocus|onblur)\b/gi,
  /\bjavascript:/gi,
  /\bdata:\s*text\/html/gi,
]

// ─── Sanitizers ──────────────────────────────────────────────────

/** Whitelist approach: only allow safe characters for emails */
export function sanitizeEmail(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9@._\-+]/g, '').trim().slice(0, 254)
}

/** Strip dangerous characters from passwords, keep usable chars */
export function sanitizePassword(raw: string): string {
  return raw.replace(FORBIDDEN_CHARS, '').trim().slice(0, 128)
}

/** Strip dangerous characters from any text field */
export function sanitizeText(raw: string): string {
  let clean = raw.replace(FORBIDDEN_CHARS, '').trim()
  for (const pattern of INJECTION_PATTERNS) {
    clean = clean.replace(pattern, '')
  }
  return clean.slice(0, 1000)
}

/**
 * Deep-sanitize an object destined for an API payload.
 * Removes prototype pollution keys, strips strings, drops non-primitive leaf values.
 */
export function sanitizePayload<T extends Record<string, unknown>>(obj: T): T {
  const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

  function clean(value: unknown): unknown {
    if (typeof value === 'string') return sanitizeText(value)
    if (typeof value === 'number' || typeof value === 'boolean') return value
    if (value === null || value === undefined) return value
    if (Array.isArray(value)) return value.map(clean)
    if (typeof value === 'object') {
      const safe: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(value)) {
        if (DANGEROUS_KEYS.has(key)) continue
        if (key.startsWith('$')) continue
        safe[key] = clean(val)
      }
      return safe
    }
    return undefined // functions, symbols — drop
  }

  return clean(obj) as T
}

// ─── Validators ──────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
