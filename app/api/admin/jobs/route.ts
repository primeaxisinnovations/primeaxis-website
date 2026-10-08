import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { createOrUpdateFile, listFiles } from '@/lib/github'
import { buildJobFrontmatter } from '@/lib/jobs'

export const dynamic = 'force-dynamic'
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export async function POST(request: NextRequest) { const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value; if (!verifySessionToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const body = await request.json().catch(() => null); if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); const data = body as Record<string, unknown>; const slug = String(data.slug ?? ''); const title = String(data.title ?? ''); if (!SLUG_PATTERN.test(slug) || !title.trim()) return NextResponse.json({ error: 'A valid slug and title are required.' }, { status: 400 }); try { const files = await listFiles('content/jobs'); if (files.includes(`${slug}.md`)) return NextResponse.json({ error: 'A job with this slug already exists.' }, { status: 409 }); const job = { title, location: String(data.location ?? ''), type: String(data.type ?? ''), department: String(data.department ?? ''), closingDate: String(data.closingDate ?? ''), summary: String(data.summary ?? ''), status: data.status === 'published' ? 'published' as const : 'draft' as const }; await createOrUpdateFile(`content/jobs/${slug}.md`, matter.stringify(String(data.body ?? ''), buildJobFrontmatter(job)), `Add job: ${title}`); revalidatePath('/jobs'); return NextResponse.json({ success: true, slug }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save job.' }, { status: 500 }) } }
