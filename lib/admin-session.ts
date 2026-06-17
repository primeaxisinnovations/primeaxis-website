import { createHmac, timingSafeEqual } from 'crypto'

// ── Standing rule: defense in depth ──────────────────────────────────────
// proxy.ts gates everything under /admin, but it must never be the only
// check. Every admin page and API route — including ones built in later
// phases (the articles list, the article editor, the conversations editor,
// the image upload endpoint, and anything else added to the CMS) — must
// independently call verifySessionToken() on the admin_session cookie at
// the top of that page/route itself, and redirect/reject if it fails.
// Write each page/route as if proxy.ts did not exist.

export const ADMIN_SESSION_COOKIE = 'admin_session'
export const ADMIN_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60 // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set')
  }
  return secret
}

// Token format: "<expiryTimestampMs>.<hmacSignatureOfExpiryTimestamp>"
export function createSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000
  const payload = String(expiresAt)
  const signature = createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expectedSignature = createHmac('sha256', getSecret()).update(payload).digest('hex')
  const provided = Buffer.from(signature)
  const expected = Buffer.from(expectedSignature)
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return false
  }

  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && Date.now() < expiresAt
}
