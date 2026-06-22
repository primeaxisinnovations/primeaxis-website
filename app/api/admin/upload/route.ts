import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { put } from '@vercel/blob'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

// Always hits Vercel Blob live — never cached.
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Strips the extension, lowercases, replaces anything that isn't
// alphanumeric/hyphen with a hyphen, and collapses/trims the result — so
// "My Photo (Final)!.JPG" becomes a safe blob pathname segment.
function sanitizeFilenameBase(filename: string): string {
  const withoutExtension = filename.replace(/\.[^./]+$/, '')
  const sanitized = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return sanitized || 'image'
}

export async function POST(request: NextRequest) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No image file was provided.' }, { status: 400 })
  }

  const extension = ALLOWED_TYPES[file.type]
  if (!extension) {
    return NextResponse.json(
      { error: 'Unsupported file type. Only JPEG, PNG, and WebP images are allowed.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Image is too large. The maximum file size is 5MB.' },
      { status: 400 }
    )
  }

  const uniqueId = `${Date.now()}-${randomUUID().slice(0, 8)}`
  const pathname = `uploads/${uniqueId}-${sanitizeFilenameBase(file.name)}.${extension}`

  try {
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
    })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
