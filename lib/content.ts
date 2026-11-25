// SERVER-ONLY MODULE — GitHub-backed reads used by the authenticated admin.
// Public pages use lib/public-content.ts and the Markdown bundled at build time.

import { cache } from 'react'
import { listFiles, getFile } from './github'
import { parseArticle } from './content-parsers'
import type { Article } from '@/types'

const ARTICLES_DIR = 'content/articles'

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

// Admin-facing dashboard reads only published articles; CMS management routes
// use lib/github.ts directly when they need drafts.
//
// Wrapped in React cache() so multiple server components in the same request
// (e.g. a page plus its self-fetching <BreakingBar />) share one GitHub call
// instead of each repeating the repository read.
export const getAllArticles = cache(async function getAllArticles(): Promise<Article[]> {
  let filenames: string[]
  try {
    filenames = (await listFiles(ARTICLES_DIR)).filter((name) => name.endsWith('.md'))
  } catch (error) {
    console.error('getAllArticles: failed to list article files', error)
    return []
  }
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
  try {
    const file = await getFile(`${ARTICLES_DIR}/${slug}.md`)
    if (!file) return undefined
    const article = parseArticle(slug, file.content)
    return article.status === 'published' ? article : undefined
  } catch (error) {
    console.error(`getArticleBySlug: failed to fetch "${slug}"`, error)
    return undefined
  }
}
