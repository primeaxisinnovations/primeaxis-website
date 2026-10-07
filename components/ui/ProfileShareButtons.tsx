'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

export default function ProfileShareButtons({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  async function share() {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: `${name} | PrimeAxis`, url })
    else { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
  }
  return <div className="flex flex-wrap items-center gap-3" aria-label="Share profile">
    <button type="button" onClick={share} className="inline-flex items-center gap-2 border border-deep/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-deep hover:border-gold hover:text-gold transition-colors"><Share2 size={13} aria-hidden /> Share</button>
    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-deep/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-deep hover:border-gold hover:text-gold transition-colors">LinkedIn</a>
    <span className="sr-only" aria-live="polite">{copied ? 'Profile link copied' : ''}</span>
  </div>
}
