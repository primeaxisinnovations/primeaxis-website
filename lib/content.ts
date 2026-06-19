// SERVER-ONLY MODULE — uses Node's fs/path; never import this into any
// client component. Reads the real article markdown files committed to
// content/articles/ (see lib/github.ts for how they get there).

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Article } from '@/types'

// Always resolved from the project root, not a relative path — relative
// paths are unreliable in Vercel's build environment.
const ARTICLES_DIRECTORY = path.join(process.cwd(), 'content/articles')

function readArticle(filename: string): Article {
  const filePath = path.join(ARTICLES_DIRECTORY, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const slug = filename.replace(/\.md$/, '')

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
  }
}

export function getAllArticles(): Article[] {
  const filenames = fs.readdirSync(ARTICLES_DIRECTORY).filter((name) => name.endsWith('.md'))
  return filenames
    .map(readArticle)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug)
}
