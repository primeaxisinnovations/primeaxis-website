import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { revalidatePath } from 'next/cache'
import { getFile, createOrUpdateFile, deleteFile } from '@/lib/github'
import { NEWS_CATEGORIES } from '@/lib/news-categories'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

interface UpdateNewsBody {
  title: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body: string
  sourceLink: string
  status: 'draft' | 'published'
}

function validateBody(input: unknown): { value: UpdateNewsBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof UpdateNewsBody> = [
    'title', 'date', 'category', 'coverImage', 'excerpt', 'body',
  ]
  for (const field of requiredStrings) {
    if (typeof b[field] !== 'string' || (b[field] as string).trim().length === 0) {
      return { error: `"${field}" is required.` }
    }
  }

  const category = b.category as string
  if (!(NEWS_CATEGORIES as readonly string[]).includes(category)) {
    return { error: 'Invalid category.' }
  }

  // Optional — an empty string is valid and means "no source".
  const sourceLink = b.sourceLink
  if (sourceLink !== undefined && typeof sourceLink !== 'string') {
    return { error: '"sourceLink" must be a string.' }
  }

  if (b.status !== 'draft' && b.status !== 'published') {
    return { error: '"status" must be either "draft" or "published".' }
  }

  return {
    value: {
      title: (b.title as string).trim(),
      date: (b.date as string).trim(),
      category,
      coverImage: (b.coverImage as string).trim(),
      excerpt: (b.excerpt as string).trim(),
      body: (b.body as string).trim(),
      sourceLink: ((sourceLink as string | undefined) ?? '').trim(),
      status: b.status,
    },
  }
}

type RouteParams = { params: Promise<{ slug: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/news/${slug}.md`

  const json = await request.json().catch(() => null)
  const validated = validateBody(json)
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const { title, date, category, coverImage, excerpt, body, sourceLink, status } = validated.value

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No news item found with slug "${slug}".` }, { status: 404 })
  }

  const frontmatter = {
    title,
    date,
    category,
    status,
    coverImage,
    excerpt,
    sourceLink,
  }
  const fileContent = matter.stringify(`${body}\n`, frontmatter)

  try {
    await createOrUpdateFile(path, fileContent, `Update news: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // On-demand ISR — reflect the edit on the live site immediately instead of
  // waiting for the 3600s fallback window. '/' covers both the Latest News
  // section and the BreakingBar ticker.
  revalidatePath('/news')
  revalidatePath(`/news/${slug}`)
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
  const path = `content/news/${slug}.md`

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No news item found with slug "${slug}".` }, { status: 404 })
  }

  try {
    await deleteFile(path, existing.sha, `Delete news: ${slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // On-demand ISR — drop the deleted item from the live listing/detail/ticker
  // immediately instead of waiting for the 3600s fallback window.
  revalidatePath('/news')
  revalidatePath(`/news/${slug}`)
  revalidatePath('/')

  return NextResponse.json({ success: true, slug })
}
