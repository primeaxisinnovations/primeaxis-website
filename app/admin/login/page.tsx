'use client'

import { useState, type FormEvent } from 'react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Incorrect password.')
        setIsSubmitting(false)
        return
      }

      // Hard navigation so the request re-runs through middleware with the new cookie.
      window.location.href = '/admin'
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-[400px] bg-white border border-border shadow-card p-10 max-sm:p-7">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-deep text-2xl tracking-[0.08em] leading-none">
            PRIME<span className="text-gold">AXIS</span>
          </span>
          <p className="font-mono text-[9.5px] tracking-[0.3em] text-muted uppercase mt-1.5">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="font-sans text-[13px] text-stamp" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || password.length === 0}
            className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
