/**
 * Token Blacklist Service
 *
 * For MVP: In-memory Set (resets on server restart)
 * For Production: Use Redis with TTL matching token expiry
 *
 * Tokens are blacklisted by their JTI (JWT ID)
 */

// In-memory blacklist for MVP
const blacklist = new Set<string>()

/**
 * Add token JTI to blacklist
 */
export function revokeToken(jti: string): void {
  blacklist.add(jti)
}

/**
 * Check if token JTI is blacklisted
 */
export function isRevoked(jti: string): boolean {
  return blacklist.has(jti)
}

/**
 * Remove expired tokens (call periodically in production)
 * For MVP with in-memory, tokens expire on server restart
 */
export function cleanup(): void {
  // In production with Redis, this would be handled by TTL
  // For MVP, no-op
}
