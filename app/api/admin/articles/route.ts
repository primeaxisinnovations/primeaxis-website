import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile, createOrUpdateFile } from '@/lib/github'
import { CATEGORIES, CATEGORY_CODES, type Category } from '@/lib/categories'
import { calculateReadingTime, stripHtml } from '@/lib/utils'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

interface CreateArticleBody {
  title: string
  slug: string
  category: string
  author: string
  date: string
  excerpt: string
  featuredImage: string
  tags: string[]
  body: string
  status: 'draft' | 'published'
}

function validateBody(input: unknown): { value: CreateArticleBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof CreateArticleBody> = [
    'title', 'slug', 'category', 'author', 'date', 'excerpt', 'featuredImage', 'body',
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
      slug,
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
  const { title, slug, category, author, date, excerpt, featuredImage, tags, body, status } = validated.value

  let filenames: string[]
  try {
    filenames = (await listFiles('content/articles')).filter((name) => name.endsWith('.md'))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Reject rather than silently overwrite an existing article.
  if (filenames.includes(`${slug}.md`)) {
    return NextResponse.json(
      { error: `An article with the slug "${slug}" already exists. Choose a different slug.` },
      { status: 409 }
    )
  }

  // Reference code = category abbreviation + year + (highest existing number
  // for that category, across all years, + 1). Using the max rather than a
  // count avoids collisions if an article was ever deleted.
  const code = CATEGORY_CODES[category as Category]
  let maxNumber = 0
  try {
    const existingFiles = await Promise.all(filenames.map((name) => getFile(`content/articles/${name}`)))
    const codePattern = new RegExp(`^${code}-\\d{4}-(\\d+)$`)
    for (const file of existingFiles) {
      if (!file) continue
      const { data } = matter(file.content)
      const ref = typeof data.referenceCode === 'string' ? data.referenceCode : ''
      const match = ref.match(codePattern)
      if (match) {
        const num = parseInt(match[1], 10)
        if (Number.isFinite(num) && num > maxNumber) maxNumber = num
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const year = new Date(date).getFullYear()
  const referenceCode = `${code}-${year}-${String(maxNumber + 1).padStart(3, '0')}`
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
    await createOrUpdateFile(`content/articles/${slug}.md`, fileContent, `Add article: ${title}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug, referenceCode })
}
