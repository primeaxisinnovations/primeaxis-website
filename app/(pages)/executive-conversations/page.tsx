import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllConversations } from '@/lib/conversation-content'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConversationCard from '@/components/ui/ConversationCard'

export const metadata: Metadata = {
  title: 'Executive Conversations | PrimeAxis',
  description:
    "In-depth dialogue with the executives, regulators, and institution builders defining Africa's maritime future — in their own words.",
}

// Reads live from GitHub on every request (see lib/conversation-content.ts)
// — must stay dynamic so a Publish/Unpublish/Save never waits on a rebuild.
export const dynamic = 'force-dynamic'

export default async function ExecutiveConversationsPage() {
  const conversations = await getAllConversations()

  return (
    <div className="min-h-screen bg-cream">

      {/* Page Header — full-bleed maritime photography behind a
          frosted-glass content card ─────────────────────────────────── */}
      <section className="relative pt-[60px] pb-[72px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1704655395967-c4b2c617a028?w=1600&q=80&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1824]/90 via-[#0D1824]/60 to-transparent" />
        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div
              className="max-w-[680px] p-8 max-sm:p-6 border border-white/20 backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
              }}
            >
              <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
                Executive Conversations
              </span>
              <h1 className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold text-white leading-[1.1] max-w-[680px] mb-5">
                Conversations Shaping Africa&apos;s Maritime Future
              </h1>
              <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-[520px]">
                Engaging the executives, regulators, and institution builders whose decisions are
                defining the direction of Africa&apos;s maritime and blue economy sectors.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Conversation List */}
      <section className="py-[72px] max-sm:py-12">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
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
