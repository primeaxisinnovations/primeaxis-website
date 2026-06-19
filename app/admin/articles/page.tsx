import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile } from '@/lib/github'
import { formatDate } from '@/lib/utils'

// Always hits GitHub live — never cached. The admin must show the real,
// current state of the repo, even seconds after a save lands.
export const dynamic = 'force-dynamic'

interface ArticleListItem {
  slug: string
  title: string
  category: string
  date: string
  referenceCode: string
}

async function fetchArticleList(): Promise<ArticleListItem[]> {
  const filenames = (await listFiles('content/articles')).filter((name) => name.endsWith('.md'))

  const articles = await Promise.all(
    filenames.map(async (filename) => {
      const file = await getFile(`content/articles/${filename}`)
      if (!file) return null
      const { data } = matter(file.content)
      return {
        slug: filename.replace(/\.md$/, ''),
        title: String(data.title ?? ''),
        category: String(data.category ?? ''),
        date: String(data.date ?? ''),
        referenceCode: String(data.referenceCode ?? ''),
      }
    })
  )

  return articles
    .filter((a): a is ArticleListItem => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

type PageProps = { searchParams: Promise<{ saved?: string }> }

export default async function ArticlesAdminPage({ searchParams }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { saved } = await searchParams
  const articles = await fetchArticleList()

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">Articles</h1>
          </div>
          <Link
            href="/admin/articles/new"
            className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            + New Article
          </Link>
        </div>

        {saved && (
          <div className="mb-6 border border-gold/40 bg-gold/10 text-deep px-5 py-4 font-sans text-[13.5px]">
            Article saved. Your site is rebuilding now; this change will be live in a minute or two.
          </div>
        )}

        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Title</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Category</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Date</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Reference Code</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 text-right whitespace-nowrap">Edit</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center font-sans text-[14px] text-muted">
                    No articles yet.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.slug}
                    className="border-b border-border last:border-b-0 hover:bg-cream/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-sans text-[14px] text-ink max-w-[420px]">{article.title}</td>
                    <td className="px-5 py-4 font-sans text-[13px] text-muted whitespace-nowrap">{article.category}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">{formatDate(article.date)}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-gold whitespace-nowrap">{article.referenceCode}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/articles/${article.slug}/edit`}
                        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
