'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const INQUIRY_TYPES = [
  { value: 'general',      label: 'General Inquiry' },
  { value: 'services',     label: 'Service Inquiry' },
  { value: 'partnership',  label: 'Partnership & Collaboration Inquiry' },
  { value: 'media',        label: 'Media & Event Coverage Request' },
  { value: 'sponsorship',  label: 'Sponsorship & Branded Content Inquiry' },
  { value: 'visibility',   label: 'Executive Visibility & Feature Inquiry' },
  { value: 'contribution', label: 'Article Contribution' },
] as const

type InquiryValue = (typeof INQUIRY_TYPES)[number]['value']

const VALID_VALUES = new Set<string>(INQUIRY_TYPES.map((t) => t.value))

const labelClass = 'font-mono text-[10px] tracking-[0.15em] uppercase text-muted block mb-1.5'
const inputClass =
  'w-full border border-border bg-white text-ink font-sans text-[14px] px-4 py-3 placeholder:text-muted/45 focus:border-gold focus:outline-none transition-colors duration-200'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const [inquiryType, setInquiryType] = useState<InquiryValue>('general')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Pre-select dropdown from ?type= query param (set by Work With Us page links)
  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam && VALID_VALUES.has(typeParam)) {
      // Sync the deep-link inquiry type into the controlled form state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInquiryType(typeParam as InquiryValue)
    }
  }, [searchParams])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // PLACEHOLDER: Form submission is not yet connected to a live endpoint.
    // To wire this up, Nneoma should:
    //   1. Create a free account at formspree.io
    //   2. Create a new form and copy the form ID
    //   3. Replace the onSubmit handler with a fetch POST to:
    //      https://formspree.io/f/YOUR_FORM_ID
    //   Alternatively, use Netlify Forms, Getform, or any other serverless handler.
    // For now, a simulated success state is shown after a short delay.
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 700)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start py-12">
        <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 stroke-gold"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-[24px] font-semibold text-deep mb-3">
          Message received.
        </h3>
        <p className="font-sans text-[15px] text-muted leading-relaxed max-w-[400px]">
          Thank you for reaching out to PrimeAxis. We aim to respond within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Name + Email — side by side on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className="text-gold">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Organisation */}
      <div>
        <label htmlFor="contact-org" className={labelClass}>
          Organisation <span className="text-muted/50 font-sans normal-case tracking-normal text-[11px]">(optional)</span>
        </label>
        <input
          id="contact-org"
          name="organisation"
          type="text"
          placeholder="Your organisation or institution"
          className={inputClass}
        />
      </div>

      {/* Inquiry Type — pre-selected from ?type= query param */}
      <div>
        <label htmlFor="contact-type" className={labelClass}>
          Inquiry Type <span className="text-gold">*</span>
        </label>
        <div className="relative">
          <select
            id="contact-type"
            name="inquiry_type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value as InquiryValue)}
            className={`${inputClass} appearance-none cursor-pointer pr-10`}
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              viewBox="0 0 12 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-muted"
              aria-hidden="true"
            >
              <path d="M1 1l5 5 5-5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about your objective, enquiry, or the outcome you are working toward."
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2.5 font-sans font-semibold text-[13px] tracking-[.04em] bg-gold text-deep px-8 py-[14px] hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {submitting ? 'Sending…' : 'Send Message'}
        {!submitting && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        )}
      </button>

    </form>
  )
}
