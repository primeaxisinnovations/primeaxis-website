// Shared validation + frontmatter shaping for the Events admin API routes.
// Pure (no GitHub/network access) so both the create (POST) and update (PUT)
// routes can reuse exactly one definition of what a valid event payload is.

import type { Event, EventGalleryItem } from '@/types'

export const EVENT_CATEGORIES: ReadonlyArray<Event['category']> = ['conference', 'summit', 'press-briefing']

export interface EventBody {
  slug?: string
  title: string
  date: string
  category: Event['category']
  status: Event['status']
  coverImage: string
  description: string
  gallery: EventGalleryItem[]
}

function validateGallery(raw: unknown): { value: EventGalleryItem[] } | { error: string } {
  if (raw === undefined || raw === null) return { value: [] }
  if (!Array.isArray(raw)) return { error: 'Gallery must be a list of items.' }

  const items: EventGalleryItem[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) {
      return { error: 'Each gallery item must be an object with a url.' }
    }
    const e = entry as Record<string, unknown>
    const url = typeof e.url === 'string' ? e.url.trim() : ''
    if (!url) return { error: 'Every gallery item needs an image or video URL.' }
    const type = e.type === 'video' ? 'video' : 'image'
    const caption =
      typeof e.caption === 'string' && e.caption.trim().length > 0 ? e.caption.trim() : undefined
    items.push({ url, type, caption })
  }
  return { value: items }
}

export function validateEventBody(
  input: unknown,
  opts: { requireSlug?: boolean } = {}
): { value: EventBody } | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' }
  }
  const b = input as Record<string, unknown>

  const requiredStrings: Array<keyof EventBody> = ['title', 'date', 'coverImage', 'description']
  for (const field of requiredStrings) {
    if (typeof b[field] !== 'string' || (b[field] as string).trim().length === 0) {
      return { error: `"${field}" is required.` }
    }
  }

  const category = b.category
  if (typeof category !== 'string' || !(EVENT_CATEGORIES as readonly string[]).includes(category)) {
    return { error: 'Category must be one of: conference, summit, press-briefing.' }
  }

  if (b.status !== 'draft' && b.status !== 'published') {
    return { error: '"status" must be either "draft" or "published".' }
  }

  const gallery = validateGallery(b.gallery)
  if ('error' in gallery) return { error: gallery.error }

  const slug = typeof b.slug === 'string' ? b.slug.trim() : ''
  if (opts.requireSlug && !slug) {
    return { error: '"slug" is required.' }
  }

  return {
    value: {
      slug: slug || undefined,
      title: (b.title as string).trim(),
      date: (b.date as string).trim(),
      category: category as Event['category'],
      status: b.status,
      coverImage: (b.coverImage as string).trim(),
      description: (b.description as string).trim(),
      gallery: gallery.value,
    },
  }
}

// Shapes the validated body into the exact frontmatter the public content
// layer (lib/events.ts) reads back — gallery captions are omitted when empty
// so the YAML stays clean.
export function buildEventFrontmatter(body: EventBody) {
  return {
    title: body.title,
    date: body.date,
    category: body.category,
    status: body.status,
    coverImage: body.coverImage,
    description: body.description,
    gallery: body.gallery.map((item) =>
      item.caption ? { url: item.url, type: item.type, caption: item.caption } : { url: item.url, type: item.type }
    ),
  }
}
