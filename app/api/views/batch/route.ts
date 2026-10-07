import { NextResponse } from 'next/server'
import { getAllViewCounts } from '@/lib/view-counts'

// Whole slug→count map for one content type, in ONE request, so a listing
// surface refreshes every card from a single call instead of one per card.
//
// Deliberately a sibling route rather than another handler in
// app/api/views/route.ts, which sets `export const dynamic = 'force-dynamic'`.
//
// Next does NOT clobber a Cache-Control the handler set — see
// next/dist/build/templates/app-route.js, which fills one in only when the
// response has none ("If cache control is already set on the response we
// don't override it"). What force-dynamic does is pin the route's revalidate
// to 0, which is how Next derives `private, no-cache, no-store, max-age=0,
// must-revalidate` for a handler that sets nothing, and marks the route
// uncacheable in the build output the CDN reads. Rather than depend on an
// s-maxage surviving that, this module declares no `dynamic` flag at all:
// reading request.url already keeps it from being prerendered at build time,
// while leaving the response plainly cacheable at the edge.
const CACHEABLE = 'public, s-maxage=30, stale-while-revalidate=60'
const UNCACHEABLE = 'no-store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  // Same validation as the existing handlers.
  if (type !== 'article' && type !== 'conversation') {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers: { 'Cache-Control': UNCACHEABLE } }
    )
  }

  try {
    const counts = await getAllViewCounts(type)

    // getAllViewCounts swallows its own errors and returns {}, so an empty map
    // is indistinguishable from a failed Blob read. Treat it as uncacheable:
    // caching a failure for 30s would keep every card stale for 30s past
    // recovery, and a genuinely empty store costs nothing to re-read.
    const isEmpty = Object.keys(counts).length === 0

    return NextResponse.json(
      { counts },
      { headers: { 'Cache-Control': isEmpty ? UNCACHEABLE : CACHEABLE } }
    )
  } catch {
    // Never cache a failure.
    return NextResponse.json(
      { counts: {} },
      { status: 200, headers: { 'Cache-Control': UNCACHEABLE } }
    )
  }
}
