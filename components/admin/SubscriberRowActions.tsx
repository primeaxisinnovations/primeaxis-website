'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SubscriberRowActionsProps {
  email: string
}

export default function SubscriberRowActions({ email }: SubscriberRowActionsProps) {
  const router = useRouter()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Destructive action — require an explicit confirmation so a single
  // accidental click can never remove a subscriber. Same pattern as
  // EventRowActions.tsx.
  async function handleRemove() {
    const confirmed = window.confirm(
      `Remove "${email}" from the subscriber list? This cannot be undone.`
    )
    if (!confirmed) return

    setIsWorking(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to remove subscriber.')
        setIsWorking(false)
        return
      }
      router.refresh()
    } catch {
      setError('Failed to remove subscriber.')
      setIsWorking(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {error && <span className="font-sans text-[11px] text-stamp">{error}</span>}
      <button
        type="button"
        disabled={isWorking}
        onClick={handleRemove}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-stamp hover:text-deep transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Remove
      </button>
    </div>
  )
}
