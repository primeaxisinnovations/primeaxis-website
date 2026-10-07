import { put, get } from '@vercel/blob'

type ContentType = 'article' | 'conversation' | 'profile'

// View counts live in the public Blob store — the same store image uploads
// use. Every get()/put() below passes `token` explicitly, the same way
// lib/newsletter.ts does.
//
// This is NOT cosmetic. @vercel/blob 2.4.1 resolves credentials in this order
// (dist/chunk-SH3U4PAV.js):
//
//   options.token -> VERCEL_OIDC_TOKEN + BLOB_STORE_ID -> BLOB_READ_WRITE_TOKEN
//
// With an OIDC Blob connection attached to the project, Vercel injects
// VERCEL_OIDC_TOKEN, so the OIDC branch wins and BLOB_READ_WRITE_TOKEN is
// never consulted. That broke writes while leaving reads intact: an
// authenticated put() fails, but get({ access: 'public' }) only resolves the
// public CDN URL, which needs no auth at all. The result was counts that
// rendered correctly but never persisted. Passing the token short-circuits to
// the first branch and pins the store explicitly.
//
// If BLOB_READ_WRITE_TOKEN is unset, BLOB_TOKEN is undefined; the SDK's check
// is a truthiness test, so it falls through to the OIDC/env path exactly as
// before. One JSON map per content type, e.g. { "slug-1": 42 }.
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

function pathFor(type: ContentType): string {
  return type === 'article'
    ? 'view-counts/articles.json'
    : 'view-counts/conversations.json'
}

// KNOWN, ACCEPTED LIMITATION — incrementViewCount() is a read-modify-write over
// a single JSON blob. Two increments that land in the same instant can race:
// both read the same starting value and the later write clobbers the earlier,
// losing one count. At this platform's traffic scale that is acceptable — a
// soft vanity metric, not billing data. Building atomic per-slug counters (a
// real KV/DB with INCR semantics) is disproportionate infrastructure here.
// Do NOT paper over this with locking in this file; if accuracy ever matters,
// move the store, not the code.

// Single blob read returning the whole slug→count map. This is what lets a
// listing page render a count on every card from ONE Blob fetch instead of one
// fetch per card. Resilient by design (mirrors the newsletter code): any
// failure — including the very first call before the file exists — returns an
// empty map rather than throwing.
export async function getAllViewCounts(
  type: ContentType
): Promise<Record<string, number>> {
  try {
    const result = await get(pathFor(type), { access: 'public', token: BLOB_TOKEN })
    if (!result || result.statusCode !== 200) return {}
    return (await new Response(result.stream).json()) as Record<string, number>
  } catch (error) {
    // Diagnostic only — the empty-map fallback below is unchanged. Logs the
    // message alone, never the error object or any credential.
    console.error(
      `[view-counts] read failed for ${pathFor(type)}:`,
      error instanceof Error ? error.message : String(error)
    )
    return {}
  }
}

export async function getViewCount(
  type: ContentType,
  slug: string
): Promise<number> {
  try {
    const counts = await getAllViewCounts(type)
    return counts[slug] ?? 0
  } catch (error) {
    console.error(
      `[view-counts] getViewCount failed for ${type}/${slug}:`,
      error instanceof Error ? error.message : String(error)
    )
    return 0
  }
}

export async function incrementViewCount(
  type: ContentType,
  slug: string
): Promise<number> {
  try {
    const counts = await getAllViewCounts(type)
    const next = (counts[slug] ?? 0) + 1
    counts[slug] = next
    await put(pathFor(type), JSON.stringify(counts, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
    })
    return next
  } catch (error) {
    // Match the newsletter code's resilience: a Blob failure returns a sane
    // fallback (0) instead of throwing, so the API route can still respond.
    // The log is what makes that swallowed failure visible — a 0 returned to
    // /api/views can ONLY come from here, since the success path is >= 1.
    console.error(
      `[view-counts] increment failed for ${type}/${slug}:`,
      error instanceof Error ? error.message : String(error)
    )
    return 0
  }
}
