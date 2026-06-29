import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile } from '@/lib/github'
import EventForm, { type EventFormValues } from '@/components/admin/EventForm'
import type { Event, EventGalleryItem } from '@/types'

// Always hits GitHub live — never cached. The edit form must show the
// real, current state of the file, not a stale build-time copy.
export const dynamic = 'force-dynamic'

const CATEGORIES: ReadonlyArray<Event['category']> = ['conference', 'summit', 'press-briefing']

// Mirror lib/events.ts's defensive gallery parsing — untyped YAML, coerced so
// one malformed entry can't crash the edit form.
function parseGallery(raw: unknown): EventGalleryItem[] {
  if (!Array.isArray(raw)) return []
  const items: EventGalleryItem[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const e = entry as Record<string, unknown>
    const url = typeof e.url === 'string' ? e.url.trim() : ''
    if (!url) continue
    items.push({
      url,
      type: e.type === 'video' ? 'video' : 'image',
      caption: typeof e.caption === 'string' && e.caption.trim().length > 0 ? e.caption.trim() : undefined,
    })
  }
  return items
}

type PageProps = { params: Promise<{ slug: string }> }

export default async function EditEventPage({ params }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { slug } = await params
  const file = await getFile(`content/events/${slug}.md`)
  if (!file) notFound()

  const { data } = matter(file.content)

  const category = String(data.category ?? '')
  const initialValues: EventFormValues = {
    title: String(data.title ?? ''),
    slug,
    date: String(data.date ?? ''),
    // Fall back to a valid category rather than trusting arbitrary input.
    category: (CATEGORIES as readonly string[]).includes(category) ? (category as Event['category']) : 'summit',
    // Fail closed, matching lib/events.ts — treated as a draft unless
    // explicitly published.
    status: data.status === 'published' ? 'published' : 'draft',
    description: String(data.description ?? ''),
    coverImage: String(data.coverImage ?? ''),
    gallery: parseGallery(data.gallery),
  }

  return <EventForm mode="edit" initialValues={initialValues} />
}
