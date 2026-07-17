import { put, get } from '@vercel/blob'

type ContentType = 'article' | 'conversation'

// View counts live in the DEFAULT (public) Blob store — the same store image
// uploads use (process.env.BLOB_READ_WRITE_TOKEN). Unlike lib/newsletter.ts,
// no token is passed to put()/get(): these counts are non-sensitive,
// public-facing data, so the SDK's fallback to the default store is exactly
// what we want. One JSON map per content type, e.g. { "slug-1": 42 }.
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
    const result = await get(pathFor(type), { access: 'public' })
    if (!result || result.statusCode !== 200) return {}
    return (await new Response(result.stream).json()) as Record<string, number>
  } catch {
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
  } catch {
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
    })
    return next
  } catch {
    // Match the newsletter code's resilience: a Blob failure returns a sane
    // fallback (0) instead of throwing, so the API route can still respond.
    return 0
  }
}
