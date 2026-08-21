import Link from 'next/link'
import { getAllArticles } from '@/lib/content'
import { getAllConversations } from '@/lib/conversation-content'
import { getAllNews } from '@/lib/news'

// Self-contained Server Component: fetches its own published content so it
// can be dropped into any Server Component page with no props. The markup is
// purely presentational (Links + a CSS-only ticker animation), so it ships no
// client JS. getAllArticles() and getAllNews() are request-memoized (React
// cache()), so rendering this alongside a page that already calls them costs
// one GitHub request each, not two.

type TickerType = 'news' | 'intelligence' | 'conversation'

interface TickerEntry {
  key: string
  type: TickerType
  label: string
  title: string
  href: string
  date: string
}

// Colour-coding on the gold bar. Kept to brand tokens rather than inventing
// a third accent: news is the loudest (solid navy, gold type), analysis sits
// one step back (solid teal), conversations read as an outline.
const TYPE_STYLE: Record<TickerType, { background: string; color: string; border: string }> = {
  news:         { background: '#151C2E', color: '#BF9F66', border: '1px solid #151C2E' },
  intelligence: { background: '#485778', color: '#F4F1EB', border: '1px solid #485778' },
  conversation: { background: 'transparent', color: '#151C2E', border: '1px solid rgba(21,28,46,0.55)' },
}

function TickerItems({ entries, copyKey }: { entries: TickerEntry[]; copyKey: string }) {
  return (
    <>
      {entries.map((entry, i) => (
        <span key={`${copyKey}-${entry.key}`}>
          <Link href={entry.href} className="hover:underline">
            <span
              className="font-mono text-[8.5px] tracking-[0.16em] uppercase px-1.5 py-[2px] mr-2 align-[1px]"
              style={TYPE_STYLE[entry.type]}
            >
              {entry.label}
            </span>
            {entry.title}
          </Link>
          {i < entries.length - 1 && <span className="mx-3">·</span>}
        </span>
      ))}
    </>
  )
}

export default async function BreakingBar() {
  // One merged, date-sorted feed across all three content types. Fetched in
  // parallel — three independent GitHub reads shouldn't run in series.
  const [articles, conversations, news] = await Promise.all([
    getAllArticles(),
    getAllConversations(),
    getAllNews(),
  ])

  const merged: TickerEntry[] = [
    ...news.map((item) => ({
      key: `news-${item.slug}`,
      type: 'news' as const,
      label: 'News',
      title: item.title,
      href: `/news/${item.slug}`,
      date: item.date,
    })),
    ...articles.map((article) => ({
      key: `article-${article.slug}`,
      type: 'intelligence' as const,
      label: article.category,
      title: article.title,
      href: `/intelligence-hub/${article.slug}`,
      date: article.date,
    })),
    ...conversations.map((conversation) => ({
      key: `conversation-${conversation.slug}`,
      type: 'conversation' as const,
      label: 'Conversation',
      title: conversation.title,
      href: `/executive-conversations/${conversation.slug}`,
      date: conversation.date,
    })),
  ]

  // Most recent first across all types, then the six that fit a readable
  // ticker loop. Never show fake/placeholder headlines — if there's nothing
  // real to show, there's no bar at all.
  const entries = merged
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  if (entries.length === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gold h-[38px] overflow-hidden flex items-center">
      <div className="flex items-center gap-4 w-full">
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase bg-deep text-gold px-3 py-[3px] whitespace-nowrap flex-shrink-0 ml-4">
          Latest
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker text-[12px] font-medium text-deep tracking-[0.02em] whitespace-nowrap inline-block">
            <TickerItems entries={entries} copyKey="a" />
            <span className="mx-3">·</span>
            <TickerItems entries={entries} copyKey="b" />
          </div>
        </div>
      </div>
    </div>
  )
}
