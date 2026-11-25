// SERVER-ONLY MODULE — GitHub-backed reads used by the authenticated admin.
// Public pages use lib/public-content.ts and the Markdown bundled at build time.

import { listFiles, getFile } from './github'
import { parseConversation } from './content-parsers'
import type { Conversation } from '@/types'

const CONVERSATIONS_DIR = 'content/conversations'

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

// Admin-facing dashboard reads only published conversations; CMS management
// routes use lib/github.ts directly when they need drafts.
export async function getAllConversations(): Promise<Conversation[]> {
  let filenames: string[]
  try {
    filenames = (await listFiles(CONVERSATIONS_DIR)).filter((name) => name.endsWith('.md'))
  } catch (error) {
    console.error('getAllConversations: failed to list conversation files', error)
    return []
  }
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
  try {
    const file = await getFile(`${CONVERSATIONS_DIR}/${slug}.md`)
    if (!file) return undefined
    const conversation = parseConversation(slug, file.content)
    return conversation.status === 'published' ? conversation : undefined
  } catch (error) {
    console.error(`getConversationBySlug: failed to fetch "${slug}"`, error)
    return undefined
  }
}
