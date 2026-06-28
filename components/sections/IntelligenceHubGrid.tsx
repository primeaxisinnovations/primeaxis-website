'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ArticleCard from '@/components/ui/ArticleCard'
import Button from '@/components/ui/Button'
import { CATEGORIES, categoryToSlug } from '@/lib/categories'
import { cn } from '@/lib/utils'
import type { Article } from '@/types'

const PAGE_SIZE = 6

interface IntelligenceHubGridProps {
  articles: Article[]
}

export default function IntelligenceHubGrid({ articles }: IntelligenceHubGridProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const matchedCategory = CATEGORIES.find((cat) => categoryToSlug(cat) === categoryParam) ?? null

  const [activeCategory, setActiveCategory] = useState<string | null>(matchedCategory)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered =
    activeCategory === null
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function handleCategoryChange(cat: string | null) {
    setActiveCategory(cat)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="mt-0 pt-0 pb-[72px] bg-cream max-sm:pb-12">
      <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">

        {/* Category filter pills — dark navy container */}
        <AnimatedSection>
          <div
            className="flex flex-wrap gap-2 mt-[32px] mb-10"
            style={{
              background: '#1a2535',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '16px',
            }}
          >
            <button
              onClick={() => handleCategoryChange(null)}
              className={cn(
                'font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm2 border transition-colors duration-200 cursor-pointer',
                activeCategory === null
                  ? 'bg-gold text-deep border-gold'
                  : 'bg-white text-teal border-border hover:border-gold hover:text-deep'
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  'font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm2 border transition-colors duration-200 cursor-pointer',
                  activeCategory === cat
                    ? 'bg-gold text-deep border-gold'
                    : 'bg-white text-teal border-border hover:border-gold hover:text-deep'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Article grid — silky reading surface */}
        <div className="bg-white/82 backdrop-blur-sm rounded-sm2 border border-white/25 p-8 max-sm:p-6">
          {visible.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-sans text-[15px] text-muted">
                No articles in this category yet — check back soon.
              </p>
            </div>
          ) : (
            <AnimatedSection delay={100}>
              <div className="flex flex-col gap-10">
                <ArticleCard article={visible[0]} variant="hero" />
                {visible.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visible.slice(1).map((article) => (
                      <ArticleCard key={article.slug} article={article} variant="standard" />
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Load More
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
