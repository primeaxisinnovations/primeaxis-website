'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ArticleCard from '@/components/ui/ArticleCard'
import Button from '@/components/ui/Button'
import { CATEGORIES } from '@/lib/categories'
import { cn } from '@/lib/utils'
import type { Article } from '@/types'

const PAGE_SIZE = 6

interface IntelligenceHubGridProps {
  articles: Article[]
}

export default function IntelligenceHubGrid({ articles }: IntelligenceHubGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
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
    <section className="py-[72px] bg-cream max-sm:py-12">
      <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">

        {/* Category filter pills — dark glass island floating on the
            otherwise light/cream page */}
        <AnimatedSection className="mb-10">
          <div className="relative bg-deep rounded-sm2 overflow-hidden">
            <div
              className="absolute inset-0 border border-white/15 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}
            />
            <div className="relative flex flex-wrap gap-2 p-5">
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
