'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'
import { slugify } from '@/lib/utils'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

const inputClasses =
  'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'
const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'

export interface ArticleFormValues {
  title: string
  slug: string
  category: string
  author: string
  date: string
  excerpt: string
  featuredImage: string
  tags: string[]
  body: string
  status: 'draft' | 'published'
  referenceCode: string
}

interface ArticleFormProps {
  mode: 'create' | 'edit'
  initialValues?: ArticleFormValues
}

export default function ArticleForm({ mode, initialValues }: ArticleFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [category, setCategory] = useState<string>(initialValues?.category ?? CATEGORIES[0])
  const [author, setAuthor] = useState(initialValues?.author ?? 'PrimeAxis Intelligence Desk')
  const [date, setDate] = useState(initialValues?.date ?? todayISODate())
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [featuredImage, setFeaturedImage] = useState(initialValues?.featuredImage ?? '')
  const [tags, setTags] = useState(initialValues?.tags.join(', ') ?? '')
  const [body, setBody] = useState(initialValues?.body ?? '')

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
      category,
      author,
      date,
      excerpt,
      featuredImage,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      body,
      status,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${initialValues!.slug}`,
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
      router.push(`/admin/articles?saved=${encodeURIComponent(data.slug ?? slug)}`)
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
          {mode === 'create' ? 'New Article' : 'Edit Article'}
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
                The slug determines the article&apos;s file and URL — it can&apos;t be changed after creation.
                {initialValues?.referenceCode && ` Reference code: ${initialValues.referenceCode}.`}
              </p>
            )}
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
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author" className={labelClasses}>Author</label>
            <input
              id="author"
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClasses}
            />
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
            <label htmlFor="excerpt" className={labelClasses}>Excerpt</label>
            <textarea
              id="excerpt"
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={`${inputClasses} resize-y`}
            />
          </div>

          <ImageUpload
            label="Featured Image"
            value={featuredImage}
            onUploadComplete={setFeaturedImage}
            required
          />

          <div>
            <label htmlFor="tags" className={labelClasses}>Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated, e.g. Ports, Nigeria, Infrastructure"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Body</label>
            <RichTextEditor value={body} onChange={setBody} />
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
              href="/admin/articles"
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
