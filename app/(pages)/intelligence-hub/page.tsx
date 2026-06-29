import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import IntelligenceHubGrid from '@/components/sections/IntelligenceHubGrid'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Intelligence Hub | PrimeAxis Maritime Intelligence',
  description:
    "Strategic maritime analysis, industry intelligence, and policy perspectives shaping Africa's maritime future.",
}

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour.
// Raised from 60s to cut GitHub-API cold-load latency on cache misses.
export const revalidate = 3600

export default async function IntelligenceHubPage() {
  const articles = await getAllArticles()

  return (
    <div className="min-h-screen">

      {/* Page Header */}
      <section className="relative overflow-hidden bg-deep mb-0 pt-[60px] pb-[70px] min-h-screen h-screen max-h-none flex items-end justify-start">
        {/* Full-bleed CSS-cover hero (.hub-hero-bg) → next/image `fill` with
            priority (LCP) and sizes=100vw (spans the viewport). */}
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
          className="absolute top-0 left-0 right-0 h-[110px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.88), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[130px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.96), transparent)' }}
        />
        <AnimatedSection className="hub-hero-card">
          <h1 className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold text-white leading-[1.1] max-w-[720px] mb-5">
            Maritime intelligence for Africa&apos;s leaders.
          </h1>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-[560px]">
            Clear insight for policy and industry action.
          </p>
        </AnimatedSection>
      </section>

      {/* Category filter + article grid */}
      <Suspense>
        <IntelligenceHubGrid articles={articles} />
      </Suspense>

    </div>
  )
}
