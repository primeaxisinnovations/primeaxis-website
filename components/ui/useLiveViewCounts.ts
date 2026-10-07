'use client'

import { useEffect, useState } from 'react'

type ContentType = 'article' | 'conversation'

/**
 * Keeps a listing surface's view counts near-live without a per-card request.
 *
 * Seeded with the counts the server rendered (which come from the page's ISR
 * entry and can be up to an hour old), then refreshed ONCE per mount from
 * /api/views/batch — one request and one Blob read for the whole surface,
 * however many cards it shows.
 *
 * The merge is deliberately one-directional: a live value is taken only when
 * it is strictly higher than what is already displayed. View counts only ever
 * increase, so a lower or zero value is a stale read or a swallowed Blob
 * failure, and must not be shown. Failures are ignored entirely — the cards
 * simply keep their server-rendered numbers.
 */
export default function useLiveViewCounts(
  type: ContentType,
  serverCounts: Record<string, number>
): Record<string, number> {
  const [counts, setCounts] = useState(serverCounts)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/views/batch?type=${type}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return

        const live: unknown = data?.counts
        if (!live || typeof live !== 'object') return

        setCounts((current) => {
          const merged = { ...current }
          let changed = false

          for (const [slug, value] of Object.entries(live as Record<string, unknown>)) {
            if (typeof value !== 'number' || !Number.isFinite(value)) continue
            // `?? 0` means a zero can never be written, and an unknown slug is
            // only added when its live count is positive.
            if (value > (merged[slug] ?? 0)) {
              merged[slug] = value
              changed = true
            }
          }

          // Same object back when nothing moved, so no needless re-render.
          return changed ? merged : current
        })
      })
      .catch(() => {
        // Ignored by design — keep the server-rendered numbers.
      })

    return () => {
      cancelled = true
    }
    // Exactly one fetch per mount; `type` is fixed for a given surface.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return counts
}
