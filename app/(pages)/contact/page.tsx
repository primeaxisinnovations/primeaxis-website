import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ContactForm from '@/components/ui/ContactForm'
import GlassOrbs from '@/components/ui/GlassOrbs'

export const metadata: Metadata = {
  title: 'Contact | PrimeAxis',
  description:
    'Reach out to PrimeAxis for collaboration, partnership enquiries, article contributions, or strategic communications support. We welcome engagement from across the maritime and blue economy ecosystem.',
}

/* ── Social icons — matching footer style ─────────────────────────── */
const SocialLinks = () => (
  <div className="flex flex-wrap gap-2">
    {/* LinkedIn */}
    <a href="#" aria-label="LinkedIn" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    </a>
    {/* X / Twitter */}
    <a href="#" aria-label="X / Twitter" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    {/* Facebook */}
    <a href="#" aria-label="Facebook" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </a>
    {/* Instagram */}
    <a href="#" aria-label="Instagram" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </a>
    {/* YouTube */}
    <a href="#" aria-label="YouTube" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    </a>
    {/* WhatsApp */}
    <a href="https://wa.me/2348029490471" aria-label="WhatsApp" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  </div>
)

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page Header — full-bleed maritime photography behind a
          frosted-glass content card ─────────────────────────────────── */}
      <section className="relative pt-[60px] pb-[72px] overflow-hidden flex justify-center">
        {/* Full-bleed CSS-cover hero (.contact-hero-bg) → next/image `fill`
            with priority (LCP) and sizes=100vw (spans the viewport). */}
        <Image
          className="contact-hero-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782612987909-6eddf98d-bu.png"
          alt="Maritime compass and vessel"
          fill
          quality={80}
          sizes="100vw"
          priority
        />
        <div
          className="absolute top-0 left-0 right-0 h-[140px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.85), transparent)' }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(13,27,42,0.90) 0%, rgba(13,27,42,0.65) 35%, rgba(13,27,42,0.22) 58%, transparent 76%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[180px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.88), transparent)' }}
        />
        <div className="relative z-[3] flex flex-col items-center text-center max-w-[680px] mx-auto px-11 max-md:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Contact
            </span>
            <h1
              className="font-display text-[clamp(28px,3.8vw,48px)] font-semibold text-white leading-[1.1] mb-5"
              style={{ whiteSpace: 'nowrap', maxWidth: 'none', textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}
            >
              Let&apos;s Start the{' '}
              <span style={{ color: '#c8a96e', fontStyle: 'italic' }}>Conversation</span>
            </h1>
            <p
              className="font-sans text-[16px] text-white/70 leading-relaxed max-w-[520px]"
              style={{ textShadow: '0 1px 14px rgba(0,0,0,0.50)' }}
            >
              Whether you are exploring collaboration, requesting our services, or have a
              perspective you want to share with Africa&apos;s maritime community — we want to
              hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Two-column: form + contact details ───────────────────── */}
      <section className="py-[72px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 max-sm:gap-12">

              {/* ── Left: contact form ──────────────────────────── */}
              <div>
                <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-7">
                  Send a Message
                </span>
                {/*
                  Suspense required by Next.js 15 App Router when a client component
                  uses useSearchParams() — prevents the static shell from blocking.
                */}
                <div className="bg-white/82 backdrop-blur-sm rounded-sm2 border border-white/25 p-8 max-sm:p-6">
                  <Suspense fallback={<div className="h-[520px] bg-border/30 animate-pulse rounded-sm2" />}>
                    <ContactForm />
                  </Suspense>
                </div>
              </div>

              {/* ── Right: contact details — orb-backed dark glass island
                  floating on the otherwise light/cream page ─────────── */}
              <div className="lg:pt-[52px]">
                <div className="relative overflow-hidden rounded-[20px]" style={{ background: '#0a1628' }}>
                  <GlassOrbs
                    orbs={[
                      { color: 'rgba(30,80,160,0.30)', size: 280, top: '-60px', left: '-60px' },
                      { color: 'rgba(100,40,160,0.20)', size: 220, bottom: '-60px', right: '-40px' },
                    ]}
                  />
                  <div className="glass-card relative p-8 max-sm:p-6">

                    {/* Direct contact */}
                    <div className="mb-10">
                      <span
                        className="block font-mono text-[10.5px] tracking-[0.2em] uppercase mb-6"
                        style={{ color: 'var(--color-gold-bright)' }}
                      >
                        Direct Contact
                      </span>
                      <div className="space-y-5">
                        <a
                          href="mailto:hello@primeaxisinnovations.com.ng"
                          className="flex items-start gap-3.5 group"
                        >
                          <div className="w-8 h-8 border border-white/20 flex items-center justify-center flex-shrink-0 text-white/60 transition-all duration-200 mt-0.5 group-hover:border-[var(--color-gold-bright)] group-hover:text-[var(--color-gold-bright)]">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-white/40 mb-0.5">Email</p>
                            <p className="font-sans text-[14px] text-white/85 transition-colors duration-200 break-all group-hover:text-[var(--color-gold-bright)]">
                              hello@primeaxisinnovations.com.ng
                            </p>
                          </div>
                        </a>

                        <a
                          href="tel:+2348029490471"
                          className="flex items-start gap-3.5 group"
                        >
                          <div className="w-8 h-8 border border-white/20 flex items-center justify-center flex-shrink-0 text-white/60 transition-all duration-200 mt-0.5 group-hover:border-[var(--color-gold-bright)] group-hover:text-[var(--color-gold-bright)]">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-white/40 mb-0.5">Phone</p>
                            <p className="font-sans text-[14px] text-white/85 transition-colors duration-200 group-hover:text-[var(--color-gold-bright)]">
                              +234 802 949 0471
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Social */}
                    <div className="mb-10">
                      <span
                        className="block font-mono text-[10.5px] tracking-[0.2em] uppercase mb-5"
                        style={{ color: 'var(--color-gold-bright)' }}
                      >
                        Follow PrimeAxis
                      </span>
                      <SocialLinks />
                    </div>

                    {/* Response time */}
                    <div className="border-t border-white/15 pt-7">
                      <p className="font-sans text-[13.5px] text-white/70 leading-relaxed">
                        <span className="text-white font-medium">Response time:</span> We aim to respond
                        to all enquiries within 2 business days.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────── */}
      <section className="bg-deep py-[56px] max-sm:py-14">
        <div className="max-w-[600px] mx-auto px-11 max-md:px-5 text-center">
          <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
            Intelligence Briefings
          </span>
          <h2 className="font-display text-[clamp(22px,2.5vw,34px)] font-semibold text-white leading-[1.15] mb-4">
            Stay Ahead of Africa&apos;s Maritime Story
          </h2>
          <p className="font-sans text-[14px] text-white/50 leading-relaxed mb-8">
            Strategic intelligence, policy analysis, and industry perspectives — direct to your
            inbox, free.
          </p>
          <div className="flex max-sm:flex-col">
            <input
              type="email"
              placeholder="Your professional email address"
              className="flex-1 font-sans text-[13.5px] px-[18px] py-[13px] border border-white/10 bg-white/5 text-white placeholder:text-white/30 outline-none focus:border-gold transition-colors duration-200"
            />
            <button
              type="submit"
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-[13px] whitespace-nowrap hover:bg-gold-light transition-colors duration-200 max-sm:w-full"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
