import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import ArticleForm from '@/components/admin/ArticleForm'
import { isArticleSection } from '@/lib/article-sections'

// No caching — this page only renders a form, but every admin route stays
// dynamic on principle so nothing under /admin is ever served stale.
export const dynamic = 'force-dynamic'

type PageProps = { searchParams: Promise<{ section?: string }> }

export default async function NewArticlePage({ searchParams }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { section } = await searchParams
  return (
    <ArticleForm
      mode="create"
      initialSection={isArticleSection(section) ? section : undefined}
    />
  )
}
