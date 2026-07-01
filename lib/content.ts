// SERVER-ONLY MODULE — reads articles live from GitHub via lib/github.ts,
// the same source of truth the admin panel reads from and writes to. There
// is no local git checkout in this path, so there is no sync gap: an admin
// Publish/Unpublish/Delete/Save action is visible here on the very next
// request, on localhost or in production, with no rebuild or git pull.
//
// Trade-off this implies: every call below is a live GitHub API request,
// not a local file read. See the page components that call these functions
// for the `export const dynamic = 'force-dynamic'` this requires, and the
// rate-limit/latency/availability notes recorded alongside it.

import { cache } from 'react'
import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import type { Article } from '@/types'

const ARTICLES_DIR = 'content/articles'

function parseArticle(slug: string, raw: string): Article {
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    author: data.author,
    date: data.date,
    readingTime: data.readingTime,
    featuredImage: data.featuredImage,
    referenceCode: data.referenceCode,
    tags: data.tags,
    body: content.trim(),
    // Fail closed: anything missing or malformed is treated as a draft,
    // never as published, so a bad frontmatter value can't accidentally
    // expose unfinished content on the live site.
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

// One file's network error or malformed frontmatter must never take down
// the whole listing for every visitor — log it and drop that one article,
// the same way a missing file (getFile returning null) is already dropped.
async function fetchArticle(filename: string): Promise<Article | null> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`${ARTICLES_DIR}/${filename}`)
    if (!file) return null
    return parseArticle(slug, file.content)
  } catch (error) {
    console.error(`getAllArticles: skipping "${slug}" — failed to fetch or parse`, error)
    return null
  }
}

// Public-facing pages only ever see published articles — drafts are visible
// solely through the admin list, which reads lib/github.ts directly.
//
// Wrapped in React cache() so multiple server components in the same request
// (e.g. a page plus its self-fetching <BreakingBar />) share one GitHub call
// instead of each hitting the API.
export const getAllArticles = cache(async function getAllArticles(): Promise<Article[]> {
  const filenames = (await listFiles(ARTICLES_DIR)).filter((name) => name.endsWith('.md'))
  // allSettled, not all — fetchArticle already catches its own errors and
  // never rejects, but this is the belt-and-suspenders guarantee that one
  // file can never take the rest of the batch down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchArticle))

  const articles: Article[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null && result.value.status === 'published') {
      articles.push(result.value)
    }
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Fetches the single file directly rather than scanning getAllArticles() —
// a detail page view should cost one GitHub request, not one-per-article.
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const file = await getFile(`${ARTICLES_DIR}/${slug}.md`)
  if (!file) return undefined
  const article = parseArticle(slug, file.content)
  return article.status === 'published' ? article : undefined
}
