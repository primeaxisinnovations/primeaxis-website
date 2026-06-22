import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile, createOrUpdateFile, deleteFile } from '@/lib/github'
import { CATEGORIES } from '@/lib/categories'
import { calculateReadingTime, stripHtml } from '@/lib/utils'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

interface UpdateArticleBody {
  title: string
  category: string
  author: string
  date: string
  excerpt: string
  featuredImage: string
  tags: string[]
  body: string
  status: 'draft' | 'published'
}

function validateBody(input: unknown): { value: UpdateArticleBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof UpdateArticleBody> = [
    'title', 'category', 'author', 'date', 'excerpt', 'featuredImage', 'body',
  ]
  for (const field of requiredStrings) {
    if (typeof b[field] !== 'string' || (b[field] as string).trim().length === 0) {
      return { error: `"${field}" is required.` }
    }
  }

  const category = b.category as string
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    return { error: 'Invalid category.' }
  }

  const tags = b.tags
  if (tags !== undefined && !(Array.isArray(tags) && tags.every((t) => typeof t === 'string'))) {
    return { error: 'Tags must be an array of strings.' }
  }

  if (b.status !== 'draft' && b.status !== 'published') {
    return { error: '"status" must be either "draft" or "published".' }
  }

  return {
    value: {
      title: (b.title as string).trim(),
      category,
      author: (b.author as string).trim(),
      date: (b.date as string).trim(),
      excerpt: (b.excerpt as string).trim(),
      featuredImage: (b.featuredImage as string).trim(),
      tags: (tags as string[] | undefined) ?? [],
      body: (b.body as string).trim(),
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
  const path = `content/articles/${slug}.md`

  const json = await request.json().catch(() => null)
  const validated = validateBody(json)
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const { title, category, author, date, excerpt, featuredImage, tags, body, status } = validated.value

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No article found with slug "${slug}".` }, { status: 404 })
  }

  // Reference code always comes from the existing file, never from the
  // request — it must never change on an edit.
  const { data: existingData } = matter(existing.content)
  const referenceCode = existingData.referenceCode

  const readingTime = calculateReadingTime(stripHtml(body).split(/\s+/).filter(Boolean).length)

  const frontmatter = {
    title,
    excerpt,
    category,
    author,
    date,
    readingTime,
    featuredImage,
    tags,
    referenceCode,
    status,
  }
  const fileContent = matter.stringify(`${body}\n`, frontmatter)

  try {
    await createOrUpdateFile(path, fileContent, `Update article: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug, referenceCode })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/articles/${slug}.md`

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No article found with slug "${slug}".` }, { status: 404 })
  }

  try {
    await deleteFile(path, existing.sha, `Delete article: ${slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
