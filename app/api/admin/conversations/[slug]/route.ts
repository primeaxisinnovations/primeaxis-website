import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile, createOrUpdateFile, deleteFile } from '@/lib/github'

// Always hits GitHub live — never cached.
export const dynamic = 'force-dynamic'

interface QAPair {
  question: string
  answer: string
}

interface UpdateConversationBody {
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

function validateBody(input: unknown): { value: UpdateConversationBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof UpdateConversationBody> = [
    'executiveName', 'title', 'position', 'organisation', 'photo', 'initials', 'excerpt', 'date',
  ]
  for (const field of requiredStrings) {
    if (typeof b[field] !== 'string' || (b[field] as string).trim().length === 0) {
      return { error: `"${field}" is required.` }
    }
  }

  const qaResult = validateQA(b.qa)
  if ('error' in qaResult) return { error: qaResult.error }

  if (b.status !== 'draft' && b.status !== 'published') {
    return { error: '"status" must be either "draft" or "published".' }
  }

  return {
    value: {
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

type RouteParams = { params: Promise<{ slug: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/conversations/${slug}.md`

  const json = await request.json().catch(() => null)
  const validated = validateBody(json)
  if ('error' in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }
  const {
    executiveName, title, position, organisation, photo, initials, excerpt, date, qa, status,
    introduction, pullQuote, closingQuote, editorsNote,
  } = validated.value

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No conversation found with slug "${slug}".` }, { status: 404 })
  }

  // Transcript ref always comes from the existing file, never from the
  // request — it must never change on an edit.
  const { data: existingData } = matter(existing.content)
  const transcriptRef = existingData.transcriptRef

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
    await createOrUpdateFile(path, fileContent, `Update conversation: ${executiveName}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug, transcriptRef })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/conversations/${slug}.md`

  let existing
  try {
    existing = await getFile(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: `No conversation found with slug "${slug}".` }, { status: 404 })
  }

  try {
    await deleteFile(path, existing.sha, `Delete conversation: ${slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
