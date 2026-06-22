'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ArticleRowActionsProps {
  slug: string
  title: string
  category: string
  author: string
  date: string
  excerpt: string
  featuredImage: string
  tags: string[]
  body: string
  status: 'draft' | 'published'
}

export default function ArticleRowActions(props: ArticleRowActionsProps) {
  const router = useRouter()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function toggleStatus() {
    setIsWorking(true)
    setError(null)
    const nextStatus = props.status === 'published' ? 'draft' : 'published'
    try {
      const res = await fetch(`/api/admin/articles/${props.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: props.title,
          category: props.category,
          author: props.author,
          date: props.date,
          excerpt: props.excerpt,
          featuredImage: props.featuredImage,
          tags: props.tags,
          body: props.body,
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
  // accidental click can never delete an article.
  async function handleDelete() {
    const confirmed = window.confirm(`Permanently delete "${props.title}"? This cannot be undone.`)
    if (!confirmed) return

    setIsWorking(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/articles/${props.slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to delete article.')
        setIsWorking(false)
        return
      }
      router.refresh()
    } catch {
      setError('Failed to delete article.')
      setIsWorking(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {error && <span className="font-sans text-[11px] text-stamp">{error}</span>}
      <Link
        href={`/admin/articles/${props.slug}/edit`}
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
