import matter from 'gray-matter'
import { parseArticleSection } from './article-sections'
import type { Article, Conversation, Event, EventGalleryItem, Job, Profile } from '@/types'

export function parseArticle(slug: string, raw: string): Article {
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    section: parseArticleSection(data.section),
    category: data.category,
    author: data.author,
    date: data.date,
    readingTime: data.readingTime,
    featuredImage: data.featuredImage,
    referenceCode: data.referenceCode,
    tags: data.tags,
    body: content.trim(),
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

export function parseConversation(slug: string, raw: string): Conversation {
  const { data } = matter(raw)
  return {
    slug,
    executiveName: data.executiveName,
    title: data.title,
    position: data.position,
    organisation: data.organisation,
    photo: data.photo,
    initials: data.initials,
    excerpt: data.excerpt,
    date: data.date,
    transcriptRef: data.transcriptRef,
    qa: Array.isArray(data.qa) ? data.qa : [],
    status: data.status === 'published' ? 'published' : 'draft',
    introduction: typeof data.introduction === 'string' ? data.introduction : undefined,
    pullQuote: typeof data.pullQuote === 'string' ? data.pullQuote : undefined,
    closingQuote: typeof data.closingQuote === 'string' ? data.closingQuote : undefined,
    editorsNote: typeof data.editorsNote === 'string' ? data.editorsNote : undefined,
  }
}

const EVENT_CATEGORIES: ReadonlyArray<Event['category']> = ['conference', 'summit', 'press-briefing']

function parseGallery(raw: unknown): EventGalleryItem[] {
  if (!Array.isArray(raw)) return []
  const items: EventGalleryItem[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const item = entry as Record<string, unknown>
    const url = typeof item.url === 'string' ? item.url.trim() : ''
    if (!url) continue
    items.push({
      url,
      type: item.type === 'video' ? 'video' : 'image',
      caption: typeof item.caption === 'string' && item.caption.trim() ? item.caption.trim() : undefined,
    })
  }
  return items
}

export function parseEvent(slug: string, raw: string): Event {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title,
    date: data.date,
    category: (EVENT_CATEGORIES as readonly string[]).includes(data.category) ? data.category : 'summit',
    coverImage: data.coverImage,
    description: data.description,
    gallery: parseGallery(data.gallery),
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

export function parseProfile(slug: string, raw: string): Profile {
  const { data } = matter(raw)
  return {
    slug,
    name: String(data.name ?? ''),
    role: String(data.role ?? ''),
    bio: String(data.bio ?? ''),
    photo: String(data.photo ?? ''),
    banner: String(data.banner ?? ''),
    email: typeof data.email === 'string' ? data.email : undefined,
    linkedin: typeof data.linkedin === 'string' ? data.linkedin : undefined,
    twitter: typeof data.twitter === 'string' ? data.twitter : undefined,
    website: typeof data.website === 'string' ? data.website : undefined,
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

export function getProfilePlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\\s+/g, ' ')
    .trim()
}

export function parseJob(slug: string, raw: string): Job {
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title ?? ''),
    location: String(data.location ?? ''),
    type: String(data.type ?? ''),
    department: String(data.department ?? ''),
    closingDate: String(data.closingDate ?? ''),
    summary: String(data.summary ?? ''),
    body: content.trim(),
    status: data.status === 'published' ? 'published' : 'draft',
  }
}
