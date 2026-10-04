'use client'

import ConversationCard from '@/components/ui/ConversationCard'
import useLiveViewCounts from '@/components/ui/useLiveViewCounts'
import type { Conversation } from '@/types'

interface ConversationListLiveProps {
  conversations: Conversation[]
  // slug → count, read once on the server from this page's ISR entry.
  viewCounts: Record<string, number>
}

// Thin client boundary around the conversations list, so the page itself stays
// a server component. Its only job is to swap the server-rendered counts for
// near-live ones; the markup is unchanged from what the page rendered before.
export default function ConversationListLive({
  conversations,
  viewCounts,
}: ConversationListLiveProps) {
  const liveCounts = useLiveViewCounts('conversation', viewCounts)

  return (
    <div className="flex flex-col gap-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.slug}
          conversation={conversation}
          viewCount={liveCounts[conversation.slug] ?? 0}
        />
      ))}
    </div>
  )
}
