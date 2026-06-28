import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import WhyPartnerSection from '@/components/work-with-us/WhyPartnerSection'

export const metadata: Metadata = {
  title: 'Work With Us | PrimeAxis',
  description:
    "PrimeAxis welcomes collaboration, partnership, and contribution from across Africa's maritime ecosystem — whether you're exploring joint initiatives, seeking sponsorship, contributing editorial perspectives, or requesting strategic communications support.",
}

// ── Pathway cards ───────────────────────────────────────────────────────────
const PATHWAYS: Array<{
  icon: ReactElement
  title: string
  description: string
  cta: string
  href: string
  secondary?: { label: string; href: string }
}> = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Explore Collaboration Opportunities',
    description:
      "If your organisation is exploring joint initiatives, content partnerships, or other collaborative engagements with PrimeAxis, we want to hear from you. We work with maritime institutions, trade bodies, research organisations, and industry stakeholders across the African maritime ecosystem to develop programmes that deliver mutual value and advance the sector's development.",
    cta: 'Get in Touch',
    href: '/contact?type=partnership',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'Submit a Partnership Enquiry',
    description:
      "For organisations seeking a formal sponsorship arrangement, branded content integration, or event partnership with PrimeAxis, submit a structured enquiry and our team will follow up to discuss scope, audience alignment, and commercial terms. We work with maritime companies, port operators, logistics providers, and blue economy stakeholders who want to reach the decision-makers and leaders that PrimeAxis serves.",
    cta: 'Submit an Enquiry',
    href: '/contact?type=sponsorship',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Contribute an Article',
    description:
      "PrimeAxis welcomes guest perspectives from credible voices across the maritime sector — port professionals, shipping executives, policy practitioners, researchers, and blue economy advocates with something substantive to say. All contributions are subject to editorial review and must meet our standards for rigour and relevance to Africa's maritime and blue economy agenda. If you have a perspective worth sharing with our audience, we want to read it.",
    cta: 'Pitch an Article',
    href: '/contact?type=contribution',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Request Strategic Communication Support',
    description:
      "Executives and institutions requiring strategic communications advisory, thought leadership development, or research and intelligence services can reach us directly through the form below. Tell us briefly about your organisation and the outcome you are working toward — we will follow up to determine whether and how we can help.",
    cta: 'Make a Request',
    href: '/contact?type=services',
    secondary: { label: 'View our Services', href: '/services' },
  },
]

// ── Why partner with PrimeAxis ──────────────────────────────────────────────
const REASONS: Array<{ title: string; body: string; icon: ReactElement }> = [
  {
    title: 'An Informed, Senior Audience',
    body: "PrimeAxis is built for executives, regulators, and decision-makers — not general readers. Partners and contributors reach an audience that is already engaged with Africa's maritime agenda at a serious level.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Editorial Credibility',
    body: 'Everything published under the PrimeAxis brand is held to a consistent standard of rigour and relevance. Associating with that standard carries weight in a sector where credibility is a competitive advantage.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: 'Africa-First by Design',
    body: "PrimeAxis was built specifically for the African maritime context — not adapted from a Western template. Partners and contributors are part of a platform that speaks to the continent's maritime leaders in a language that reflects their actual operating reality.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
]

export default function WorkWithUsPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page Header / Hero ───────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden flex items-end"
        style={{ height: 'calc(100vh - 70px)', minHeight: '620px' }}
      >
        <img
          className="wwu-hero-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782497081687-925edf91-byyy.png"
          alt="PrimeAxis at Africa Maritime Summit"
        />
        <div
          className="absolute top-0 left-0 right-0 h-[140px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.80), transparent)' }}
        />
        <div
          className="relative z-[3] flex flex-col items-center text-center px-14 max-md:px-5"
          style={{ width: '100%', paddingBottom: '60px', marginLeft: 0 }}
        >
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5 text-center justify-center">
              Work With Us
            </span>
            <h1
              className="font-display text-[clamp(28px,4vw,54px)] font-semibold text-white leading-[1.1] mb-5 text-center mx-auto"
              style={{ maxWidth: '680px' }}
            >
              Let&apos;s Build Africa&apos;s Maritime Future Together
            </h1>
            <p
              className="font-sans text-[16px] leading-relaxed text-center mx-auto"
              style={{ color: 'rgba(255,255,255,0.72)', maxWidth: '560px' }}
            >
              Collaboration, partnership, and contribution from across Africa&apos;s maritime
              ecosystem — advancing the conversations that matter.
            </p>
          </AnimatedSection>
        </div>

        <div className="wwu-scroll-cue absolute z-[3]" style={{ bottom: '36px', right: '56px' }}>
          <span className="wwu-scroll-line" />
          Scroll
        </div>
      </section>

      {/* ── Four pathway cards — glassmorphism cards over a full-bleed photo ── */}
      <section className="relative overflow-hidden py-[72px] max-sm:py-14" style={{ background: '#0a1628' }}>
        <img
          className="wwu-cards-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782530981515-c6fa9ebf-ghjjj.png"
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'rgba(7, 14, 28, 0.60)' }} />
        <div
          className="absolute top-0 left-0 right-0 h-[130px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0d1b2a, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[130px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0d1b2a, transparent)' }}
        />
        <div className="relative z-[3] max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PATHWAYS.map((pathway) => (
                <div key={pathway.title} className="wwu-card p-8 max-sm:p-6 flex flex-col">
                  <div className="glass-icon-box mb-5">{pathway.icon}</div>
                  <h2 className="font-display text-[20px] font-semibold text-white leading-[1.2] mb-4">
                    {pathway.title}
                  </h2>
                  <p
                    className="font-sans text-[14px] font-light leading-[1.78] mb-7 flex-1"
                    style={{ color: 'rgba(180,200,240,0.65)' }}
                  >
                    {pathway.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={pathway.href}
                      className="inline-flex items-center gap-2 font-sans font-semibold text-[12.5px] tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200"
                    >
                      {pathway.cta}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </Link>
                    {pathway.secondary && (
                      <Link
                        href={pathway.secondary.href}
                        className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/60 hover:text-[var(--color-gold-bright)] transition-colors duration-200"
                      >
                        {pathway.secondary.label} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Why Partner With PrimeAxis ───────────────────────────── */}
      <WhyPartnerSection reasons={REASONS} />

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
