import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, createOrUpdateFile } from '@/lib/github'
import { validateEventBody, buildEventFrontmatter } from '@/lib/event-validation'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function POST(request: NextRequest) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json().catch(() => null)
  const validated = validateEventBody(json, { requireSlug: true })
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const { slug, title } = validated.value

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must contain only lowercase letters, numbers, and hyphens.' },
      { status: 400 }
    )
  }

  let filenames: string[]
  try {
    filenames = (await listFiles('content/events')).filter((name) => name.endsWith('.md'))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Reject rather than silently overwrite an existing event.
  if (filenames.includes(`${slug}.md`)) {
    return NextResponse.json(
      { error: `An event with the slug "${slug}" already exists. Choose a different slug.` },
      { status: 409 }
    )
  }

  const fileContent = matter.stringify('', buildEventFrontmatter(validated.value))

  try {
    await createOrUpdateFile(`content/events/${slug}.md`, fileContent, `Add event: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
