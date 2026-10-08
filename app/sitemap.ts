import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { getAllConversations } from '@/lib/conversation-content'
import { getAllEvents } from '@/lib/events'
import { getAllProfiles } from '@/lib/profile-content'
import { getAllJobs } from '@/lib/jobs'
import { CATEGORIES, categoryToSlug } from '@/lib/categories'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

// Reads live from GitHub on every request (see lib/content.ts /
// lib/conversation-content.ts) — a newly published article must appear here
// immediately, not after the next deploy.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, conversations, events, profiles, jobs] = await Promise.all([
    getAllArticles(),
    getAllConversations(),
    getAllEvents(),
    getAllProfiles(),
    getAllJobs(),
  ])

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

  const contentPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/jobs`, changeFrequency: 'weekly', priority: 0.6 },
    ...events.map((event) => ({ url: `${SITE_URL}/events/${event.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...profiles.map((profile) => ({ url: `${SITE_URL}/profiles/${profile.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...jobs.map((job) => ({ url: `${SITE_URL}/jobs/${job.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...CATEGORIES.map((category) => ({ url: `${SITE_URL}/categories/${categoryToSlug(category)}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
  ]

  return [...staticPages, ...articlePages, ...conversationPages, ...contentPages]
}
