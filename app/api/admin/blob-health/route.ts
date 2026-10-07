import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { list, put, del } from '@vercel/blob'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

// TEMPORARY DIAGNOSTIC — delete once Blob writes are confirmed working.
// Admin-only. Reports which credential the @vercel/blob SDK actually picks in
// this runtime and whether a real write succeeds. It NEVER returns a token:
// only the 16-character store ID segment, which is an identifier, not a secret.
export const dynamic = 'force-dynamic'

const TEST_PATHNAME = 'healthcheck/test.txt'

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

// vercel_blob_rw_<STORE_ID>_<secret> — segment 4 is the store ID.
function storeIdFromToken(token: string | undefined): string | null {
  if (!token) return null
  const parts = token.trim().split('_')
  return parts.length >= 5 && token.trim().startsWith('vercel_blob_rw_')
    ? parts[3]
    : null
}

// Mirrors @vercel/blob 2.4.1's resolution order (dist/chunk-SH3U4PAV.js):
// options.token -> VERCEL_OIDC_TOKEN + BLOB_STORE_ID -> BLOB_READ_WRITE_TOKEN.
// This is the crux of the bug: with an OIDC connection attached, the OIDC
// branch wins and BLOB_READ_WRITE_TOKEN is never consulted.
function predictedCredentialMode(): string {
  if (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID) {
    return 'oidc (BLOB_READ_WRITE_TOKEN is IGNORED when no token option is passed)'
  }
  if (process.env.VERCEL_OIDC_TOKEN && !process.env.BLOB_STORE_ID) {
    return 'oidc token present but no BLOB_STORE_ID — falls through to BLOB_READ_WRITE_TOKEN'
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'readWrite (BLOB_READ_WRITE_TOKEN)'
  return 'none — the SDK will throw "No blob credentials found"'
}

// One write + cleanup. `token` undefined reproduces exactly what
// lib/view-counts.ts and the upload route do today.
async function probeWrite(token?: string) {
  try {
    const blob = await put(TEST_PATHNAME, `blob-health ${new Date().toISOString()}`, {
      access: 'public',
      contentType: 'text/plain',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...(token ? { token } : {}),
    })

    let cleanup = 'deleted'
    try {
      await del(blob.url, token ? { token } : undefined)
    } catch (error) {
      cleanup = `delete failed: ${messageOf(error)}`
    }

    return { ok: true, error: null, cleanup }
  } catch (error) {
    return { ok: false, error: messageOf(error), cleanup: 'not attempted — write failed' }
  }
}

export async function GET() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(sessionToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rwToken = process.env.BLOB_READ_WRITE_TOKEN

  const env = {
    blobReadWriteTokenPresent: Boolean(rwToken),
    storeIdFromReadWriteToken: storeIdFromToken(rwToken),
    blobStoreId: process.env.BLOB_STORE_ID ?? null,
    vercelOidcTokenPresent: Boolean(process.env.VERCEL_OIDC_TOKEN),
    predictedCredentialMode: predictedCredentialMode(),
  }

  let listResult: { ok: boolean; error: string | null } = { ok: false, error: null }
  try {
    await list({ limit: 1 })
    listResult = { ok: true, error: null }
  } catch (error) {
    listResult = { ok: false, error: messageOf(error) }
  }

  // The decisive comparison: the same write, once the way the app does it now
  // and once with the read-write token passed explicitly.
  const writeAsAppDoesNow = await probeWrite()
  const writeWithExplicitToken = rwToken
    ? await probeWrite(rwToken)
    : { ok: false, error: 'BLOB_READ_WRITE_TOKEN not set', cleanup: 'not attempted' }

  return NextResponse.json({
    note: 'Temporary diagnostic route. No token value is ever returned.',
    env,
    list: listResult,
    write: {
      pathname: TEST_PATHNAME,
      asAppDoesNow: writeAsAppDoesNow,
      withExplicitToken: writeWithExplicitToken,
    },
  })
}
