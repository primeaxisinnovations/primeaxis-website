import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { getAllConversations } from '@/lib/conversation-content'
import { getAllNews } from '@/lib/news'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

// Reads live from GitHub on every request (see lib/content.ts /
// lib/conversation-content.ts) — a newly published article must appear here
// immediately, not after the next deploy.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, conversations, news] = await Promise.all([
    getAllArticles(),
    getAllConversations(),
    getAllNews(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    // News files more often than any other section — hourly, and ranked
    // level with the hub rather than below it.
    { url: `${SITE_URL}/news`, changeFrequency: 'hourly', priority: 0.8 },
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

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.date,
    // A filed news item is a record of a moment — it doesn't get revised the
    // way an analysis piece does.
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...newsPages, ...articlePages, ...conversationPages]
}
