import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getAllArticles } from '@/lib/content'
import { getAllConversations } from '@/lib/conversation-content'
import { getAllProfiles } from '@/lib/profile-content'
import { getAllEvents } from '@/lib/events'
import { getAllJobs } from '@/lib/jobs'
import { getAllViewCounts } from '@/lib/view-counts'
import { CATEGORIES, categoryToSlug } from '@/lib/categories'

export const dynamic = 'force-dynamic'

interface AdminSection {
  label: string
  description: string
  href: string
}

const ADMIN_SECTIONS: AdminSection[] = [
  { label: 'Articles', description: 'Maritime intelligence and strategic commentary.', href: '/admin/articles' },
  { label: 'Conversations', description: 'Executive interviews and leadership perspectives.', href: '/admin/conversations' },
  { label: 'Profiles', description: 'People profiles with social links and biographies.', href: '/admin/profiles' },
  { label: 'Events', description: 'Conferences, summits, and press briefings.', href: '/admin/events' },
  { label: 'Jobs', description: 'Career opportunities across the maritime sector.', href: '/admin/jobs' },
  { label: 'Newsletter', description: 'View and manage newsletter subscribers.', href: '/admin/newsletter' },
]

const STAT_CONFIG = [
  { key: 'articles', label: 'Published articles', href: '/admin/articles' },
  { key: 'conversations', label: 'Executive conversations', href: '/admin/conversations' },
  { key: 'profiles', label: 'People profiles', href: '/admin/profiles' },
  { key: 'events', label: 'Upcoming events', href: '/admin/events' },
  { key: 'jobs', label: 'Open opportunities', href: '/admin/jobs' },
] as const

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) redirect('/admin/login')

  const results = await Promise.allSettled([
    getAllArticles(),
    getAllConversations(),
    getAllProfiles(),
    getAllEvents(),
    getAllJobs(),
    getAllViewCounts('article'),
    getAllViewCounts('conversation'),
    getAllViewCounts('profile'),
  ])
  const value = <T,>(index: number, fallback: T): T => results[index]?.status === 'fulfilled' ? results[index].value as T : fallback
  const counts = {
    articles: value(0, []).length,
    conversations: value(1, []).length,
    profiles: value(2, []).length,
    events: value(3, []).length,
    jobs: value(4, []).length,
  }
  const totalViews = [5, 6, 7].reduce((total, index) => total + Object.values(value(index, {} as Record<string, number>)).reduce((sum, count) => sum + count, 0), 0)

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">PrimeAxis Admin</p>
            <h1 className="font-display text-[30px] font-semibold text-deep">Dashboard</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-muted">A live view of your editorial platform and publishing workspace.</p>
          </div>
          <form action="/api/admin-logout" method="POST">
            <button type="submit" className="border border-gold px-6 py-3 font-sans text-[13px] font-semibold tracking-[.04em] text-gold transition-all duration-200 hover:bg-gold hover:text-deep">Log Out</button>
          </form>
        </header>

        <section aria-labelledby="overview-heading" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="overview-heading" className="font-display text-xl font-semibold text-deep">Content overview</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Published content</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {STAT_CONFIG.map((stat) => (
              <Link key={stat.key} href={stat.href} className="border border-border bg-white p-4 transition-colors hover:border-gold">
                <p className="font-mono text-3xl text-deep">{counts[stat.key]}</p>
                <p className="mt-2 font-sans text-xs leading-relaxed text-muted">{stat.label}</p>
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border border-border bg-deep px-5 py-4 text-white">
            <span className="font-sans text-sm">Total article, conversation, and profile views</span>
            <span className="font-mono text-xl text-gold">{totalViews.toLocaleString()}</span>
          </div>
        </section>

        <section aria-labelledby="manage-heading" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="manage-heading" className="font-display text-xl font-semibold text-deep">Manage content</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">CMS workspace</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_SECTIONS.map((section) => (
              <Link key={section.href} href={section.href} className="group flex min-h-[128px] flex-col justify-between border border-border bg-white p-5 transition-colors duration-200 hover:border-gold">
                <span className="font-display text-lg font-semibold text-deep transition-colors group-hover:text-gold">{section.label}</span>
                <span className="font-sans text-[13px] leading-relaxed text-muted">{section.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="categories-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="categories-heading" className="font-display text-xl font-semibold text-deep">Editorial categories</h2>
            <Link href="/insights" className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold hover:text-deep">View insights</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => <Link key={category} href={`/categories/${categoryToSlug(category)}`} className="border border-border bg-white px-3 py-2 font-sans text-xs text-muted transition-colors hover:border-gold hover:text-deep">{category}</Link>)}
          </div>
        </section>
      </div>
    </main>
  )
}

export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'iad1'
export const maxDuration = 60
