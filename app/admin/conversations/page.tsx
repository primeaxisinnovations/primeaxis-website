import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { listFiles, getFile } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import ConversationRowActions from '@/components/admin/ConversationRowActions'

// Always hits GitHub live — never cached. The admin must show the real,
// current state of the repo, even seconds after a save lands.
export const dynamic = 'force-dynamic'

interface QAPair {
  question: string
  answer: string
}

interface ConversationListItem {
  slug: string
  executiveName: string
  title: string
  position: string
  organisation: string
  photo: string
  initials: string
  excerpt: string
  date: string
  qa: QAPair[]
  transcriptRef: string
  status: 'draft' | 'published'
  introduction: string
  pullQuote: string
  closingQuote: string
  editorsNote: string
}

interface ConversationListError {
  slug: string
  error: string
}

// Unlike the public lib/conversation-content.ts list, the admin must not
// silently drop a row on failure — Nneoma needs to see that a specific file
// is broken, not a quietly shorter list. One bad file still must not crash
// the whole table.
async function fetchConversationRow(filename: string): Promise<ConversationListItem | ConversationListError> {
  const slug = filename.replace(/\.md$/, '')
  try {
    const file = await getFile(`content/conversations/${filename}`)
    if (!file) return { slug, error: 'File not found on GitHub.' }
    const { data } = matter(file.content)
    return {
      slug,
      executiveName: String(data.executiveName ?? ''),
      title: String(data.title ?? ''),
      position: String(data.position ?? ''),
      organisation: String(data.organisation ?? ''),
      photo: String(data.photo ?? ''),
      initials: String(data.initials ?? ''),
      excerpt: String(data.excerpt ?? ''),
      date: String(data.date ?? ''),
      qa: Array.isArray(data.qa) ? data.qa : [],
      transcriptRef: String(data.transcriptRef ?? ''),
      // Fail closed, matching lib/conversation-content.ts — shown
      // explicitly as Draft rather than silently assumed Published.
      status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
      introduction: typeof data.introduction === 'string' ? data.introduction : '',
      pullQuote: typeof data.pullQuote === 'string' ? data.pullQuote : '',
      closingQuote: typeof data.closingQuote === 'string' ? data.closingQuote : '',
      editorsNote: typeof data.editorsNote === 'string' ? data.editorsNote : '',
    }
  } catch (error) {
    console.error(`Admin conversations list: failed to load "${slug}"`, error)
    return { slug, error: error instanceof Error ? error.message : 'Failed to load this file.' }
  }
}

function isConversationError(row: ConversationListItem | ConversationListError): row is ConversationListError {
  return 'error' in row
}

async function fetchConversationList(): Promise<(ConversationListItem | ConversationListError)[]> {
  const filenames = (await listFiles('content/conversations')).filter((name) => name.endsWith('.md'))
  // allSettled, not all — fetchConversationRow already catches its own
  // errors and never rejects, but this is the belt-and-suspenders guarantee
  // that one file can never take the rest of the table down even if that
  // changes.
  const results = await Promise.allSettled(filenames.map(fetchConversationRow))

  const rows: (ConversationListItem | ConversationListError)[] = results.map((result, i) =>
    result.status === 'fulfilled'
      ? result.value
      : {
          slug: filenames[i].replace(/\.md$/, ''),
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        }
  )

  return rows.sort((a, b) => {
    if (isConversationError(a) || isConversationError(b)) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

type PageProps = { searchParams: Promise<{ saved?: string }> }

export default async function ConversationsAdminPage({ searchParams }: PageProps) {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const { saved } = await searchParams
  const conversations = await fetchConversationList()

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">Conversations</h1>
          </div>
          <Link
            href="/admin/conversations/new"
            className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            + New Conversation
          </Link>
        </div>

        {saved && (
          <div className="mb-6 border border-gold/40 bg-gold/10 text-deep px-5 py-4 font-sans text-[13.5px]">
            Conversation saved. Your site is rebuilding now; this change will be live in a minute or two.
          </div>
        )}

        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Executive</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Status</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Organisation</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Date</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Transcript Ref</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-sans text-[14px] text-muted">
                    No conversations yet.
                  </td>
                </tr>
              ) : (
                conversations.map((conversation) =>
                  isConversationError(conversation) ? (
                    <tr key={conversation.slug} className="border-b border-border last:border-b-0 bg-red-50">
                      <td colSpan={6} className="px-5 py-4 font-sans text-[13px] text-red-700">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase mr-2">Failed to load</span>
                        {conversation.slug}.md — {conversation.error}
                      </td>
                    </tr>
                  ) : (
                  <tr
                    key={conversation.slug}
                    className="border-b border-border last:border-b-0 hover:bg-cream/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-sans text-[14px] text-ink max-w-[420px]">{conversation.executiveName}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={
                          conversation.status === 'published'
                            ? 'font-mono text-[10px] tracking-[0.1em] uppercase text-teal'
                            : 'font-mono text-[10px] tracking-[0.1em] uppercase text-muted'
                        }
                      >
                        {conversation.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-muted whitespace-nowrap">{conversation.organisation}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">{formatDate(conversation.date)}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-gold whitespace-nowrap">{conversation.transcriptRef}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <ConversationRowActions
                        slug={conversation.slug}
                        executiveName={conversation.executiveName}
                        title={conversation.title}
                        position={conversation.position}
                        organisation={conversation.organisation}
                        photo={conversation.photo}
                        initials={conversation.initials}
                        excerpt={conversation.excerpt}
                        date={conversation.date}
                        qa={conversation.qa}
                        status={conversation.status}
                        introduction={conversation.introduction}
                        pullQuote={conversation.pullQuote}
                        closingQuote={conversation.closingQuote}
                        editorsNote={conversation.editorsNote}
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
