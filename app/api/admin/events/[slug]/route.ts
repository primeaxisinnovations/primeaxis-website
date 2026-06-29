import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile, createOrUpdateFile, deleteFile } from '@/lib/github'
import { validateEventBody, buildEventFrontmatter } from '@/lib/event-validation'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

type RouteParams = { params: Promise<{ slug: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/events/${slug}.md`

  const json = await request.json().catch(() => null)
  const validated = validateEventBody(json)
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const { title } = validated.value

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No event found with slug "${slug}".` }, { status: 404 })
  }

  const fileContent = matter.stringify('', buildEventFrontmatter(validated.value))

  try {
    await createOrUpdateFile(path, fileContent, `Update event: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // On-demand ISR — reflect the edit on the live site immediately instead of
  // waiting for the 3600s fallback window to expire.
  revalidatePath('/events')
  revalidatePath('/')

  return NextResponse.json({ success: true, slug })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/events/${slug}.md`

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No event found with slug "${slug}".` }, { status: 404 })
  }

  try {
    await deleteFile(path, existing.sha, `Delete event: ${slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // On-demand ISR — drop the deleted event from the live listing immediately
  // instead of waiting for the 3600s fallback window to expire.
  revalidatePath('/events')
  revalidatePath('/')

  return NextResponse.json({ success: true, slug })
}
