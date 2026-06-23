import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlassOrbs from '@/components/ui/GlassOrbs'

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
const REASONS = [
  {
    title: 'An Informed, Senior Audience',
    body: "PrimeAxis is built for executives, regulators, and decision-makers — not general readers. Partners and contributors reach an audience that is already engaged with Africa's maritime agenda at a serious level.",
  },
  {
    title: 'Editorial Credibility',
    body: 'Everything published under the PrimeAxis brand is held to a consistent standard of rigour and relevance. Associating with that standard carries weight in a sector where credibility is a competitive advantage.',
  },
  {
    title: 'Africa-First by Design',
    body: "PrimeAxis was built specifically for the African maritime context — not adapted from a Western template. Partners and contributors are part of a platform that speaks to the continent's maritime leaders in a language that reflects their actual operating reality.",
  },
]

export default function WorkWithUsPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div className="max-w-[760px] bg-white/82 backdrop-blur-sm rounded-sm2 border border-white/25 p-8 max-sm:p-6">
              <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
                Work With Us
              </span>
              <h1 className="font-display text-[clamp(28px,4vw,54px)] font-semibold text-deep leading-[1.1] max-w-[720px] mb-5">
                Let&apos;s Build Africa&apos;s Maritime Future Together
              </h1>
              <p className="font-sans text-[16px] text-muted leading-relaxed max-w-[540px]">
                PrimeAxis welcomes collaboration, partnership, and contribution from across the
                maritime ecosystem — organisations, executives, researchers, and practitioners who
                share our commitment to advancing Africa&apos;s maritime future.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Four pathway cards — glassmorphism orb-backed dark environment ── */}
      <section className="relative overflow-hidden py-[72px] max-sm:py-14" style={{ background: '#0a1628' }}>
        <GlassOrbs
          orbs={[
            { color: 'rgba(30,80,160,0.40)', size: 480, top: '-110px', left: '-100px' },
            { color: 'rgba(100,40,160,0.32)', size: 380, bottom: '-90px', right: '-80px' },
            { color: 'rgba(20,120,160,0.26)', size: 280, top: '35%', left: '48%' },
            { color: 'rgba(180,130,30,0.18)', size: 220, bottom: '8%', left: '5%' },
          ]}
        />
        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PATHWAYS.map((pathway) => (
                <div key={pathway.title} className="glass-card p-8 max-sm:p-6 flex flex-col">
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
      <section className="py-[72px] max-sm:py-14 bg-white border-y border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">

          <AnimatedSection className="mb-12">
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
              Why Partner With PrimeAxis
            </span>
            <h2 className="font-display text-[clamp(22px,2.6vw,34px)] font-semibold text-deep leading-[1.15] max-w-[520px]">
              What Working With PrimeAxis Means for Your Organisation
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {REASONS.map((reason) => (
                <div key={reason.title} className="bg-cream p-8 max-sm:p-6">
                  <span className="block w-5 h-0.5 bg-gold mb-5" />
                  <h3 className="font-display text-[18px] font-semibold text-deep mb-3 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="font-sans text-[13.5px] text-muted leading-[1.75]">
                    {reason.body}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────── */}
      <section className="bg-deep py-[72px] max-sm:py-14">
        <div className="max-w-[600px] mx-auto px-11 max-sm:px-5 text-center">
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
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-[13px] whitespace-nowrap hover:bg-gold-light transition-colors duration-200"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
