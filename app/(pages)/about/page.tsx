import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

const FOUNDER_PHOTO_URL =
  'https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/founder/nneoma-obi-asualo.jpg'

export const metadata: Metadata = {
  title: 'About PrimeAxis | Maritime Intelligence & Strategic Communications Platform',
  description:
    "PrimeAxis serves decision-makers, policymakers, industry leaders, investors and professionals who shape the future of Africa's maritime and blue economy sectors through intelligence, analysis, strategic communication and thought leadership.",
}

const PILLARS: Array<{
  icon: ReactElement
  title: string
  description: string
  items: string[]
}> = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
      </svg>
    ),
    title: 'Intelligence',
    description:
      "Original analysis and strategic perspectives that keep Africa's maritime decision-makers ahead of the issues that matter.",
    items: [
      'Maritime policy analysis and regulatory tracking',
      'Market intelligence and sector briefings',
      'Strategic perspectives on blue economy development',
      'Industry intelligence for operators and investors',
    ],
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Engagement',
    description:
      "Structured conversations and dialogue that connect Africa's maritime leaders with the audiences and stakeholders they need to reach.",
    items: [
      'Executive conversations and leadership interviews',
      'Stakeholder dialogue and roundtable facilitation',
      'Thought leadership development and positioning',
      'Conference and event content partnerships',
    ],
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        <path d="m13 13 6 6" />
      </svg>
    ),
    title: 'Impact',
    description:
      'Strategic communications and advisory services that translate intelligence and engagement into measurable institutional outcomes.',
    items: [
      'Strategic communications planning and execution',
      'Executive visibility and reputation advisory',
      'Media advisory and content strategy',
      'Stakeholder engagement programme design',
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── About Hero + Mission/Vision — combined full-bleed section.
          Hero text sits in the top portion; Mission/Vision glass cards
          overlap the lower portion of the same background photograph. ── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-between -mt-[102px]">
        <img
          className="about-hero-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782263444566-666207da-chatgpt-image-jun-24-2026-02-05-51-am.png"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-[160px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.85), transparent)' }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(13,27,42,0.82) 0%, rgba(13,27,42,0.55) 32%, rgba(13,27,42,0.18) 55%, transparent 72%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[220px] z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.95), transparent)' }}
        />

        {/* Hero text — centred, floating in the middle of the section */}
        <div className="relative z-[3] w-full flex flex-col items-center justify-center text-center pt-[100px] pb-[60px] px-[56px] max-md:px-5">
          <AnimatedSection>
            <h1 className="font-display text-[clamp(28px,4vw,54px)] font-bold text-white leading-[1.1] max-w-[700px] mx-auto text-center mb-4">
              Shaping Africa&apos;s Maritime Conversations
            </h1>
            <p
              className="font-sans text-[15px] font-light leading-[1.6] max-w-[520px] mx-auto text-center"
              style={{ color: 'rgba(210,228,248,0.72)' }}
            >
              Intelligence and strategy for the leaders defining Africa&apos;s blue economy.
            </p>
          </AnimatedSection>
        </div>

        {/* Mission & Vision cards — anchored to the bottom of the section */}
        <div className="relative z-[3] w-full px-[56px] max-md:px-5 pb-[80px] mt-auto">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="about-hero-card p-8 max-sm:p-6">
                <span className="block font-mono text-[10px] tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--color-gold-bright)' }}>
                  Vision
                </span>
                <p className="font-display text-[clamp(17px,1.8vw,22px)] font-semibold text-white leading-[1.4]">
                  To become Africa&apos;s leading maritime intelligence and strategic communications
                  platform.
                </p>
              </div>

              <div className="about-hero-card p-8 max-sm:p-6">
                <span className="block font-mono text-[10px] tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--color-gold-bright)' }}>
                  Mission
                </span>
                <p className="font-display text-[clamp(17px,1.8vw,22px)] font-semibold text-white leading-[1.4]">
                  To inform, influence and elevate the conversations shaping Africa&apos;s maritime
                  future.
                </p>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── About PrimeAxis lead ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-center py-[80px] px-14 max-sm:px-6"
        style={{ background: '#F5F0E8' }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            top: -100,
            right: -100,
            border: '1px solid rgba(200,169,110,0.08)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            bottom: -100,
            left: -100,
            border: '1px solid rgba(200,169,110,0.08)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1240px] mx-auto">
          <AnimatedSection>
            <span
              className="block text-center font-sans text-[10px] font-medium uppercase mb-8"
              style={{ letterSpacing: '0.26em', color: '#c8a96e' }}
            >
              About PrimeAxis
            </span>

            <div className="flex items-center justify-center gap-12 mb-10">
              {[
                {
                  label: 'Intelligence',
                  svg: (
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                      <circle cx="36" cy="36" r="34" fill="#1C2B4A" stroke="#c8a96e" strokeWidth="1.5" />
                      <circle cx="36" cy="36" r="22" fill="none" stroke="rgba(200,169,110,0.25)" strokeWidth="0.8" />
                      <circle cx="36" cy="36" r="3" fill="#c8a96e" />
                      <polygon points="36,14 39,34 36,30 33,34" fill="#c8a96e" />
                      <polygon points="36,58 39,38 36,42 33,38" fill="rgba(255,255,255,0.35)" />
                      <text x="36" y="11" textAnchor="middle" fill="#c8a96e" fontSize="7" fontFamily="Georgia" fontWeight="600">N</text>
                      <text x="36" y="66" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Georgia">S</text>
                      <text x="62" y="38" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Georgia">E</text>
                      <text x="10" y="38" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Georgia">W</text>
                    </svg>
                  ),
                },
                {
                  label: 'Maritime',
                  svg: (
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                      <circle cx="36" cy="36" r="34" fill="#F0E8D8" stroke="#c8a96e" strokeWidth="1.5" />
                      <circle cx="36" cy="20" r="5" fill="none" stroke="#1C2B4A" strokeWidth="2" />
                      <line x1="36" y1="25" x2="36" y2="54" stroke="#1C2B4A" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="22" y1="30" x2="50" y2="30" stroke="#1C2B4A" strokeWidth="2" strokeLinecap="round" />
                      <path d="M36 54 Q24 52 20 46" stroke="#1C2B4A" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <path d="M36 54 Q48 52 52 46" stroke="#1C2B4A" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <circle cx="20" cy="46" r="2.5" fill="#c8a96e" />
                      <circle cx="52" cy="46" r="2.5" fill="#c8a96e" />
                      <path d="M22 30 Q18 36 20 46" stroke="#c8a96e" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.7" />
                    </svg>
                  ),
                },
                {
                  label: 'Conversations',
                  svg: (
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                      <circle cx="36" cy="36" r="34" fill="#1C2B4A" stroke="#c8a96e" strokeWidth="1.5" />
                      <rect x="29" y="18" width="14" height="22" rx="7" fill="#c8a96e" />
                      <path d="M22 37 Q22 50 36 50 Q50 50 50 37" stroke="rgba(200,169,110,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <line x1="36" y1="50" x2="36" y2="57" stroke="rgba(200,169,110,0.8)" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="57" x2="44" y2="57" stroke="rgba(200,169,110,0.8)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 28 Q14 33 16 38" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M12 24 Q9 33 12 42" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M56 28 Q58 33 56 38" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M60 24 Q63 33 60 42" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  label: 'Blue Economy',
                  svg: (
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                      <circle cx="36" cy="36" r="34" fill="#F0E8D8" stroke="#c8a96e" strokeWidth="1.5" />
                      <circle cx="36" cy="36" r="20" fill="#1C2B4A" />
                      <ellipse cx="36" cy="36" rx="20" ry="7" fill="none" stroke="rgba(200,169,110,0.35)" strokeWidth="0.8" />
                      <line x1="16" y1="36" x2="56" y2="36" stroke="rgba(200,169,110,0.35)" strokeWidth="0.8" />
                      <path d="M33 22 L38 22 L41 26 L42 30 L40 34 L42 38 L40 44 L37 48 L34 46 L31 42 L30 37 L32 33 L30 28 Z" fill="#c8a96e" opacity="0.9" />
                      <path d="M40 34 L44 36 L41 38 L40 34Z" fill="#c8a96e" opacity="0.9" />
                    </svg>
                  ),
                },
              ].map(({ label, svg }) => (
                <div key={label} className="flex flex-col items-center">
                  {svg}
                  <span
                    className="mt-3 font-sans uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      color: '#1C2B4A',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="font-display font-normal mx-auto"
              style={{
                fontSize: 'clamp(17px, 2vw, 22px)',
                lineHeight: 1.82,
                color: '#1C2B4A',
                maxWidth: 780,
              }}
            >
              PrimeAxis is a maritime intelligence and strategic communications platform dedicated
              to informing, influencing and elevating conversations shaping Africa&apos;s maritime
              future. Through insights, analysis, executive conversations and industry intelligence,
              PrimeAxis provides a credible platform for decision-makers, regulators, industry
              leaders and stakeholders across the maritime ecosystem.
            </p>

            <div
              className="mx-auto"
              style={{ width: 40, height: 2, background: '#c8a96e', marginTop: 40 }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Three Pillars — full-bleed maritime photography behind
          frosted glass cards (image dimmed + edge-faded into the page) ── */}
      <section className="relative overflow-hidden py-[72px] max-sm:py-14" style={{ background: '#0a1628' }}>
        <img
          className="pillars-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782238764166-6b82e17d-luk.png"
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'rgba(7, 16, 28, 0.58)' }} />
        <div
          className="absolute top-0 left-0 right-0 h-[120px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0d1b2a, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0d1b2a, transparent)' }}
        />
        <div className="relative z-[3] max-w-[1240px] mx-auto px-11 max-md:px-5">

          <AnimatedSection className="mb-12">
            <span
              className="block font-mono text-[10.5px] tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--color-gold-bright)' }}
            >
              What We Do
            </span>
            <h2 className="font-display text-[52px] max-sm:text-[32px] font-bold text-white leading-[1.15] max-w-[700px]">
              Three Pillars of Africa&apos;s{' '}
              <span style={{ color: 'var(--color-gold-bright)' }}>Maritime Intelligence</span> Platform
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="pillar-card p-8 max-sm:p-6 flex flex-col">
                  <div className="glass-icon-box mb-6">{pillar.icon}</div>
                  <h3 className="font-display text-[22px] font-semibold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p
                    className="font-sans text-[14px] font-light leading-[1.75] mb-5"
                    style={{ color: 'rgba(180,200,240,0.65)' }}
                  >
                    {pillar.description}
                  </p>
                  <span className="glass-divider mb-5" />
                  <ul className="glass-bullet space-y-2.5 mt-auto">
                    {pillar.items.map((item) => (
                      <li
                        key={item}
                        className="font-sans text-[13px]"
                        style={{ color: 'rgba(200,220,255,0.60)' }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* ── Founder Profile — full-bleed maritime photography behind a
          frosted-glass identity/bio card (same recipe as the Services and
          Executive Conversations photo headers) ───────────────────────── */}
      <section className="relative py-[80px] max-sm:py-14 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&q=80"
          alt="Aerial view of cargo vessel on open ocean"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1824]/90 via-[#0D1824]/60 to-transparent" />
        <div className="relative max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">

              {/* ── Left column: portrait image ───────────────────── */}
              <div className="relative w-full aspect-[4/5] rounded-sm2 overflow-hidden border border-gold/20">
                <Image
                  src={FOUNDER_PHOTO_URL}
                  alt="Nneoma Blessing Obi-Asualo, Founder and CEO of PrimeAxis"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center top' }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />

                {/* Corner label — frosted-glass-over-dark-scrim recipe,
                    same as the homepage's hero card and Executive
                    Conversations corner badge. */}
                <div
                  className="absolute top-[18px] left-[18px] px-[13px] py-[7px] border border-white/20 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(rgba(255,255,255,0.10), rgba(255,255,255,0.10)), linear-gradient(135deg, rgba(10,20,35,0.58) 0%, rgba(10,20,35,0.34) 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
                  }}
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white">
                    The Founder
                  </span>
                </div>
              </div>

              {/* ── Right column: identity + bio — silky reading card
                  sitting directly on the section's photography ────────── */}
              <div className="flex flex-col justify-center bg-white/82 backdrop-blur-sm rounded-sm2 border border-white/25 p-8 max-sm:p-6">
                <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-6">
                  The Founder
                </span>
                <h2 className="font-display text-[clamp(24px,3vw,42px)] font-semibold text-deep leading-[1.1] mb-3">
                  Nneoma Blessing Obi-Asualo
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold mb-8">
                  Founder &amp; CEO, PrimeAxis
                </p>

                {/* Bio — verbatim from brief, lightly edited for paragraph flow */}
                <div className="space-y-5">
                  <p className="font-sans text-[15.5px] text-ink leading-[1.8]">
                    Nneoma Blessing Obi-Asualo is a trained broadcast journalist, maritime
                    communications professional, and Founder &amp; CEO of PrimeAxis — a maritime
                    intelligence and strategic communications platform dedicated to informing,
                    influencing and elevating conversations shaping Africa&apos;s maritime future.
                  </p>
                  <p className="font-sans text-[15.5px] text-ink leading-[1.8]">
                    Through years of engagement with policymakers, regulators, industry leaders and
                    maritime stakeholders, she has developed a deep interest in advancing strategic
                    dialogue around maritime development, trade and logistics, port and shipping
                    operations, maritime policy and the blue economy. Her professional experience
                    spans journalism, stakeholder engagement, strategic communications and
                    industry-focused content development.
                  </p>
                  <p className="font-sans text-[15.5px] text-ink leading-[1.8]">
                    She is passionate about fostering informed discussions, promoting thought
                    leadership and contributing to conversations that support sustainable growth and
                    competitiveness across Africa&apos;s maritime sector. Through PrimeAxis, she
                    seeks to provide credible insights, executive perspectives and strategic
                    analysis that help shape the future of Africa&apos;s maritime and blue economy
                    landscape.
                  </p>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-[56px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5 text-center">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
              Start Exploring
            </span>
            <h2 className="font-display text-[clamp(22px,2.5vw,34px)] font-semibold text-deep leading-[1.15] mb-8">
              Where Would You Like to Begin?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/intelligence-hub"
                className="inline-flex items-center gap-2.5 font-sans font-semibold text-[13px] tracking-[.04em] bg-gold text-deep px-8 py-[14px] hover:bg-gold-light transition-colors duration-200"
              >
                Explore Intelligence Hub
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
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 font-sans font-semibold text-[13px] tracking-[.04em] text-teal border border-teal/30 px-8 py-[14px] hover:border-gold hover:text-gold transition-all duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  )
}
