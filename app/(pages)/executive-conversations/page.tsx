import type { Metadata } from 'next'
import { conversations } from '@/lib/placeholder-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConversationCard from '@/components/ui/ConversationCard'

export const metadata: Metadata = {
  title: 'Executive Conversations | PrimeAxis',
  description:
    "In-depth dialogue with the executives, regulators, and institution builders defining Africa's maritime future — in their own words.",
}

export default function ExecutiveConversationsPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Page Header */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Executive Conversations
            </span>
            <h1 className="font-display text-[clamp(28px,3.5vw,52px)] font-semibold text-deep leading-[1.1] max-w-[680px] mb-5">
              Conversations Shaping Africa&apos;s Maritime Future
            </h1>
            <p className="font-sans text-[15px] text-muted leading-relaxed max-w-[520px]">
              Engaging the executives, regulators, and institution builders whose decisions are
              defining the direction of Africa&apos;s maritime and blue economy sectors.
            </p>
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
