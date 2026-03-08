import bcrypt from 'bcryptjs'

/**
 * Password Hashing Service
 *
 * Uses bcrypt with cost factor 12 for secure password hashing.
 * Cost factor 12 provides ~4096 iterations, balancing security and performance.
 *
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 */

const SALT_ROUNDS = 12

/**
 * Hash a plain text password
 */
export async function hash(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  if (password.length > 128) {
    throw new Error('Password must be at most 128 characters')
  }

  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 * Returns true if password matches, false otherwise
 *
 * IMPORTANT: Always use this function for password verification.
 * Never compare passwords directly (timing attacks).
 */
export async function verify(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false
  }

  return bcrypt.compare(password, hash)
}

/**
 * Check if a hash needs rehashing (e.g., if cost factor changed)
 */
export async function needsRehash(hash: string): Promise<boolean> {
  const rounds = bcrypt.getRounds(hash)
  return rounds < SALT_ROUNDS
}
