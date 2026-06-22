import Link from 'next/link'
import type { Article } from '@/types'

interface BreakingBarProps {
  // The caller (app/page.tsx, a Server Component) fetches these live via
  // getAllArticles() — BreakingBar itself can't call it directly, since it's
  // rendered inside HomeContent, a 'use client' tree, and getAllArticles()
  // depends on Node-only modules (lib/github.ts) that can't ship to the
  // browser bundle.
  articles: Article[]
}

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

export default function BreakingBar({ articles }: BreakingBarProps) {
  // Never show fake/placeholder headlines — if there's nothing real to
  // show (no published articles), there's no bar at all.
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
