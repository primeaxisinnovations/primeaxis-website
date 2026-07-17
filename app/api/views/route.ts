import { NextResponse } from 'next/server'
import { incrementViewCount } from '@/lib/view-counts'

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
      (type !== 'article' && type !== 'conversation') ||
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
