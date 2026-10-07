'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABEL, type NewsCategory } from '@/lib/news-categories'
// Type-only — erased at compile time, so the server-only lib/news module
// (and the GitHub client it imports) never reaches the browser bundle.
import type { NewsItem } from '@/lib/news'

// Filter pills — same pattern as components/events/EventsBrowser.tsx. The
// value matches NewsItem['category'] (or 'all'); the label is the display text.
const FILTERS: Array<{ value: 'all' | NewsCategory; label: string }> = [
  { value: 'all', label: 'All' },
  ...NEWS_CATEGORIES.map((value) => ({ value, label: NEWS_CATEGORY_LABEL[value] })),
]

const GOLD = '#c8a96e'

// Only the fields the listing actually renders cross the server→client
// boundary. The rich `body` stays on the server: it never appears in the
// list (short excerpt only, regardless of body length) and shipping it
// would put every embedded image and paragraph of every item into the
// page's serialized props.
export type NewsListItem = Pick<
  NewsItem,
  'slug' | 'title' | 'date' | 'category' | 'coverImage' | 'excerpt'
>

export default function NewsBrowser({ items }: { items: NewsListItem[] }) {
  const [filter, setFilter] = useState<'all' | NewsCategory>('all')

  const visible = filter === 'all' ? items : items.filter((item) => item.category === filter)

  return (
    <>
      {/* ── Category filter bar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={
                active
                  ? { color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(200,169,110,0.08)' }
                  : {
                      color: 'rgba(255,255,255,0.62)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* ── Reverse-chronological single-column list ─────────────────
          Deliberately one column and uniform in height: a news item's
          weight comes from its recency, not from how long its body is.
          Long-form and two-paragraph items render identically here — the
          full body only ever appears on the detail page. */}
      {visible.length === 0 ? (
        <p className="font-sans text-[14px] text-white/55 py-12">No reporting in this category yet.</p>
      ) : (
        <div className="flex flex-col">
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group flex items-start gap-6 max-sm:gap-4 py-7 border-t border-white/10 first:border-t-0 transition-colors duration-200 hover:bg-white/[0.03]"
            >
              {/* Thumbnail */}
              <div className="relative w-[200px] h-[124px] max-md:w-[132px] max-md:h-[86px] flex-shrink-0 overflow-hidden rounded-sm2 bg-white/5">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  quality={80}
                  sizes="(max-width: 768px) 132px, 200px"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              {/* Text column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span
                    className="font-mono text-[9.5px] tracking-[0.18em] uppercase px-2.5 py-[3px]"
                    style={{ color: GOLD, border: `1px solid rgba(200,169,110,0.35)` }}
                  >
                    {NEWS_CATEGORY_LABEL[item.category]}
                  </span>
                  <time
                    dateTime={item.date}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40"
                  >
                    {formatDate(item.date)}
                  </time>
                </div>

                <h2 className="font-display text-[20px] max-sm:text-[16.5px] font-semibold text-white leading-[1.28] mb-2 transition-colors duration-200 group-hover:text-gold">
                  {item.title}
                </h2>

                {/* Short excerpt — the listing's summary role, identical to an
                    ArticleCard's. Clamped so an over-long excerpt can never
                    break the uniform rhythm of the list. */}
                <p className="font-sans text-[13.5px] font-light text-white/55 leading-[1.65] line-clamp-2 max-sm:hidden">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
