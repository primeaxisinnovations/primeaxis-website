import type { Metadata } from 'next'
import { searchContent } from '@/lib/search'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ArticleCard from '@/components/ui/ArticleCard'
import ConversationCard from '@/components/ui/ConversationCard'

export const metadata: Metadata = {
  title: 'Search | PrimeAxis Maritime Intelligence',
  description: 'Search PrimeAxis maritime intelligence articles and executive conversations.',
}

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour.
// Raised from 60s to cut GitHub-API cold-load latency on cache misses.
export const revalidate = 3600

type PageProps = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const results = query ? await searchContent(query) : []

  return (
    <div className="min-h-screen bg-cream">

      {/* Page Header */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Search
            </span>
            <h1 className="font-display text-[clamp(24px,3vw,40px)] font-semibold text-deep leading-[1.1] max-w-[720px] mb-3">
              {query ? `Results for "${query}"` : 'Search PrimeAxis'}
            </h1>
            {query && (
              <p className="font-sans text-[14px] text-muted">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Results */}
      <section className="py-[72px] max-sm:py-12">
        <div className="max-w-[800px] mx-auto px-11 max-md:px-5">
          {!query ? (
            <div className="py-24 text-center">
              <p className="font-sans text-[15px] text-muted">
                Enter a search term above to find articles and conversations.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-sans text-[15px] text-muted">
                No results for &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <AnimatedSection delay={100}>
              <div className="flex flex-col gap-6">
                {results.map((result) =>
                  result.type === 'article' ? (
                    <ArticleCard
                      key={`article-${result.article.slug}`}
                      article={result.article}
                      variant="standard"
                    />
                  ) : (
                    <ConversationCard
                      key={`conversation-${result.conversation.slug}`}
                      conversation={result.conversation}
                    />
                  )
                )}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

    </div>
  )
}
