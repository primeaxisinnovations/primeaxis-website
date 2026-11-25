// SERVER-ONLY MODULE — GitHub-backed reads used by the authenticated admin.
import { listFiles, getFile } from './github'
import { parseEvent } from './content-parsers'
import type { Event } from '@/types'

const EVENTS_DIR = 'content/events'

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

export async function getAllEvents(): Promise<Event[]> {
  const filenames = (await listFiles(EVENTS_DIR)).filter((name) => name.endsWith('.md'))
  const results = await Promise.allSettled(filenames.map(fetchEvent))
  const events: Event[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null && result.value.status === 'published') {
      events.push(result.value)
    }
  }
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const file = await getFile(`${EVENTS_DIR}/${slug}.md`)
  if (!file) return null
  const event = parseEvent(slug, file.content)
  return event.status === 'published' ? event : null
}
