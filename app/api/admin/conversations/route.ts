import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile, createOrUpdateFile } from '@/lib/github'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TRANSCRIPT_REF_PATTERN = /^EC-\d{4}-(\d+)$/

interface QAPair {
  question: string
  answer: string
}

interface CreateConversationBody {
  slug: string
  executiveName: string
  title: string
  position: string
  organisation: string
  photo: string
  initials: string
  excerpt: string
  date: string
  qa: QAPair[]
  status: 'draft' | 'published'
  introduction?: string
  pullQuote?: string
  closingQuote?: string
  editorsNote?: string
}

// All four are optional rich/plain text fields — trims to undefined when
// blank so empty values never get written into frontmatter.
function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

function validateQA(input: unknown): { value: QAPair[] } | { error: string } {
  if (!Array.isArray(input) || input.length === 0) {
    return { error: 'At least one question/answer pair is required.' }
  }
  const qa: QAPair[] = []
  for (const item of input) {
    if (
      typeof item !== 'object' || item === null ||
      typeof (item as Record<string, unknown>).question !== 'string' ||
      typeof (item as Record<string, unknown>).answer !== 'string' ||
      (item as Record<string, unknown>).question === '' ||
      (item as Record<string, unknown>).answer === ''
    ) {
      return { error: 'Every Q&A pair needs both a question and an answer.' }
    }
    qa.push({
      question: (item as Record<string, string>).question.trim(),
      answer: (item as Record<string, string>).answer.trim(),
    })
  }
  return { value: qa }
}

function validateBody(input: unknown): { value: CreateConversationBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof CreateConversationBody> = [
    'slug', 'executiveName', 'title', 'position', 'organisation', 'photo', 'initials', 'excerpt', 'date',
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

  const qaResult = validateQA(b.qa)
  if ('error' in qaResult) return { error: qaResult.error }

  if (b.status !== 'draft' && b.status !== 'published') {
    return { error: '"status" must be either "draft" or "published".' }
  }

  return {
    value: {
      slug,
      executiveName: (b.executiveName as string).trim(),
      title: (b.title as string).trim(),
      position: (b.position as string).trim(),
      organisation: (b.organisation as string).trim(),
      photo: (b.photo as string).trim(),
      initials: (b.initials as string).trim(),
      excerpt: (b.excerpt as string).trim(),
      date: (b.date as string).trim(),
      qa: qaResult.value,
      status: b.status,
      introduction: optionalString(b.introduction),
      pullQuote: optionalString(b.pullQuote),
      closingQuote: optionalString(b.closingQuote),
      editorsNote: optionalString(b.editorsNote),
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
  const {
    slug, executiveName, title, position, organisation, photo, initials, excerpt, date, qa, status,
    introduction, pullQuote, closingQuote, editorsNote,
  } = validated.value

  let filenames: string[]
  try {
    filenames = (await listFiles('content/conversations')).filter((name) => name.endsWith('.md'))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Reject rather than silently overwrite an existing conversation.
  if (filenames.includes(`${slug}.md`)) {
    return NextResponse.json(
      { error: `A conversation with the slug "${slug}" already exists. Choose a different slug.` },
      { status: 409 }
    )
  }

  // Transcript ref = EC + year + (highest existing number across all years +
  // 1). Using the max rather than a count avoids collisions if a
  // conversation was ever deleted.
  let maxNumber = 0
  try {
    const existingFiles = await Promise.all(filenames.map((name) => getFile(`content/conversations/${name}`)))
    for (const file of existingFiles) {
      if (!file) continue
      const { data } = matter(file.content)
      const ref = typeof data.transcriptRef === 'string' ? data.transcriptRef : ''
      const match = ref.match(TRANSCRIPT_REF_PATTERN)
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
  const transcriptRef = `EC-${year}-${String(maxNumber + 1).padStart(3, '0')}`

  // qa is repeating structured data, not free-flowing prose, so it lives in
  // frontmatter (not the markdown body) — slugify ensures the auto-generated
  // slug above never needs a fallback here.
  const frontmatter = {
    executiveName,
    title,
    position,
    organisation,
    photo,
    initials,
    excerpt,
    date,
    transcriptRef,
    qa,
    status,
    ...(introduction ? { introduction } : {}),
    ...(pullQuote ? { pullQuote } : {}),
    ...(closingQuote ? { closingQuote } : {}),
    ...(editorsNote ? { editorsNote } : {}),
  }
  const fileContent = matter.stringify('', frontmatter)

  try {
    await createOrUpdateFile(`content/conversations/${slug}.md`, fileContent, `Add conversation: ${executiveName}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug, transcriptRef })
}
