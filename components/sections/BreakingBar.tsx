import Link from 'next/link'
import { getAllArticles } from '@/lib/content'
import type { Article } from '@/types'

// Self-contained Server Component: fetches its own published articles via
// getAllArticles() so it can be dropped into any Server Component page with no
// props. The markup is purely presentational (Links + a CSS-only ticker
// animation), so it ships no client JS. getAllArticles() is request-memoized
// (React cache()), so rendering this alongside a page that already calls it
// costs a single GitHub request, not two.

function TickerItems({ articles, copyKey }: { articles: Article[]; copyKey: string }) {
  return (
    <>
      {articles.map((article, i) => (
        <span key={`${copyKey}-${article.slug}`}>
          <Link href={`/intelligence-hub/${article.slug}`} className="hover:underline">
            <span className="uppercase">{article.category}</span>: {article.title}
          </Link>
          {i < articles.length - 1 && <span className="mx-3">·</span>}
        </span>
      ))}
    </>
  )
}

export default async function BreakingBar() {
  // Mirror the homepage's previous behaviour: the five most recent published
  // articles. Never show fake/placeholder headlines — if there's nothing real
  // to show (no published articles), there's no bar at all.
  const articles = (await getAllArticles()).slice(0, 5)
  if (articles.length === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gold h-[38px] overflow-hidden flex items-center">
      <div className="flex items-center gap-4 w-full">
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase bg-deep text-gold px-3 py-[3px] whitespace-nowrap flex-shrink-0 ml-4">
          Latest
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker text-[12px] font-medium text-deep tracking-[0.02em] whitespace-nowrap inline-block">
            <TickerItems articles={articles} copyKey="a" />
            <span className="mx-3">·</span>
            <TickerItems articles={articles} copyKey="b" />
          </div>
        </div>
      </div>
    </div>
  )
}
