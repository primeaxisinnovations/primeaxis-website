'use client'

import { useRef, useState, type ChangeEvent } from 'react'

const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'
const urlInputClasses =
  'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'

interface ImageUploadProps {
  label: string
  value: string
  // Called with the resulting URL both when an upload finishes and when a
  // pasted URL is used instead — the parent form only ever needs the final
  // URL, regardless of which path produced it.
  onUploadComplete: (url: string) => void
  required?: boolean
}

export default function ImageUpload({ label, value, onUploadComplete, required }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInputValue, setUrlInputValue] = useState(value)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Instant local preview, before the upload even starts.
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error ?? 'Upload failed. Please try again.')
        setPreview(value)
        setIsUploading(false)
        URL.revokeObjectURL(objectUrl)
        return
      }

      setPreview(data.url)
      setUrlInputValue(data.url)
      onUploadComplete(data.url)
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
    } catch {
      setError('Upload failed — check your connection and try again.')
      setPreview(value)
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
    } finally {
      // Allow re-selecting the same file.
      e.target.value = ''
    }
  }

  function handleUrlInputChange(url: string) {
    setUrlInputValue(url)
    setError(null)
    setPreview(url)
    onUploadComplete(url)
  }

  return (
    <div>
      <label className={labelClasses}>{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        className="relative w-full border border-dashed border-border bg-cream hover:border-gold transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 px-4 py-6 text-center"
      >
        {preview ? (
          <div className="relative w-full max-w-[220px] aspect-video overflow-hidden border border-border bg-white">
            {/* Plain <img>, not next/image — must render blob: object URLs
                (instant local preview) and arbitrary pasted URLs, neither
                of which next/image's optimizer can handle. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected image preview" className="absolute inset-0 w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-deep/60 flex items-center justify-center">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white">
                  Uploading…
                </span>
              </div>
            )}
          </div>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M16 8l-4-4-4 4M12 4v12" />
          </svg>
        )}

        <p className="font-sans text-[13px] text-muted">
          {isUploading
            ? 'Uploading image…'
            : preview
              ? 'Click to choose a different image'
              : 'Click to choose an image — JPEG, PNG, or WebP, up to 5MB'}
        </p>
      </div>

      {error && (
        <p className="font-sans text-[13px] text-stamp mt-2" role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={() => setShowUrlInput((prev) => !prev)}
        className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-teal hover:text-gold transition-colors duration-150 mt-3"
      >
        {showUrlInput ? '← Use file upload instead' : 'or paste an image URL instead'}
      </button>

      {showUrlInput && (
        <input
          type="url"
          value={urlInputValue}
          onChange={(e) => handleUrlInputChange(e.target.value)}
          placeholder="https://…"
          className={`${urlInputClasses} mt-3`}
        />
      )}

      {required && !value && (
        <p className="font-sans text-[12px] text-muted mt-1.5">An image is required.</p>
      )}
    </div>
  )
}
