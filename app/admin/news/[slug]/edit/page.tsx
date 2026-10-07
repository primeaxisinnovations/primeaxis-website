import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile } from '@/lib/github'
import NewsForm, { type NewsFormValues } from '@/components/admin/NewsForm'

// Always hits GitHub live — never cached. The edit form must show the
// real, current state of the file, not a stale build-time copy.
export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export default async function EditNewsPage({ params }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { slug } = await params
  const file = await getFile(`content/news/${slug}.md`)
  if (!file) notFound()

  const { data, content } = matter(file.content)

  const initialValues: NewsFormValues = {
    title: String(data.title ?? ''),
    slug,
    date: String(data.date ?? ''),
    category: String(data.category ?? ''),
    coverImage: String(data.coverImage ?? ''),
    excerpt: String(data.excerpt ?? ''),
    body: content.trim(),
    sourceLink: String(data.sourceLink ?? ''),
    // Fail closed, matching lib/news.ts — an item with no recorded status
    // is treated as a draft, never assumed published.
    status: data.status === 'published' ? 'published' : 'draft',
  }

  return <NewsForm mode="edit" initialValues={initialValues} />
}
