'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EventRowActionsProps {
  slug: string
  title: string
}

export default function EventRowActions({ slug, title }: EventRowActionsProps) {
  const router = useRouter()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Destructive action — require an explicit confirmation so a single
  // accidental click can never delete an event.
  async function handleDelete() {
    const confirmed = window.confirm(`Permanently delete "${title}"? This cannot be undone.`)
    if (!confirmed) return

    setIsWorking(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to delete event.')
        setIsWorking(false)
        return
      }
      router.refresh()
    } catch {
      setError('Failed to delete event.')
      setIsWorking(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {error && <span className="font-sans text-[11px] text-stamp">{error}</span>}
      <Link
        href={`/admin/events/${slug}/edit`}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={isWorking}
        onClick={handleDelete}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-stamp hover:text-deep transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>
  )
}
