// SERVER-ONLY MODULE — reads events live from GitHub via lib/github.ts,
// the same source of truth the admin panel reads from and writes to. There
// is no local git checkout in this path, so there is no sync gap: an admin
// Publish/Unpublish/Delete/Save action is visible here on the very next
// request, on localhost or in production, with no rebuild or git pull.
//
// Trade-off this implies: every call below is a live GitHub API request,
// not a local file read. See the page components that call these functions
// for the `export const revalidate` / `dynamic` this requires, and the
// rate-limit/latency/availability notes recorded alongside it.

import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import type { Event, EventGalleryItem } from '@/types'

const EVENTS_DIR = 'content/events'

const CATEGORIES: ReadonlyArray<Event['category']> = ['conference', 'summit', 'press-briefing']

// Gallery items arrive as untyped YAML — coerce defensively so one malformed
// entry can't break a card or the lightbox. Anything without a usable url is
// dropped; an unknown type falls back to 'image' (the safe default to render).
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

function parseEvent(slug: string, raw: string): Event {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title,
    date: data.date,
    // Fall back to a valid category rather than trusting arbitrary input —
    // the filter bar and badges assume one of the three known values.
    category: (CATEGORIES as readonly string[]).includes(data.category) ? data.category : 'summit',
    coverImage: data.coverImage,
    description: data.description,
    gallery: parseGallery(data.gallery),
    // Fail closed: anything missing or malformed is treated as a draft,
    // never as published, so a bad frontmatter value can't accidentally
    // expose an unfinished event on the live site.
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

// One file's network error or malformed frontmatter must never take down
// the whole listing for every visitor — log it and drop that one event,
// the same way a missing file (getFile returning null) is already dropped.
async function fetchEvent(filename: string): Promise<Event | null> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`${EVENTS_DIR}/${filename}`)
    if (!file) return null
    return parseEvent(slug, file.content)
  } catch (error) {
    console.error(`getAllEvents: skipping "${slug}" — failed to fetch or parse`, error)
    return null
  }
}

// Public-facing pages only ever see published events — drafts are visible
// solely through the admin list, which reads lib/github.ts directly.
export async function getAllEvents(): Promise<Event[]> {
  const filenames = (await listFiles(EVENTS_DIR)).filter((name) => name.endsWith('.md'))
  // allSettled, not all — fetchEvent already catches its own errors and
  // never rejects, but this is the belt-and-suspenders guarantee that one
  // file can never take the rest of the batch down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchEvent))

  const events: Event[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null && result.value.status === 'published') {
      events.push(result.value)
    }
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Fetches the single file directly rather than scanning getAllEvents() — a
// detail view should cost one GitHub request, not one-per-event.
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const file = await getFile(`${EVENTS_DIR}/${slug}.md`)
  if (!file) return null
  const event = parseEvent(slug, file.content)
  return event.status === 'published' ? event : null
}
