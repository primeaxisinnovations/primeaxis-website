import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import Tag from './Tag'
import ViewCounter from './ViewCounter'
import { cn, formatDate } from '@/lib/utils'

type CardVariant = 'hero' | 'standard' | 'horizontal'

interface ArticleCardProps {
  article: Article
  variant?: CardVariant
  className?: string
  // Read-only view count for this card. When omitted (e.g. a listing that
  // doesn't wire counts), the eye badge is simply not rendered. A card in a
  // grid is display-only and never increments — increments happen solely on
  // the detail page's interactive ViewCounter.
  viewCount?: number
}

export default function ArticleCard({ article, variant = 'standard', className, viewCount }: ArticleCardProps) {
  if (variant === 'hero') {
    return (
      <Link
        href={`/intelligence-hub/${article.slug}`}
        className={cn(
          'group block bg-white shadow-card border-t-2 border-transparent',
          'hover:border-gold hover:-translate-y-[3px] hover:shadow-card-hover',
          'transition-all duration-200',
          className
        )}
      >
        {/* Image with category overlay */}
        <div className="relative aspect-video overflow-hidden bg-deep">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            quality={80}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <Tag category={article.category} className="mb-3 block" />
          <h2
            className="font-display font-bold text-ink leading-snug mb-3"
            style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}
          >
            {article.title}
          </h2>
          <p className="text-muted text-[14px] leading-relaxed line-clamp-2 mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted uppercase tracking-[0.12em]">
              <span>{article.author}</span>
              <span className="text-border">·</span>
              <span>{formatDate(article.date)}</span>
              <span className="text-border">·</span>
              <span>{article.readingTime}</span>
              {typeof viewCount === 'number' && (
                <>
                  <span className="text-border">·</span>
                  <ViewCounter mode="display" count={viewCount} />
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-deep transition-all duration-200 flex-shrink-0">
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/intelligence-hub/${article.slug}`}
        className={cn(
          'group flex bg-white shadow-card border-t border-border hover:border-gold',
          'hover:shadow-card-hover transition-all duration-200 overflow-hidden',
          className
        )}
      >
        <div className="relative w-[40%] flex-shrink-0 min-h-[120px] bg-deep">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            quality={80}
            className="object-contain"
            sizes="40vw"
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <Tag category={article.category} className="mb-2 block" />
            <h3 className="font-display font-semibold text-ink text-[1rem] leading-snug line-clamp-2">
              {article.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted uppercase tracking-[0.12em] mt-2">
            <span>{formatDate(article.date)}</span>
            {typeof viewCount === 'number' && (
              <>
                <span className="text-border">·</span>
                <ViewCounter mode="display" count={viewCount} />
              </>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // standard
  return (
    <Link
      href={`/intelligence-hub/${article.slug}`}
      className={cn(
        'group block bg-white shadow-card border-t-2 border-transparent',
        'hover:border-gold hover:-translate-y-[3px] hover:shadow-card-hover',
        'transition-all duration-200 overflow-hidden',
        className
      )}
    >
      <div className="relative h-[180px] overflow-hidden bg-deep">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          quality={80}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <Tag category={article.category} className="mb-3 block" />
        <h3
          className="font-display font-semibold text-ink leading-snug line-clamp-2 mb-5"
          style={{ fontSize: '1.1rem' }}
        >
          {article.title}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-muted uppercase tracking-[0.12em] min-w-0">
            <div className="truncate">{article.author}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{formatDate(article.date)} · {article.readingTime}</span>
              {typeof viewCount === 'number' && (
                <>
                  <span className="text-border">·</span>
                  <ViewCounter mode="display" count={viewCount} />
                </>
              )}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-deep transition-all duration-200 flex-shrink-0">
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  )
}
