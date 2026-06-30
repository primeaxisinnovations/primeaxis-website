import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllConversations } from '@/lib/conversation-content'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConversationCard from '@/components/ui/ConversationCard'
import BreakingBar from '@/components/sections/BreakingBar'

export const metadata: Metadata = {
  title: 'Executive Conversations | PrimeAxis',
  description:
    "In-depth dialogue with the executives, regulators, and institution builders defining Africa's maritime future — in their own words.",
}

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour.
// Raised from 60s to cut GitHub-API cold-load latency on cache misses.
export const revalidate = 3600

export default async function ExecutiveConversationsPage() {
  const conversations = await getAllConversations()

  return (
    <div className="min-h-screen bg-cream">

      <BreakingBar />

      {/* Page Header — full-viewport hero photograph, bleeding behind the
          transparent fixed header (-mt cancels the global main pt-[102px]) ── */}
      <section className="hero-section relative min-h-screen overflow-hidden -mt-[102px]">
        <Image
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782264691397-a9a17b5b-nym.png"
          alt="Executive conversation interview"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover hero-exec-image"
        />
        <div
          className="absolute inset-x-0 top-0 h-[80px]"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.65), transparent)' }}
        />
        <div className="absolute z-10 bottom-[52px] left-[64px] max-sm:bottom-9 max-sm:left-6">
          <span
            className="block font-mono text-[10px] tracking-[0.24em] uppercase mb-3"
            style={{ color: 'var(--color-gold-bright)', textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
          >
            Executive Conversations
          </span>
          <h1
            className="font-display text-[46px] max-sm:text-[32px] font-bold text-white leading-[1.12] max-w-[620px] mb-4"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.75), 0 1px 6px rgba(0,0,0,0.60)' }}
          >
            Conversations Shaping Africa&apos;s Maritime Future
          </h1>
          <p
            className="font-sans text-[15px] font-light text-white/80 max-w-[480px]"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85), 0 2px 20px rgba(0,0,0,0.60)' }}
          >
            Unfiltered dialogue with the leaders defining Africa&apos;s blue economy.
          </p>
        </div>
      </section>

      {/* Conversation List */}
      <section className="pt-[102px] pb-[72px] max-sm:pb-12">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection delay={100}>
            <div className="flex flex-col gap-4">
              {conversations.map((conversation) => (
                <ConversationCard key={conversation.slug} conversation={conversation} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  )
}
