import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Conversation } from '@/types'
import { cn, formatDate } from '@/lib/utils'

interface ConversationCardProps {
  conversation: Conversation
  className?: string
}

export default function ConversationCard({ conversation, className }: ConversationCardProps) {
  return (
    <Link
      href={`/executive-conversations/${conversation.slug}`}
      className={cn(
        'group flex gap-5 bg-white shadow-card p-5',
        'border-t-2 border-transparent hover:border-gold',
        'hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      {/* Square portrait or initials avatar — real photo takes priority,
          falling back to the initials gradient only when no photo is set. */}
      {conversation.photo ? (
        <div className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden border-2 border-transparent group-hover:border-gold transition-colors duration-200">
          <Image
            src={conversation.photo}
            alt={conversation.executiveName}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>
      ) : (
        <div className="w-[120px] h-[120px] flex-shrink-0 flex items-center justify-center border-2 border-transparent group-hover:border-gold transition-colors duration-200 bg-gradient-to-br from-teal to-deep">
          <span className="font-display text-[26px] font-semibold text-white/85 tracking-wider">
            {conversation.initials}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-semibold text-ink text-[1.1rem] leading-snug mb-1">
            {conversation.executiveName}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-3 leading-relaxed">
            {conversation.position}
            <br />
            {conversation.organisation}
          </p>
          <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
            {conversation.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-[12px] font-semibold font-sans tracking-wide group-hover:gap-2.5 transition-all duration-200">
            Read Conversation
            <ArrowRight size={13} />
          </span>
          <span className="font-mono text-[10px] text-muted uppercase tracking-[0.1em]">
            {formatDate(conversation.date)}
          </span>
        </div>
      </div>
    </Link>
  )
}
