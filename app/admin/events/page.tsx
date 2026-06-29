import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import EventRowActions from '@/components/admin/EventRowActions'

// Always hits GitHub live — never cached. The admin must show the real,
// current state of the repo, even seconds after a save lands.
export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<string, string> = {
  conference: 'Conference',
  summit: 'Summit',
  'press-briefing': 'Press Briefing',
}

interface EventListItem {
  slug: string
  title: string
  category: string
  date: string
  status: 'draft' | 'published'
}

interface EventListError {
  slug: string
  error: string
}

// Unlike the public lib/events.ts list, the admin must not silently drop a
// row on failure — the editor needs to see that a specific file is broken,
// not a quietly shorter list. One bad file still must not crash the table.
async function fetchEventRow(filename: string): Promise<EventListItem | EventListError> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`content/events/${filename}`)
    if (!file) return { slug, error: 'File not found on GitHub.' }
    const { data } = matter(file.content)
    return {
      slug,
      title: String(data.title ?? ''),
      category: String(data.category ?? ''),
      date: String(data.date ?? ''),
      // Fail closed, matching lib/events.ts — shown explicitly as Draft
      // rather than silently assumed Published.
      status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
    }
  } catch (error) {
    console.error(`Admin events list: failed to load "${slug}"`, error)
    return { slug, error: error instanceof Error ? error.message : 'Failed to load this file.' }
  }
}

function isEventError(row: EventListItem | EventListError): row is EventListError {
  return 'error' in row
}

async function fetchEventList(): Promise<(EventListItem | EventListError)[]> {
  const filenames = (await listFiles('content/events')).filter((name) => name.endsWith('.md'))
  // allSettled, not all — fetchEventRow already catches its own errors and
  // never rejects, but this is the belt-and-suspenders guarantee that one
  // file can never take the rest of the table down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchEventRow))

  const rows: (EventListItem | EventListError)[] = results.map((result, i) =>
    result.status === 'fulfilled'
      ? result.value
      : {
          slug: filenames[i].replace(/\.md$/, ''),
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        }
  )

  return rows.sort((a, b) => {
    if (isEventError(a) || isEventError(b)) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

type PageProps = { searchParams: Promise<{ saved?: string }> }

export default async function EventsAdminPage({ searchParams }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { saved } = await searchParams
  const events = await fetchEventList()

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">Events</h1>
          </div>
          <Link
            href="/admin/events/new"
            className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            + New Event
          </Link>
        </div>

        {saved && (
          <div className="mb-6 border border-gold/40 bg-gold/10 text-deep px-5 py-4 font-sans text-[13.5px]">
            Event saved. Your site is rebuilding now; this change will be live in a minute or two.
          </div>
        )}

        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Title</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Category</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Date</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Status</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center font-sans text-[14px] text-muted">
                    No events yet.
                  </td>
                </tr>
              ) : (
                events.map((event) =>
                  isEventError(event) ? (
                    <tr key={event.slug} className="border-b border-border last:border-b-0 bg-red-50">
                      <td colSpan={5} className="px-5 py-4 font-sans text-[13px] text-red-700">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase mr-2">Failed to load</span>
                        {event.slug}.md — {event.error}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={event.slug}
                      className="border-b border-border last:border-b-0 hover:bg-cream/60 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-sans text-[14px] text-ink max-w-[420px]">{event.title}</td>
                      <td className="px-5 py-4 font-sans text-[13px] text-muted whitespace-nowrap">
                        {CATEGORY_LABEL[event.category] ?? event.category}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">{formatDate(event.date)}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={
                            event.status === 'published'
                              ? 'font-mono text-[10px] tracking-[0.1em] uppercase text-teal'
                              : 'font-mono text-[10px] tracking-[0.1em] uppercase text-muted'
                          }
                        >
                          {event.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <EventRowActions slug={event.slug} title={event.title} />
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
