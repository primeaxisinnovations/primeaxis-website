import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { getFile, getProductionBranch } from '@/lib/github'
import { saveContentToBranches } from '@/lib/content-branches'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const fields = ['name', 'role', 'bio', 'photo'] as const

function validate(input: unknown) {
  if (!input || typeof input !== 'object') return { error: 'Invalid request body.' }
  const body = input as Record<string, unknown>

  for (const field of fields) {
    if (typeof body[field] !== 'string' || !(body[field] as string).trim()) {
      return { error: `"${field}" is required.` }
    }
  }
  if (typeof body.slug !== 'string' || !validSlug.test(body.slug.trim())) {
    return { error: 'Slug must contain only lowercase letters, numbers, and hyphens.' }
  }
  if (body.status !== 'draft' && body.status !== 'published') {
    return { error: 'Invalid status.' }
  }

  return {
    value: {
      slug: body.slug.trim(),
      name: (body.name as string).trim(),
      role: (body.role as string).trim(),
      bio: (body.bio as string).trim(),
      photo: (body.photo as string).trim(),
      banner: typeof body.banner === 'string' ? body.banner.trim() : '',
      email: typeof body.email === 'string' ? body.email.trim() : '',
      linkedin: typeof body.linkedin === 'string' ? body.linkedin.trim() : '',
      twitter: typeof body.twitter === 'string' ? body.twitter.trim() : '',
      website: typeof body.website === 'string' ? body.website.trim() : '',
      status: body.status as 'draft' | 'published',
    },
  }
}

async function authorized() {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = validate(await request.json().catch(() => null))
  if ('error' in result) return NextResponse.json(result, { status: 400 })
  const { value } = result
  const path = `content/profiles/${value.slug}.md`

  try {
    if (await getFile(path)) {
      return NextResponse.json({ error: 'A profile with that slug already exists.' }, { status: 409 })
    }
    if (await getFile(path, getProductionBranch())) {
      return NextResponse.json(
        { error: 'A profile with that slug already exists in Production.' },
        { status: 409 }
      )
    }

    const result = await saveContentToBranches(
      path,
      matter.stringify('', value),
      `Add profile draft: ${value.name}`,
      `Publish profile: ${value.name}`,
      `Unpublish profile: ${value.name}`,
      value.status
    )
    revalidatePath('/about')
    revalidatePath(`/profiles/${value.slug}`)
    return NextResponse.json({ success: true, slug: value.slug, status: value.status, ...result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save profile.' },
      { status: 500 }
    )
  }
}

export { validate }
