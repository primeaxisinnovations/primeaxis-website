'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NewsRowActionsProps {
  slug: string
  title: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body: string
  sourceLink: string
  status: 'draft' | 'published'
}

export default function NewsRowActions(props: NewsRowActionsProps) {
  const router = useRouter()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function toggleStatus() {
    setIsWorking(true)
    setError(null)
    const nextStatus = props.status === 'published' ? 'draft' : 'published'
    try {
      const res = await fetch(`/api/admin/news/${props.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: props.title,
          date: props.date,
          category: props.category,
          coverImage: props.coverImage,
          excerpt: props.excerpt,
          body: props.body,
          sourceLink: props.sourceLink,
          status: nextStatus,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to update status.')
        setIsWorking(false)
        return
      }
      router.refresh()
    } catch {
      setError('Failed to update status.')
      setIsWorking(false)
    }
  }

  // Destructive action — require an explicit confirmation so a single
  // accidental click can never delete a news item.
  async function handleDelete() {
    const confirmed = window.confirm(`Permanently delete "${props.title}"? This cannot be undone.`)
    if (!confirmed) return

    setIsWorking(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news/${props.slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to delete news item.')
        setIsWorking(false)
        return
      }
      router.refresh()
    } catch {
      setError('Failed to delete news item.')
      setIsWorking(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {error && <span className="font-sans text-[11px] text-stamp">{error}</span>}
      <Link
        href={`/admin/news/${props.slug}/edit`}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={isWorking}
        onClick={toggleStatus}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {props.status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
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
