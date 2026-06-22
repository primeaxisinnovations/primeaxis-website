// SERVER-ONLY MODULE — reads conversations live from GitHub via lib/github.ts,
// the same source of truth the admin panel reads from and writes to. There
// is no local git checkout in this path, so there is no sync gap: an admin
// Publish/Unpublish/Delete/Save action is visible here on the very next
// request, on localhost or in production, with no rebuild or git pull.
//
// Trade-off this implies: every call below is a live GitHub API request,
// not a local file read. See the page components that call these functions
// for the `export const dynamic = 'force-dynamic'` this requires, and the
// rate-limit/latency/availability notes recorded alongside it.

import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import type { Conversation } from '@/types'

const CONVERSATIONS_DIR = 'content/conversations'

function parseConversation(slug: string, raw: string): Conversation {
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
    // Fail closed: anything missing or malformed is treated as a draft,
    // never as published, so a bad frontmatter value can't accidentally
    // expose unfinished content on the live site.
    status: data.status === 'published' ? 'published' : 'draft',
    introduction: typeof data.introduction === 'string' ? data.introduction : undefined,
    pullQuote: typeof data.pullQuote === 'string' ? data.pullQuote : undefined,
    closingQuote: typeof data.closingQuote === 'string' ? data.closingQuote : undefined,
    editorsNote: typeof data.editorsNote === 'string' ? data.editorsNote : undefined,
  }
}

// One file's network error or malformed frontmatter must never take down
// the whole listing for every visitor — log it and drop that one
// conversation, the same way a missing file (getFile returning null) is
// already dropped.
async function fetchConversation(filename: string): Promise<Conversation | null> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`${CONVERSATIONS_DIR}/${filename}`)
    if (!file) return null
    return parseConversation(slug, file.content)
  } catch (error) {
    console.error(`getAllConversations: skipping "${slug}" — failed to fetch or parse`, error)
    return null
  }
}

// Public-facing pages only ever see published conversations — drafts are
// visible solely through the admin list, which reads lib/github.ts directly.
export async function getAllConversations(): Promise<Conversation[]> {
  const filenames = (await listFiles(CONVERSATIONS_DIR)).filter((name) => name.endsWith('.md'))
  // allSettled, not all — fetchConversation already catches its own errors
  // and never rejects, but this is the belt-and-suspenders guarantee that
  // one file can never take the rest of the batch down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchConversation))

  const conversations: Conversation[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null && result.value.status === 'published') {
      conversations.push(result.value)
    }
  }

  return conversations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Fetches the single file directly rather than scanning getAllConversations()
// — a detail page view should cost one GitHub request, not one-per-conversation.
export async function getConversationBySlug(slug: string): Promise<Conversation | undefined> {
  const file = await getFile(`${CONVERSATIONS_DIR}/${slug}.md`)
  if (!file) return undefined
  const conversation = parseConversation(slug, file.content)
  return conversation.status === 'published' ? conversation : undefined
}
