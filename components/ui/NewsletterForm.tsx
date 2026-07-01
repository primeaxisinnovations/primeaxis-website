'use client'

import { useState } from 'react'

// Two visual variants matching the two existing newsletter treatments already
// on the site — styling is reproduced verbatim so nothing is redesigned:
//   • 'dark'  — gold button on the deep-navy CTA band (article/conversation
//               detail, work-with-us, contact pages)
//   • 'light' — deep button on the cream homepage newsletter section
type Variant = 'dark' | 'light'

const VARIANTS: Record<
  Variant,
  { form: string; input: string; button: string; success: string; error: string }
> = {
  dark: {
    form: 'flex max-sm:flex-col',
    input:
      'flex-1 font-sans text-[13.5px] px-[18px] py-[13px] border border-white/10 bg-white/5 text-white placeholder:text-white/30 outline-none focus:border-gold transition-colors duration-200 disabled:opacity-60',
    button:
      'font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-[13px] whitespace-nowrap hover:bg-gold-light transition-colors duration-200 max-sm:w-full disabled:opacity-60 disabled:cursor-not-allowed',
    success: 'font-mono text-[10px] tracking-[0.12em] uppercase text-gold mt-3',
    error: 'font-mono text-[10px] tracking-[0.12em] uppercase text-red-300 mt-3',
  },
  light: {
    form: 'flex max-sm:flex-col max-w-[460px] mx-auto mb-[14px]',
    input:
      'flex-1 font-sans text-[13.5px] px-[18px] py-[13px] border border-cream-dark max-sm:border-r border-r-0 bg-white text-ink outline-none focus:border-gold placeholder:text-muted transition-colors duration-200 disabled:opacity-60',
    button:
      'font-sans text-[13px] font-semibold tracking-[.04em] bg-deep text-white px-6 py-[13px] whitespace-nowrap hover:bg-teal transition-colors duration-200 max-sm:w-full disabled:opacity-60 disabled:cursor-not-allowed',
    success: 'font-mono text-[10px] tracking-[0.12em] uppercase text-deep mt-2',
    error: 'font-mono text-[10px] tracking-[0.12em] uppercase text-red-600 mt-2',
  },
}

export default function NewsletterForm({ variant = 'dark' }: { variant?: Variant }) {
  const styles = VARIANTS[variant]
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="Your professional email address"
          aria-label="Email address"
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Subscribing…' : 'Subscribe Free'}
        </button>
      </form>
      {success && (
        <p className={styles.success} role="status">
          Thanks for subscribing! Check your inbox.
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </>
  )
}
