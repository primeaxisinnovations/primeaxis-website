import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { createOrUpdateFile, getFile } from '@/lib/github'

export const dynamic = 'force-dynamic'
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  if (!verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body || typeof body.name !== 'string' || typeof body.slug !== 'string' || typeof body.role !== 'string' || typeof body.organisation !== 'string' || typeof body.bio !== 'string') return NextResponse.json({ error: 'Name, slug, role, organisation, and bio are required.' }, { status: 400 })
  const slug = body.slug.trim()
  if (!SLUG_PATTERN.test(slug)) return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens.' }, { status: 400 })
  if (await getFile(`content/profiles/${slug}.md`)) return NextResponse.json({ error: `A profile with the slug "${slug}" already exists.` }, { status: 409 })
  const expertise = Array.isArray(body.expertise) ? body.expertise.filter((item): item is string => typeof item === 'string') : []
  const status = body.status === 'published' ? 'published' : 'draft'
  const frontmatter = { name: body.name.trim(), role: body.role.trim(), organisation: body.organisation.trim(), photo: typeof body.photo === 'string' ? body.photo.trim() : '', expertise, linkedin: typeof body.linkedin === 'string' ? body.linkedin.trim() : '', status }
  await createOrUpdateFile(`content/profiles/${slug}.md`, matter.stringify(`${body.bio.trim()}\n`, frontmatter), `Add executive profile: ${body.name}`)
  revalidatePath('/'); revalidatePath('/about')
  return NextResponse.json({ success: true, slug })
}
