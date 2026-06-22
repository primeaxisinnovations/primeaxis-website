import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getFile } from '@/lib/github'
import ConversationForm, { type ConversationFormValues } from '@/components/admin/ConversationForm'

// Always hits GitHub live — never cached. The edit form must show the
// real, current state of the file, not a stale build-time copy.
export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export default async function EditConversationPage({ params }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { slug } = await params
  const file = await getFile(`content/conversations/${slug}.md`)
  if (!file) notFound()

  const { data } = matter(file.content)

  const initialValues: ConversationFormValues = {
    executiveName: String(data.executiveName ?? ''),
    title: String(data.title ?? ''),
    slug,
    position: String(data.position ?? ''),
    organisation: String(data.organisation ?? ''),
    photo: String(data.photo ?? ''),
    initials: String(data.initials ?? ''),
    excerpt: String(data.excerpt ?? ''),
    date: String(data.date ?? ''),
    qa: Array.isArray(data.qa) ? data.qa : [],
    // Fail closed, matching lib/conversation-content.ts — a conversation
    // with no recorded status is treated as a draft, never assumed published.
    status: data.status === 'published' ? 'published' : 'draft',
    transcriptRef: String(data.transcriptRef ?? ''),
    introduction: typeof data.introduction === 'string' ? data.introduction : '',
    pullQuote: typeof data.pullQuote === 'string' ? data.pullQuote : '',
    closingQuote: typeof data.closingQuote === 'string' ? data.closingQuote : '',
    editorsNote: typeof data.editorsNote === 'string' ? data.editorsNote : '',
  }

  return <ConversationForm mode="edit" initialValues={initialValues} />
}
