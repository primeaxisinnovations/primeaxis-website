'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

const inputClasses =
  'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'
const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'

interface QAPair {
  question: string
  answer: string
}

export interface ConversationFormValues {
  executiveName: string
  title: string
  slug: string
  position: string
  organisation: string
  photo: string
  initials: string
  excerpt: string
  date: string
  qa: QAPair[]
  status: 'draft' | 'published'
  transcriptRef: string
  introduction: string
  pullQuote: string
  closingQuote: string
  editorsNote: string
}

interface ConversationFormProps {
  mode: 'create' | 'edit'
  initialValues?: ConversationFormValues
}

export default function ConversationForm({ mode, initialValues }: ConversationFormProps) {
  const router = useRouter()

  const [executiveName, setExecutiveName] = useState(initialValues?.executiveName ?? '')
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [position, setPosition] = useState(initialValues?.position ?? '')
  const [organisation, setOrganisation] = useState(initialValues?.organisation ?? '')
  const [photo, setPhoto] = useState(initialValues?.photo ?? '')
  const [initials, setInitials] = useState(initialValues?.initials ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [date, setDate] = useState(initialValues?.date ?? todayISODate())
  const [introduction, setIntroduction] = useState(initialValues?.introduction ?? '')
  const [pullQuote, setPullQuote] = useState(initialValues?.pullQuote ?? '')
  const [closingQuote, setClosingQuote] = useState(initialValues?.closingQuote ?? '')
  const [editorsNote, setEditorsNote] = useState(initialValues?.editorsNote ?? '')
  const [qa, setQa] = useState<QAPair[]>(
    initialValues?.qa && initialValues.qa.length > 0 ? initialValues.qa : [{ question: '', answer: '' }]
  )

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleExecutiveNameChange(value: string) {
    setExecutiveName(value)
    if (!slugManuallyEdited) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true)
    setSlug(value)
  }

  function updateQuestion(index: number, value: string) {
    setQa((prev) => prev.map((pair, i) => (i === index ? { ...pair, question: value } : pair)))
  }

  function updateAnswer(index: number, value: string) {
    setQa((prev) => prev.map((pair, i) => (i === index ? { ...pair, answer: value } : pair)))
  }

  function addQuestion() {
    setQa((prev) => [...prev, { question: '', answer: '' }])
  }

  function removeQuestion(index: number) {
    setQa((prev) => prev.filter((_, i) => i !== index))
  }

  async function submit(status: 'draft' | 'published') {
    setError(null)
    setIsSubmitting(true)

    const payload = {
      executiveName,
      title,
      slug,
      position,
      organisation,
      photo,
      initials,
      excerpt,
      date,
      introduction,
      pullQuote,
      closingQuote,
      editorsNote,
      qa,
      status,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/conversations' : `/api/admin/conversations/${initialValues!.slug}`,
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
      router.push(`/admin/conversations?saved=${encodeURIComponent(data.slug ?? slug)}`)
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
          {mode === 'create' ? 'New Conversation' : 'Edit Conversation'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-border p-8 max-sm:p-5 flex flex-col gap-6">
          <div>
            <label htmlFor="executiveName" className={labelClasses}>Executive Name</label>
            <input
              id="executiveName"
              type="text"
              required
              value={executiveName}
              onChange={(e) => handleExecutiveNameChange(e.target.value)}
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
                The slug determines the conversation&apos;s file and URL — it can&apos;t be changed after creation.
                {initialValues?.transcriptRef && ` Transcript ref: ${initialValues.transcriptRef}.`}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className={labelClasses}>Title (pull-quote headline)</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="position" className={labelClasses}>Position</label>
            <input
              id="position"
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="organisation" className={labelClasses}>Organisation</label>
            <input
              id="organisation"
              type="text"
              required
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
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

          <div>
            <label htmlFor="initials" className={labelClasses}>Initials (avatar fallback)</label>
            <input
              id="initials"
              type="text"
              required
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              maxLength={4}
              className={inputClasses}
            />
          </div>

          <ImageUpload
            label="Photo"
            value={photo}
            onUploadComplete={setPhoto}
            required
          />

          <div>
            <label className={labelClasses}>Introduction (optional)</label>
            <RichTextEditor value={introduction} onChange={setIntroduction} />
            <p className="font-sans text-[12px] text-muted mt-1.5">
              Lead-in copy shown directly below the hero, above the Q&amp;A. Leave empty to skip
              this section entirely on the published page.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <label className={labelClasses}>Questions &amp; Answers</label>
              <button
                type="button"
                onClick={addQuestion}
                className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150"
              >
                + Add Question
              </button>
            </div>

            {qa.map((pair, index) => (
              <div key={index} className="border border-border p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-gold">
                    Q{index + 1}
                  </span>
                  {qa.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-stamp hover:text-deep transition-colors duration-150"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor={`question-${index}`} className={labelClasses}>Question</label>
                  <textarea
                    id={`question-${index}`}
                    required
                    rows={2}
                    value={pair.question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    className={`${inputClasses} resize-y`}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Answer</label>
                  <RichTextEditor value={pair.answer} onChange={(html) => updateAnswer(index, html)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="pullQuote" className={labelClasses}>Pull Quote (optional)</label>
            <textarea
              id="pullQuote"
              rows={2}
              value={pullQuote}
              onChange={(e) => setPullQuote(e.target.value)}
              placeholder="A short standout line, displayed large as the Q&A section opens."
              className={`${inputClasses} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="closingQuote" className={labelClasses}>Closing Quote (optional)</label>
            <textarea
              id="closingQuote"
              rows={2}
              value={closingQuote}
              onChange={(e) => setClosingQuote(e.target.value)}
              placeholder="A short standout line, displayed large near the end of the page."
              className={`${inputClasses} resize-y`}
            />
          </div>

          <div>
            <label className={labelClasses}>Editor&apos;s Note (optional)</label>
            <RichTextEditor value={editorsNote} onChange={setEditorsNote} />
            <p className="font-sans text-[12px] text-muted mt-1.5">
              Shown in a distinct callout box near the end of the page. Leave empty to omit it.
            </p>
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
              href="/admin/conversations"
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
