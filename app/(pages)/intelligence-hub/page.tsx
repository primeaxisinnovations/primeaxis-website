import type { Metadata } from 'next'
import AnimatedSection from '@/components/ui/AnimatedSection'
import IntelligenceHubGrid from '@/components/sections/IntelligenceHubGrid'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Intelligence Hub | PrimeAxis Maritime Intelligence',
  description:
    "Strategic maritime analysis, industry intelligence, and policy perspectives shaping Africa's maritime future.",
}

export default function IntelligenceHubPage() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen">

      {/* Page Header */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-brd">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Intelligence Hub
            </span>
            <h1 className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold text-deep leading-[1.1] max-w-[720px] mb-5">
              Maritime Intelligence for Africa&apos;s Decision-Makers
            </h1>
            <p className="font-sans text-[15px] text-muted leading-relaxed max-w-[560px]">
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
