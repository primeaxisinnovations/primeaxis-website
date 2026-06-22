import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Tag from '@/components/ui/Tag'
import ArticleCard from '@/components/ui/ArticleCard'
import DispatchHeader from '@/components/ui/DispatchHeader'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

type PageProps = { params: Promise<{ slug: string }> }

// Reads live from GitHub on every request (see lib/content.ts), so this
// page can no longer be statically generated at build time — a published
// article would otherwise be frozen at whatever state existed at the last
// deploy. generateStaticParams is removed for the same reason: pre-building
// a slug list is pointless once every request re-fetches anyway.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} | PrimeAxis Maritime Intelligence`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featuredImage }],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const allArticles = await getAllArticles()

  // Related: same-category articles first, filled with most-recent others to reach 3
  const sameCategory = allArticles.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  )
  const otherRecent = allArticles
    .filter((a) => a.slug !== article.slug && a.category !== article.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const related = [...sameCategory, ...otherRecent].slice(0, 3)

  const pageUrl = `${SITE_URL}/intelligence-hub/${article.slug}`
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(article.title)

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 py-3">
          <nav className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-muted flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors duration-150">Home</Link>
            <span>/</span>
            <Link href="/intelligence-hub" className="hover:text-gold transition-colors duration-150">Intelligence Hub</Link>
            <span>/</span>
            <span className="text-ink/50 line-clamp-1 max-w-[300px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 py-[60px] max-sm:py-10">

        {/* ── Article Header ─────────────────────────────────── */}
        <AnimatedSection>
          <div className="max-w-[720px] mx-auto mb-10">
            <Tag category={article.category} variant="filled" className="mb-5 inline-block" />
            <h1 className="font-display text-display-md font-bold text-deep leading-[1.1] mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted">
              <span>{article.author}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(article.date)}</span>
              <span aria-hidden>·</span>
              <span>{article.readingTime}</span>
            </div>
            <DispatchHeader
              refCode={article.referenceCode}
              date={formatDate(article.date)}
              desk={article.category.toUpperCase()}
              className="mt-6"
            />
          </div>
        </AnimatedSection>

        {/* ── Featured Image ─────────────────────────────────── */}
        <div className="relative w-full aspect-video rounded-sm2 overflow-hidden mb-[60px] max-sm:mb-10">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1240px"
          />
        </div>

        {/* ── Article Body ───────────────────────────────────── */}
        <AnimatedSection delay={100}>
          <div className="max-w-[680px] mx-auto">

            {/* Article body (HTML) — first paragraph carries the lead-paragraph
                treatment via .article-prose. dangerouslySetInnerHTML is safe here
                specifically because article.body originates only from RichTextEditor
                inside the authenticated admin's own article editor — it is never
                derived from public user input. Do not copy this pattern for any
                content that originates outside the admin CMS. */}
            <div
              className="article-prose bg-white/85 backdrop-blur-sm rounded-sm2 border border-white/20 p-10 max-sm:p-6"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-border">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border border-border text-muted rounded-sm2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Share Row ────────────────────────────────────── */}
            <div className="flex items-center gap-3 pt-8 mt-8 border-t border-border">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mr-1">
                Share
              </span>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

            {/* ── Author Bio ───────────────────────────────────── */}
            <div className="pt-8 mt-8 border-t border-border flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-teal" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-[10.5px] tracking-[0.15em] uppercase text-gold mb-1">
                  {article.author}
                </p>
                <p className="font-sans text-[13.5px] text-muted leading-relaxed">
                  PrimeAxis Intelligence Desk delivers strategic analysis on Africa&apos;s maritime
                  and blue economy sectors — informing the decisions of executives, regulators,
                  and investors shaping the continent&apos;s maritime future.
                </p>
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* ── Related Articles ───────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-[80px] pt-[60px] border-t border-border max-sm:mt-14 max-sm:pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block w-6 h-0.5 bg-gold mb-3" />
                <h2 className="font-display text-[clamp(20px,2vw,28px)] font-semibold text-deep">
                  Related Intelligence
                </h2>
              </div>
              <Link
                href="/intelligence-hub"
                className="font-mono text-[10px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors duration-150 hidden sm:block"
              >
                All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Newsletter CTA ─────────────────────────────────────── */}
      <section className="bg-deep py-[72px] max-sm:py-14">
        <div className="max-w-[600px] mx-auto px-11 max-sm:px-5 text-center">
          <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
            Intelligence Briefings
          </span>
          <h2 className="font-display text-[clamp(22px,2.5vw,34px)] font-semibold text-white leading-[1.15] mb-4">
            Stay Ahead of Africa&apos;s Maritime Story
          </h2>
          <p className="font-sans text-[14px] text-white/50 leading-relaxed mb-8">
            Strategic intelligence, policy analysis, and industry perspectives — direct to your
            inbox, free.
          </p>
          <div className="flex max-sm:flex-col">
            <input
              type="email"
              placeholder="Your professional email address"
              className="flex-1 font-sans text-[13.5px] px-[18px] py-[13px] border border-white/10 bg-white/5 text-white placeholder:text-white/30 outline-none focus:border-gold transition-colors duration-200"
            />
            <button
              type="submit"
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-[13px] whitespace-nowrap hover:bg-gold-light transition-colors duration-200"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
