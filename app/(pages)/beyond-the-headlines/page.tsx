import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import IntelligenceHubGrid from '@/components/sections/IntelligenceHubGrid'
import BreakingBar from '@/components/sections/BreakingBar'
import { getAllArticles } from '@/lib/content'
import { getAllViewCounts } from '@/lib/view-counts'

export const metadata: Metadata = {
  title: 'Beyond the Headlines – The Friday Edition | PrimeAxis',
  description:
    "PrimeAxis's Friday editorial edition: context, strategic analysis and the stories shaping Africa's maritime future.",
}

export const revalidate = 3600

export default async function BeyondTheHeadlinesPage() {
  const articles = (await getAllArticles()).filter(
    (article) => article.section === 'beyond-the-headlines'
  )
  const viewCounts = await getAllViewCounts('article')

  return (
    <div className="min-h-screen">
      <BreakingBar />

      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-deep pb-[70px] pt-[60px]">
        <Image
          className="hub-hero-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782434695415-622356c7-frxth.png"
          alt=""
          aria-hidden="true"
          fill
          quality={80}
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-x-0 top-0 z-[1] h-[110px] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.88), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 z-[1] h-[130px] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.96), transparent)' }}
        />
        <AnimatedSection className="relative z-[2] mx-auto w-full max-w-[1240px] px-11 max-md:px-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            The Friday Edition
          </p>
          <h1 className="mb-5 max-w-[760px] font-display text-[clamp(28px,3.5vw,52px)] font-semibold leading-[1.1] text-white">
            Beyond the Headlines
          </h1>
          <p className="max-w-[620px] font-sans text-[15px] leading-relaxed text-white/70">
            Weekly context and executive perspective on the developments shaping Africa&apos;s
            maritime and blue economy.
          </p>
        </AnimatedSection>
      </section>

      <Suspense>
        <IntelligenceHubGrid articles={articles} viewCounts={viewCounts} />
      </Suspense>
    </div>
  )
}
