'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import type { Event, EventGalleryItem } from '@/types'

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

const inputClasses =
  'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'
const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'

const CATEGORY_OPTIONS: Array<{ value: Event['category']; label: string }> = [
  { value: 'conference', label: 'Conference' },
  { value: 'summit', label: 'Summit' },
  { value: 'press-briefing', label: 'Press Briefing' },
]

export interface EventFormValues {
  title: string
  slug: string
  date: string
  category: Event['category']
  status: Event['status']
  description: string
  coverImage: string
  gallery: EventGalleryItem[]
}

interface EventFormProps {
  mode: 'create' | 'edit'
  initialValues?: EventFormValues
}

export default function EventForm({ mode, initialValues }: EventFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [date, setDate] = useState(initialValues?.date ?? todayISODate())
  const [category, setCategory] = useState<Event['category']>(initialValues?.category ?? 'conference')
  const [status, setStatus] = useState<Event['status']>(initialValues?.status ?? 'draft')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? '')
  const [gallery, setGallery] = useState<EventGalleryItem[]>(initialValues?.gallery ?? [])

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

  function addGalleryItem() {
    setGallery((prev) => [...prev, { url: '', type: 'image' }])
  }

  function removeGalleryItem(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  function updateGalleryItem(index: number, patch: Partial<EventGalleryItem>) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Drop gallery rows the editor added but never gave a URL.
    const cleanedGallery = gallery
      .filter((item) => item.url.trim().length > 0)
      .map((item) => ({
        url: item.url.trim(),
        type: item.type,
        caption: item.caption && item.caption.trim().length > 0 ? item.caption.trim() : undefined,
      }))

    const payload = {
      slug,
      title,
      date,
      category,
      status,
      description,
      coverImage,
      gallery: cleanedGallery,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/events' : `/api/admin/events/${initialValues!.slug}`,
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
      router.push(`/admin/events?saved=${encodeURIComponent(data.slug ?? slug)}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[760px] mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
        <h1 className="font-display text-[28px] font-semibold text-deep mb-8">
          {mode === 'create' ? 'New Event' : 'Edit Event'}
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
                The slug determines the event&apos;s file and URL — it can&apos;t be changed after creation.
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
              onChange={(e) => setCategory(e.target.value as Event['category'])}
              className={inputClasses}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>Status</label>
            <select
              id="status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value as Event['status'])}
              className={inputClasses}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea
              id="description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClasses} resize-y`}
            />
          </div>

          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onUploadComplete={setCoverImage}
            required
          />

          {/* ── Gallery items ──────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={labelClasses + ' mb-0'}>Gallery</span>
              <button
                type="button"
                onClick={addGalleryItem}
                className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150"
              >
                + Add Gallery Item
              </button>
            </div>

            {gallery.length === 0 ? (
              <p className="font-sans text-[12.5px] text-muted">
                No gallery items yet. Add images or videos to build the lightbox gallery.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {gallery.map((item, index) => (
                  <div key={index} className="border border-border bg-cream p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
                        Item {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index)}
                        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-stamp hover:text-deep transition-colors duration-150"
                      >
                        Remove
                      </button>
                    </div>

                    <ImageUpload
                      label={item.type === 'video' ? 'Video' : 'Image'}
                      value={item.url}
                      onUploadComplete={(url) => updateGalleryItem(index, { url })}
                    />

                    <div>
                      <span className={labelClasses}>Type</span>
                      <div className="flex items-center gap-2">
                        {(['image', 'video'] as const).map((t) => {
                          const active = item.type === t
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => updateGalleryItem(index, { type: t })}
                              className={
                                active
                                  ? 'font-mono text-[10.5px] tracking-[0.1em] uppercase px-4 py-2 bg-deep text-cream border border-deep transition-colors duration-150'
                                  : 'font-mono text-[10.5px] tracking-[0.1em] uppercase px-4 py-2 text-muted border border-border hover:border-deep transition-colors duration-150'
                              }
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`caption-${index}`} className={labelClasses}>Caption (optional)</label>
                      <input
                        id={`caption-${index}`}
                        type="text"
                        value={item.caption ?? ''}
                        onChange={(e) => updateGalleryItem(index, { caption: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="font-sans text-[13px] text-stamp" role="alert">{error}</p>
          )}

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-7 py-3 hover:bg-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Save Event'}
            </button>
            <a
              href="/admin/events"
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
