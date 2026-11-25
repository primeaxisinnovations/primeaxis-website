// SERVER-ONLY MODULE — searches the Markdown bundled with the deployment.

import { getPublicArticles, getPublicConversations } from './public-content'
import type { Article, Conversation } from '@/types'

export type SearchResult =
  | { type: 'article'; article: Article }
  | { type: 'conversation'; conversation: Conversation }

const RANK_EXACT_TITLE = 0
const RANK_OTHER_MATCH = 1

function includesQuery(haystack: string | undefined, query: string): boolean {
  return typeof haystack === 'string' && haystack.toLowerCase().includes(query)
}

// Returns the match rank (lower = more relevant), or null if it doesn't
// match at all.
function rankArticle(article: Article, query: string): number | null {
  if (article.title.toLowerCase() === query) return RANK_EXACT_TITLE
  const fields = [article.title, article.excerpt, article.category, ...(article.tags ?? [])]
  return fields.some((field) => includesQuery(field, query)) ? RANK_OTHER_MATCH : null
}

function rankConversation(conversation: Conversation, query: string): number | null {
  if (conversation.title.toLowerCase() === query) return RANK_EXACT_TITLE
  const fields = [
    conversation.executiveName,
    conversation.title,
    conversation.position,
    conversation.organisation,
    conversation.excerpt,
  ]
  return fields.some((field) => includesQuery(field, query)) ? RANK_OTHER_MATCH : null
}

// Public readers expose published content only.
export async function searchContent(query: string): Promise<SearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return []

  const [articles, conversations] = await Promise.all([getPublicArticles(), getPublicConversations()])

  const matches: { result: SearchResult; rank: number; date: string }[] = []

  for (const article of articles) {
    const rank = rankArticle(article, normalizedQuery)
    if (rank !== null) matches.push({ result: { type: 'article', article }, rank, date: article.date })
  }

  for (const conversation of conversations) {
    const rank = rankConversation(conversation, normalizedQuery)
    if (rank !== null) {
      matches.push({ result: { type: 'conversation', conversation }, rank, date: conversation.date })
    }
  }

  // Exact title matches first (rank 0 before rank 1); within the same rank,
  // most recent first — consistent with every other listing in this app.
  return matches
    .sort((a, b) => a.rank - b.rank || new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((match) => match.result)
}
