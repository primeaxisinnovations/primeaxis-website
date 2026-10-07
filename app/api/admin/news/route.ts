import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { revalidatePath } from 'next/cache'
import { listFiles, createOrUpdateFile } from '@/lib/github'
import { NEWS_CATEGORIES } from '@/lib/news-categories'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

interface CreateNewsBody {
  title: string
  slug: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body: string
  sourceLink: string
  status: 'draft' | 'published'
}

function validateBody(input: unknown): { value: CreateNewsBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof CreateNewsBody> = [
    'title', 'slug', 'date', 'category', 'coverImage', 'excerpt', 'body',
  ]
  for (const field of requiredStrings) {
    if (typeof b[field] !== 'string' || (b[field] as string).trim().length === 0) {
      return { error: `"${field}" is required.` }
    }
  }

  const slug = (b.slug as string).trim()
  if (!SLUG_PATTERN.test(slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers, and hyphens.' }
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
      slug,
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

export async function POST(request: NextRequest) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json().catch(() => null)
  const validated = validateBody(json)
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const { title, slug, date, category, coverImage, excerpt, body, sourceLink, status } = validated.value

  // content/news may not exist yet on this branch — listFiles throws in that
  // case. An empty directory is the correct interpretation: the very first
  // item creates the folder along with the file.
  let filenames: string[]
  try {
    filenames = (await listFiles('content/news')).filter((name) => name.endsWith('.md'))
  } catch {
    filenames = []
  }

  // Reject rather than silently overwrite an existing item.
  if (filenames.includes(`${slug}.md`)) {
    return NextResponse.json(
      { error: `A news item with the slug "${slug}" already exists. Choose a different slug.` },
      { status: 409 }
    )
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
    await createOrUpdateFile(`content/news/${slug}.md`, fileContent, `Add news: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // On-demand ISR — push the new item live immediately instead of waiting for
  // the 3600s fallback window. '/' covers both the Latest News section and
  // the BreakingBar ticker, which now merges news alongside articles.
  revalidatePath('/news')
  revalidatePath(`/news/${slug}`)
  revalidatePath('/')

  return NextResponse.json({ success: true, slug })
}
