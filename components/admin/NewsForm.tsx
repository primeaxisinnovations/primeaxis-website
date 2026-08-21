'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABEL, type NewsCategory } from '@/lib/news-categories'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

const inputClasses =
  'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'
const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'

export interface NewsFormValues {
  title: string
  slug: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body: string
  sourceLink: string
  status: 'draft' | 'published'
}

interface NewsFormProps {
  mode: 'create' | 'edit'
  initialValues?: NewsFormValues
}

export default function NewsForm({ mode, initialValues }: NewsFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [date, setDate] = useState(initialValues?.date ?? todayISODate())
  const [category, setCategory] = useState<string>(initialValues?.category ?? NEWS_CATEGORIES[0])
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [body, setBody] = useState(initialValues?.body ?? '')
  const [sourceLink, setSourceLink] = useState(initialValues?.sourceLink ?? '')

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugManuallyEdited) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true)
    setSlug(value)
  }

  async function submit(status: 'draft' | 'published') {
    setError(null)
    setIsSubmitting(true)

    const payload = {
      title,
      slug,
      date,
      category,
      coverImage,
      excerpt,
      body,
      sourceLink,
      status,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/news' : `/api/admin/news/${initialValues!.slug}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      const data = await res.json()
      router.push(`/admin/news?saved=${encodeURIComponent(data.slug ?? slug)}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Plain form submission (including pressing Enter in a field) always
  // saves as a draft — publishing requires an explicit click on the
  // "Publish" button below, never an implicit action.
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit('draft')
  }

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[760px] mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
        <h1 className="font-display text-[28px] font-semibold text-deep mb-8">
          {mode === 'create' ? 'New News Item' : 'Edit News Item'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-border p-8 max-sm:p-5 flex flex-col gap-6">
          <div>
            <label htmlFor="title" className={labelClasses}>Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClasses}>Slug</label>
            <input
              id="slug"
              type="text"
              required
              disabled={mode === 'edit'}
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`${inputClasses} font-mono text-[13px] disabled:opacity-60 disabled:cursor-not-allowed`}
            />
            {mode === 'edit' && (
              <p className="font-sans text-[12px] text-muted mt-1.5">
                The slug determines the item&apos;s file and URL — it can&apos;t be changed after creation.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date" className={labelClasses}>Date</label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClasses}>Category</label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            >
              {NEWS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{NEWS_CATEGORY_LABEL[cat as NewsCategory]}</option>
              ))}
            </select>
          </div>

          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onUploadComplete={setCoverImage}
            required
          />

          <div>
            <label htmlFor="excerpt" className={labelClasses}>Excerpt</label>
            <textarea
              id="excerpt"
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={`${inputClasses} resize-y`}
            />
            <p className="font-sans text-[12px] text-muted mt-1.5">
              One or two lines. This is all the /news listing shows — the full body only appears on
              the item&apos;s own page.
            </p>
          </div>

          <div>
            <label className={labelClasses}>Body</label>
            <RichTextEditor value={body} onChange={setBody} />
            <p className="font-sans text-[12px] text-muted mt-1.5">
              Full rich content — short or long-form, with as many inline images as the story needs.
            </p>
          </div>

          <div>
            <label htmlFor="sourceLink" className={labelClasses}>Source Link (optional)</label>
            <input
              id="sourceLink"
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://…"
              className={inputClasses}
            />
          </div>

          {error && (
            <p className="font-sans text-[13px] text-stamp" role="alert">{error}</p>
          )}

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-sans text-[13px] font-semibold tracking-[.04em] text-deep border border-deep px-7 py-3 hover:bg-deep hover:text-cream transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Save as Draft'}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => submit('published')}
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-7 py-3 hover:bg-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Publish'}
            </button>
            <a
              href="/admin/news"
              className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted hover:text-ink transition-colors duration-150"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
