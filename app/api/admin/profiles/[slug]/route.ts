import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { getFile } from '@/lib/github'
import { deleteContentFromBranches, saveContentToBranches } from '@/lib/content-branches'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { validate } from '../route'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const store = await cookies()
  if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const result = validate({ ...(await request.json().catch(() => ({}))), slug })
  if ('error' in result) return NextResponse.json(result, { status: 400 })

  const path = `content/profiles/${slug}.md`
  try {
    if (!(await getFile(path))) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }
    const saved = await saveContentToBranches(
      path,
      matter.stringify('', result.value),
      `Save profile draft: ${result.value.name}`,
      `Publish profile update: ${result.value.name}`,
      `Unpublish profile: ${result.value.name}`,
      result.value.status
    )
    revalidatePath('/about')
    revalidatePath(`/profiles/${slug}`)
    return NextResponse.json({ success: true, slug, status: result.value.status, ...saved })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save profile.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const store = await cookies()
  if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const path = `content/profiles/${slug}.md`
  try {
    if (!(await getFile(path))) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }
    await deleteContentFromBranches(path, `Delete profile: ${slug}`)
    revalidatePath('/about')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete profile.' },
      { status: 500 }
    )
  }
}
