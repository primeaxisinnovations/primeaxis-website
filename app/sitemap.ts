import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { getAllConversations } from '@/lib/conversation-content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

// Reads live from GitHub on every request (see lib/content.ts /
// lib/conversation-content.ts) — a newly published article must appear here
// immediately, not after the next deploy.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, conversations] = await Promise.all([getAllArticles(), getAllConversations()])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/intelligence-hub`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/executive-conversations`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/events`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/work-with-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/intelligence-hub/${article.slug}`,
    lastModified: article.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const conversationPages: MetadataRoute.Sitemap = conversations.map((conversation) => ({
    url: `${SITE_URL}/executive-conversations/${conversation.slug}`,
    lastModified: conversation.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...conversationPages]
}
