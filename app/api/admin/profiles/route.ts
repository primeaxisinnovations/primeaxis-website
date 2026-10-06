import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { listFiles, createOrUpdateFile } from '@/lib/github'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
export const dynamic = 'force-dynamic'
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const fields = ['name', 'role', 'bio', 'photo'] as const
function validate(input: unknown) { if (!input || typeof input !== 'object') return { error: 'Invalid request body.' }; const b = input as Record<string, unknown>; for (const field of fields) if (typeof b[field] !== 'string' || !(b[field] as string).trim()) return { error: `"${field}" is required.` }; if (typeof b.slug !== 'string' || !validSlug.test(b.slug.trim())) return { error: 'Slug must contain only lowercase letters, numbers, and hyphens.' }; if (b.status !== 'draft' && b.status !== 'published') return { error: 'Invalid status.' }; return { value: { slug: b.slug.trim(), name: (b.name as string).trim(), role: (b.role as string).trim(), bio: (b.bio as string).trim(), photo: (b.photo as string).trim(), email: typeof b.email === 'string' ? b.email.trim() : '', linkedin: typeof b.linkedin === 'string' ? b.linkedin.trim() : '', twitter: typeof b.twitter === 'string' ? b.twitter.trim() : '', website: typeof b.website === 'string' ? b.website.trim() : '', status: b.status as 'draft' | 'published' } } }
async function authorized() { const store = await cookies(); return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value) }
export async function POST(request: NextRequest) { if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const result = validate(await request.json().catch(() => null)); if ('error' in result) return NextResponse.json(result, { status: 400 }); const { value } = result; if ((await listFiles('content/profiles')).includes(`${value.slug}.md`)) return NextResponse.json({ error: 'A profile with that slug already exists.' }, { status: 409 }); const content = matter.stringify('', value); await createOrUpdateFile(`content/profiles/${value.slug}.md`, content, `Add profile: ${value.name}`); revalidatePath('/about'); return NextResponse.json({ success: true, slug: value.slug }) }
export { validate }
