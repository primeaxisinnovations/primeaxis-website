// SERVER-ONLY MODULE — reads news items live from GitHub via lib/github.ts,
// the same source of truth the admin panel reads from and writes to. There
// is no local git checkout in this path, so there is no sync gap: an admin
// Publish/Unpublish/Delete/Save action is visible here on the very next
// request, on localhost or in production, with no rebuild or git pull.
//
// Trade-off this implies: every call below is a live GitHub API request,
// not a local file read. See the page components that call these functions
// for the `export const revalidate` this requires, and the rate-limit/
// latency/availability notes recorded alongside it.
//
// Mirrors lib/content.ts (Articles) rather than lib/events.ts: a news item
// carries a full rich HTML body (embedded images, headings, multiple
// paragraphs) that renders on its detail page exactly as an article's does.

import { cache } from 'react'
import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import { NEWS_CATEGORIES, type NewsCategory } from './news-categories'

const NEWS_DIR = 'content/news'

export interface NewsItem {
  slug: string
  title: string
  date: string
  category: NewsCategory
  status: 'published' | 'draft'
  coverImage: string
  excerpt: string
  /** Full rich HTML, same shape as an Article body — rendered only on the
   *  detail page. The listing shows `excerpt`, never this. */
  body: string
  sourceLink?: string
}

function parseNews(slug: string, raw: string): NewsItem {
  const { data, content } = matter(raw)
  const sourceLink = typeof data.sourceLink === 'string' ? data.sourceLink.trim() : ''
  return {
    slug,
    title: data.title,
    date: data.date,
    // Fall back to a valid category rather than trusting arbitrary input —
    // the filter pills and badges assume one of the five known values.
    category: (NEWS_CATEGORIES as readonly string[]).includes(data.category)
      ? (data.category as NewsCategory)
      : 'policy',
    coverImage: data.coverImage,
    excerpt: data.excerpt,
    body: content.trim(),
    sourceLink: sourceLink.length > 0 ? sourceLink : undefined,
    // Fail closed: anything missing or malformed is treated as a draft,
    // never as published, so a bad frontmatter value can't accidentally
    // expose unfinished reporting on the live site.
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

// One file's network error or malformed frontmatter must never take down
// the whole listing for every visitor — log it and drop that one item,
// the same way a missing file (getFile returning null) is already dropped.
async function fetchNews(filename: string): Promise<NewsItem | null> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`${NEWS_DIR}/${filename}`)
    if (!file) return null
    return parseNews(slug, file.content)
  } catch (error) {
    console.error(`getAllNews: skipping "${slug}" — failed to fetch or parse`, error)
    return null
  }
}

// listFiles throws (not returns []) when the directory doesn't exist on the
// configured branch. content/news is newer than the rest of the CMS, so a
// branch that predates it must degrade to an empty News section rather than
// take down the homepage and the ticker that also call this.
async function listNewsFilenames(): Promise<string[]> {
  try {
    return (await listFiles(NEWS_DIR)).filter((name) => name.endsWith('.md'))
  } catch (error) {
    console.error('getAllNews: could not list content/news — treating as empty', error)
    return []
  }
}

// Public-facing pages only ever see published news — drafts are visible
// solely through the admin list, which reads lib/github.ts directly.
//
// Wrapped in React cache() so multiple server components in the same request
// (e.g. the homepage's Latest News section plus <BreakingBar />) share one
// GitHub call instead of each hitting the API.
export const getAllNews = cache(async function getAllNews(): Promise<NewsItem[]> {
  const filenames = await listNewsFilenames()
  // allSettled, not all — fetchNews already catches its own errors and never
  // rejects, but this is the belt-and-suspenders guarantee that one file can
  // never take the rest of the batch down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchNews))

  const news: NewsItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null && result.value.status === 'published') {
      news.push(result.value)
    }
  }

  return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Fetches the single file directly rather than scanning getAllNews() — a
// detail page view should cost one GitHub request, not one-per-item.
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const file = await getFile(`${NEWS_DIR}/${slug}.md`)
  if (!file) return null
  const item = parseNews(slug, file.content)
  return item.status === 'published' ? item : null
}
