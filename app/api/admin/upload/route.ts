import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { put } from '@vercel/blob'
import sharp from 'sharp'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

// Always hits Vercel Blob live — never cached.
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

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

  const formData = await request.formData().catch((error: unknown) => {
    // Previously swallowed silently, which made a body/parse failure
    // indistinguishable from a genuinely absent file in the 400 below.
    console.error(
      '[upload] formData parse failed:',
      error instanceof Error ? error.message : String(error)
    )
    return null
  })
  const file = formData?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file was provided.' }, { status: 400 })
  }

  const extension = ALLOWED_TYPES[file.type]
  if (!extension) {
    return NextResponse.json(
      { error: 'Unsupported file type. Only JPEG, PNG, WebP images and MP4, WebM, OGG videos are allowed.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File is too large. The maximum file size is 50MB.' },
      { status: 400 }
    )
  }

  const uniqueId = `${Date.now()}-${randomUUID().slice(0, 8)}`
  const pathname = `uploads/${uniqueId}-${sanitizeFilenameBase(file.name)}.${extension}`

  try {
    // Images: compress + convert to WebP via sharp. Videos: upload as-is.
    if (IMAGE_TYPES.has(file.type)) {
      const buffer = Buffer.from(await file.arrayBuffer())

      const optimized = await sharp(buffer)
        .resize(1600, null, {
          withoutEnlargement: true, // never upscale small images
        })
        .webp({ quality: 82 })
        .toBuffer()

      const webpPathname = pathname.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp')

      // In Vercel's runtime sharp's output Buffer can be backed by a
      // SharedArrayBuffer, and @vercel/blob's put() sends it via fetch
      // (undici), which rejects SharedArrayBuffer-backed bodies with
      // "ArrayBuffer: SharedArrayBuffer is not allowed". new Uint8Array(...)
      // copies the bytes into a fresh, non-shared ArrayBuffer; Buffer.from
      // wraps that same buffer (no extra copy) so it satisfies put()'s type.
      const safeBody = Buffer.from(new Uint8Array(optimized).buffer)
      const blob = await put(webpPathname, safeBody, {
        access: 'public',
        contentType: 'image/webp',
      })
      return NextResponse.json({ url: blob.url })
    }

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
    })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // Surfaced to the admin UI below; logged here so it is also recoverable
    // from the function logs when the browser response is lost. Message only,
    // never the error object or any credential.
    console.error(`[upload] put failed for ${pathname}:`, message)
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
