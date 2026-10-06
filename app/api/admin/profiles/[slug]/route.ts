import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { getFile, createOrUpdateFile, deleteFile } from '@/lib/github'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { validate } from '../route'
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) { const store = await cookies(); if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const { slug } = await params; const result = validate({ ...(await request.json().catch(() => ({}))), slug }); if ('error' in result) return NextResponse.json(result, { status: 400 }); const file = await getFile(`content/profiles/${slug}.md`); if (!file) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 }); await createOrUpdateFile(`content/profiles/${slug}.md`, matter.stringify('', result.value), `Update profile: ${result.value.name}`); revalidatePath('/about'); return NextResponse.json({ success: true, slug }) }
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) { const store = await cookies(); if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });   const { slug } = await params; const path = `content/profiles/${slug}.md`; const existing = await getFile(path); if (!existing) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 }); await deleteFile(path, existing.sha, `Delete profile: ${slug}`); revalidatePath('/about'); return NextResponse.json({ success: true }) }
