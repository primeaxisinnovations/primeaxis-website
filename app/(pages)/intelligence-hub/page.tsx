import type { Metadata } from 'next'
import AnimatedSection from '@/components/ui/AnimatedSection'
import IntelligenceHubGrid from '@/components/sections/IntelligenceHubGrid'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Intelligence Hub | PrimeAxis Maritime Intelligence',
  description:
    "Strategic maritime analysis, industry intelligence, and policy perspectives shaping Africa's maritime future.",
}

// ISR: served from the CDN cache, regenerated in the background at most
// once every 60s — a Publish/Unpublish/Save shows up within ~a minute.
export const revalidate = 60

export default async function IntelligenceHubPage() {
  const articles = await getAllArticles()

  return (
    <div className="min-h-screen">

      {/* Page Header */}
      <section className="relative overflow-hidden bg-deep mb-0 pt-[60px] pb-[70px] min-h-[420px] h-[46vh] max-h-[520px]">
        <img
          className="hub-hero-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782268821745-595c0378-chatgpt-image-jun-24-2026-03-31-35-am.png"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.90), transparent)' }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.75) 30%, rgba(13,27,42,0.35) 55%, rgba(13,27,42,0.08) 75%, transparent 88%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[140px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #111f2e, transparent)' }}
        />
        <div className="relative z-[3] max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Intelligence Hub
            </span>
            <h1 className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold text-white leading-[1.1] max-w-[720px] mb-5">
              Maritime Intelligence for Africa&apos;s Decision-Makers
            </h1>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-[560px]">
              Strategic analysis, policy intelligence, and industry perspectives — curated for
              Africa&apos;s maritime executives, regulators, and operators.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category filter + article grid */}
      <IntelligenceHubGrid articles={articles} />

    </div>
  )
}
