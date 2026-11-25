import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import type { Article, Conversation, Event, Job, Profile } from '@/types'
import {
  getProfilePlainText,
  parseArticle,
  parseConversation,
  parseEvent,
  parseJob,
  parseProfile,
} from './content-parsers'

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const OPTIONAL_COLLECTIONS = new Set(['jobs'])

function readMarkdownCollection<T>(
  collection: string,
  parse: (slug: string, raw: string) => T,
): T[] {
  const directory = path.join(CONTENT_ROOT, collection)
  let filenames: string[]
  try {
    filenames = readdirSync(directory).filter((filename) => filename.endsWith('.md'))
  } catch (error) {
    if (
      OPTIONAL_COLLECTIONS.has(collection) &&
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return []
    }
    throw error
  }

  return filenames.map((filename) => {
    const slug = filename.slice(0, -3)
    const filePath = path.join(directory, filename)
    try {
      return parse(slug, readFileSync(filePath, 'utf8'))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to read public content file "${filePath}": ${message}`)
    }
  })
}

function readMarkdownFile<T>(
  collection: string,
  slug: string,
  parse: (slug: string, raw: string) => T,
): T | undefined {
  if (!slug || slug === '.' || slug === '..' || slug.includes('/') || slug.includes('\\')) return undefined

  const filePath = path.join(CONTENT_ROOT, collection, `${slug}.md`)
  try {
    return parse(slug, readFileSync(filePath, 'utf8'))
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return undefined
    }
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to read public content file "${filePath}": ${message}`)
  }
}

export const getPublicArticles = cache(async function getPublicArticles(): Promise<Article[]> {
  return readMarkdownCollection('articles', parseArticle)
    .filter((article) => article.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export async function getPublicArticleBySlug(slug: string): Promise<Article | undefined> {
  const article = readMarkdownFile('articles', slug, parseArticle)
  return article?.status === 'published' ? article : undefined
}

export const getPublicConversations = cache(async function getPublicConversations(): Promise<Conversation[]> {
  return readMarkdownCollection('conversations', parseConversation)
    .filter((conversation) => conversation.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export async function getPublicConversationBySlug(slug: string): Promise<Conversation | undefined> {
  const conversation = readMarkdownFile('conversations', slug, parseConversation)
  return conversation?.status === 'published' ? conversation : undefined
}

export const getPublicEvents = cache(async function getPublicEvents(): Promise<Event[]> {
  return readMarkdownCollection('events', parseEvent)
    .filter((event) => event.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export async function getPublicEventBySlug(slug: string): Promise<Event | null> {
  const event = readMarkdownFile('events', slug, parseEvent)
  return event?.status === 'published' ? event : null
}

export const getPublicProfiles = cache(async function getPublicProfiles(): Promise<Profile[]> {
  return readMarkdownCollection('profiles', parseProfile)
    .filter((profile) => profile.status === 'published')
})

export async function getPublicProfileBySlug(slug: string): Promise<Profile | undefined> {
  const profile = readMarkdownFile('profiles', slug, parseProfile)
  return profile?.status === 'published' ? profile : undefined
}

export const getPublicJobs = cache(async function getPublicJobs(): Promise<Job[]> {
  return readMarkdownCollection('jobs', parseJob)
    .filter((job) => job.status === 'published')
    .sort((a, b) => a.title.localeCompare(b.title))
})

export async function getPublicJobBySlug(slug: string): Promise<Job | undefined> {
  const job = readMarkdownFile('jobs', slug, parseJob)
  return job?.status === 'published' ? job : undefined
}

export { getProfilePlainText }
