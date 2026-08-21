import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import { NEWS_CATEGORY_LABEL, type NewsCategory } from '@/lib/news-categories'
import NewsRowActions from '@/components/admin/NewsRowActions'

// Always hits GitHub live — never cached. The admin must show the real,
// current state of the repo, even seconds after a save lands.
export const dynamic = 'force-dynamic'

interface NewsListItem {
  slug: string
  title: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body: string
  sourceLink: string
  status: 'draft' | 'published'
}

interface NewsListError {
  slug: string
  error: string
}

// Unlike the public lib/news.ts list, the admin must not silently drop a row
// on failure — a broken file needs to be visible as broken, not as a quietly
// shorter list. One bad file still must not crash the whole table.
async function fetchNewsRow(filename: string): Promise<NewsListItem | NewsListError> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`content/news/${filename}`)
    if (!file) return { slug, error: 'File not found on GitHub.' }
    const { data, content } = matter(file.content)
    return {
      slug,
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      category: String(data.category ?? ''),
      coverImage: String(data.coverImage ?? ''),
      excerpt: String(data.excerpt ?? ''),
      body: content.trim(),
      sourceLink: String(data.sourceLink ?? ''),
      // Fail closed, matching lib/news.ts — shown explicitly as Draft
      // rather than silently assumed Published.
      status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
    }
  } catch (error) {
    console.error(`Admin news list: failed to load "${slug}"`, error)
    return { slug, error: error instanceof Error ? error.message : 'Failed to load this file.' }
  }
}

function isNewsError(row: NewsListItem | NewsListError): row is NewsListError {
  return 'error' in row
}

async function fetchNewsList(): Promise<(NewsListItem | NewsListError)[]> {
  // content/news is newer than the rest of the CMS — on a branch that
  // predates it, listFiles throws rather than returning []. An empty table
  // with a "+ New" button is the correct state there, not a 500.
  let filenames: string[]
  try {
    filenames = (await listFiles('content/news')).filter((name) => name.endsWith('.md'))
  } catch (error) {
    console.error('Admin news list: could not list content/news — treating as empty', error)
    return []
  }

  // allSettled, not all — fetchNewsRow already catches its own errors and
  // never rejects, but this is the belt-and-suspenders guarantee that one
  // file can never take the rest of the table down even if that changes.
  const results = await Promise.allSettled(filenames.map(fetchNewsRow))

  const rows: (NewsListItem | NewsListError)[] = results.map((result, i) =>
    result.status === 'fulfilled'
      ? result.value
      : {
          slug: filenames[i].replace(/\.md$/, ''),
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        }
  )

  return rows.sort((a, b) => {
    if (isNewsError(a) || isNewsError(b)) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

function categoryLabel(category: string): string {
  return NEWS_CATEGORY_LABEL[category as NewsCategory] ?? category
}

type PageProps = { searchParams: Promise<{ saved?: string }> }

export default async function NewsAdminPage({ searchParams }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { saved } = await searchParams
  const news = await fetchNewsList()

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">News</h1>
          </div>
          <Link
            href="/admin/news/new"
            className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            + New News Item
          </Link>
        </div>

        {saved && (
          <div className="mb-6 border border-gold/40 bg-gold/10 text-deep px-5 py-4 font-sans text-[13.5px]">
            News item saved. Your site is rebuilding now; this change will be live in a minute or two.
          </div>
        )}

        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Title</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Status</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Category</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Date</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center font-sans text-[14px] text-muted">
                    No news items yet.
                  </td>
                </tr>
              ) : (
                news.map((item) =>
                  isNewsError(item) ? (
                    <tr key={item.slug} className="border-b border-border last:border-b-0 bg-red-50">
                      <td colSpan={5} className="px-5 py-4 font-sans text-[13px] text-red-700">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase mr-2">Failed to load</span>
                        {item.slug}.md — {item.error}
                      </td>
                    </tr>
                  ) : (
                  <tr
                    key={item.slug}
                    className="border-b border-border last:border-b-0 hover:bg-cream/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-sans text-[14px] text-ink max-w-[420px]">{item.title}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={
                          item.status === 'published'
                            ? 'font-mono text-[10px] tracking-[0.1em] uppercase text-teal'
                            : 'font-mono text-[10px] tracking-[0.1em] uppercase text-muted'
                        }
                      >
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-muted whitespace-nowrap">{categoryLabel(item.category)}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">{formatDate(item.date)}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <NewsRowActions
                        slug={item.slug}
                        title={item.title}
                        date={item.date}
                        category={item.category}
                        coverImage={item.coverImage}
                        excerpt={item.excerpt}
                        body={item.body}
                        sourceLink={item.sourceLink}
                        status={item.status}
                      />
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
