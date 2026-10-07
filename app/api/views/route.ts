import { NextResponse } from 'next/server'
import { getViewCount, incrementViewCount } from '@/lib/view-counts'

// Never cached: the GET below exists specifically to defeat the stale number
// baked into a page's ISR render.
export const dynamic = 'force-dynamic'

// Read-only companion to the POST below. A visitor already counted this
// session must not increment again, but the number they were served may come
// from an ISR render that is up to an hour old — this returns the live one.
// A failed read is reported as 0 with a 200 so the caller can simply ignore
// it rather than having to distinguish an error from a real count.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')

  // Same validation as POST.
  if (
    (type !== 'article' && type !== 'conversation' && type !== 'profile') ||
    typeof slug !== 'string' ||
    slug.length === 0
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const count = await getViewCount(type, slug)
    return NextResponse.json({ count }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ count: 0 }, { headers: { 'Cache-Control': 'no-store' } })
  }
}

// Public, low-stakes endpoint — no auth. Called once per visitor session by the
// interactive <ViewCounter> on article/conversation detail pages to record a
// view. Returns the new authoritative count so the client can reconcile its
// optimistic +1.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: unknown
      slug?: unknown
    }
    const { type, slug } = body

    if (
      (type !== 'article' && type !== 'conversation' && type !== 'profile') ||
      typeof slug !== 'string' ||
      slug.length === 0
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const count = await incrementViewCount(type, slug)
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}
