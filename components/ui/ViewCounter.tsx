'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContentType = 'article' | 'conversation'

// Interactive: detail pages. On mount, records one view per visitor session.
interface InteractiveProps {
  mode: 'interactive'
  type: ContentType
  slug: string
  initialCount: number
  className?: string
  count?: never
}

// Display-only: card previews in listing grids. Pure render — no session
// check, no API call, no increment. Seeing a card in a grid is NOT a view.
interface DisplayProps {
  mode: 'display'
  count: number
  className?: string
  type?: never
  slug?: never
  initialCount?: never
}

type ViewCounterProps = InteractiveProps | DisplayProps

function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}

export default function ViewCounter(props: ViewCounterProps) {
  if (props.mode === 'display') {
    return <ViewCountBadge count={props.count} className={props.className} />
  }
  return <InteractiveViewCounter {...props} />
}

function InteractiveViewCounter({
  type,
  slug,
  initialCount,
  className,
}: InteractiveProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const key = `viewed:${type}:${slug}`

    // View counts only ever go up, so a reply that is zero, non-numeric or
    // lower than what's on screen is a stale read or a swallowed failure —
    // never let it replace the displayed number. This is what keeps the badge
    // from flashing 0 when a Blob read fails.
    const applyCount = (value: unknown) => {
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return
      setCount((current) => (value > current ? value : current))
    }

    // Session dedupe: a refresh in the same tab session must not re-count.
    // sessionStorage (not localStorage) so a genuinely new session counts.
    if (sessionStorage.getItem(key)) {
      // Already counted this session. Previously this returned immediately and
      // left initialCount on screen — which is the number frozen into the
      // page's ISR render, so a returning reader saw the count appear to drop
      // back. Read the live value instead. No increment.
      fetch(`/api/views?type=${type}&slug=${encodeURIComponent(slug)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => applyCount(data?.count))
        .catch(() => {
          // Keep whatever is displayed.
        })
      return
    }
    sessionStorage.setItem(key, '1')

    // Optimistic: bump the visible number immediately, before the request
    // resolves, so the reader sees their own view reflected without a wait.
    setCount((c) => c + 1)

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // Reconcile with the server's authoritative count. The > 0 guard the
        // increment helper needs (it returns 0 on a Blob failure) now lives in
        // applyCount, together with the monotonic check.
        applyCount(data?.count)
      })
      .catch(() => {
        // Silent by design — this is a low-stakes endpoint. The count simply
        // stays at its optimistic value for the rest of this session.
      })
    // Fire exactly once on mount; type/slug are stable for a given page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ViewCountBadge count={count} className={className} />
}

// Shared visual — eye icon + formatted number, matching the site's existing
// metadata treatment (font-mono / DM Mono, muted, uppercase tracking). Callers
// on dark surfaces override the colour via className (twMerge lets it win).
function ViewCountBadge({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[10px] text-muted uppercase tracking-[0.12em] tabular-nums',
        className
      )}
      title={`${formatCount(count)} views`}
    >
      <Eye size={12} strokeWidth={1.75} aria-hidden />
      {formatCount(count)}
    </span>
  )
}
