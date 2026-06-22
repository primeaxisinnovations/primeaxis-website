import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import StampSeal from '@/components/ui/StampSeal'

// PLACEHOLDER: set this to the real path (e.g.
// "/images/founder/nneoma-obi-asualo.jpg") once Nneoma's photograph is
// available. The Founder Profile section below switches automatically:
// the gradient/initials placeholder becomes a real <Image>, and the
// corner label switches from a simple solid tag to the same frosted-
// glass-over-dark-scrim treatment already proven on the homepage's hero
// and Executive Conversations cards. Glass only makes sense once there's
// a real photo behind it to blur — hence the conditional, not a flat swap.
const FOUNDER_PHOTO_URL: string | null = null

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
        className="w-7 h-7 stroke-teal"
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
        className="w-7 h-7 stroke-teal"
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
        className="w-7 h-7 stroke-teal"
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

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              About PrimeAxis
            </span>
            <h1 className="font-display text-[clamp(28px,4vw,54px)] font-semibold text-deep leading-[1.1] max-w-[760px]">
              Shaping the Conversations That Define Africa&apos;s Maritime Future
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Vision & Mission ─────────────────────────────────────── */}
      {/* Silky reading container — bg-white/85 + backdrop-blur-sm, the
          translucent light-card treatment used for every text-heavy
          section across the interior pages. */}
      <section className="bg-white border-b border-border py-[56px] max-sm:py-10">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="p-8 max-sm:p-6 bg-white/85 backdrop-blur-sm rounded-sm2 border border-white/20">
                <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-gold mb-4">
                  Vision
                </span>
                <p className="font-display text-[clamp(17px,1.8vw,22px)] font-semibold text-deep leading-[1.4]">
                  To become Africa&apos;s leading maritime intelligence and strategic communications
                  platform.
                </p>
              </div>

              <div className="p-8 max-sm:p-6 bg-white/85 backdrop-blur-sm rounded-sm2 border border-white/20">
                <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-gold mb-4">
                  Mission
                </span>
                <p className="font-display text-[clamp(17px,1.8vw,22px)] font-semibold text-deep leading-[1.4]">
                  To inform, influence and elevate the conversations shaping Africa&apos;s maritime
                  future.
                </p>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── About PrimeAxis lead ─────────────────────────────────── */}
      <section className="py-[72px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <p className="font-sans text-[18px] font-medium text-ink leading-[1.8] max-w-[680px]">
              PrimeAxis is a maritime intelligence and strategic communications platform dedicated
              to informing, influencing and elevating conversations shaping Africa&apos;s maritime
              future. Through insights, analysis, executive conversations and industry intelligence,
              PrimeAxis provides a credible platform for decision-makers, regulators, industry
              leaders and stakeholders across the maritime ecosystem.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Three Pillars ────────────────────────────────────────── */}
      <section className="py-[72px] max-sm:py-14 bg-white border-y border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">

          <AnimatedSection className="mb-12">
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
              What We Do
            </span>
            <h2 className="font-display text-[clamp(22px,2.6vw,34px)] font-semibold text-deep leading-[1.15] max-w-[480px]">
              Three Pillars of Africa&apos;s Maritime Intelligence Platform
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="bg-white/85 backdrop-blur-sm rounded-sm2 border border-white/20 p-8 max-sm:p-6 flex flex-col">
                  <StampSeal size={64} className="mb-6">{pillar.icon}</StampSeal>
                  <h3 className="font-display text-[21px] font-semibold text-deep mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[13.5px] text-muted leading-[1.75] mb-6">
                    {pillar.description}
                  </p>
                  <ul className="space-y-2.5 mt-auto">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-sans text-[13px] text-muted">
                        <span className="w-[5px] h-[5px] rounded-full bg-gold mt-[6px] flex-shrink-0" />
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
          src="https://images.unsplash.com/photo-1724862574576-55c24a3d44bd?w=1600&q=80&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1824]/90 via-[#0D1824]/60 to-transparent" />
        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">

              {/* ── Left column: portrait image ───────────────────── */}
              <div className="relative w-full aspect-[4/5] rounded-sm2 overflow-hidden border border-gold/20">
                {FOUNDER_PHOTO_URL ? (
                  <Image
                    src={FOUNDER_PHOTO_URL}
                    alt="Nneoma Blessing Obi-Asualo"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal to-deep">
                    <span
                      className="font-display font-semibold text-white/80 tracking-widest select-none"
                      style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
                      aria-label="Nneoma Blessing Obi-Asualo"
                    >
                      NBO
                    </span>
                  </div>
                )}

                {/* Corner label — solid against the placeholder gradient
                    (nothing real to blur yet). Once FOUNDER_PHOTO_URL above
                    is set to a real photo, this switches to the same
                    frosted-glass-over-dark-scrim recipe as the homepage's
                    hero card and Executive Conversations corner badge. */}
                {FOUNDER_PHOTO_URL ? (
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
                ) : (
                  <div className="absolute top-[18px] left-[18px] px-[13px] py-[7px] bg-deep/85">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-gold">
                      The Founder
                    </span>
                  </div>
                )}
              </div>

              {/* ── Right column: identity + bio — frosted-glass card
                  sitting directly on the section's photography ────────── */}
              <div
                className="flex flex-col justify-center p-8 max-sm:p-6 border border-white/20 backdrop-blur-md"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
                }}
              >
                <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-6">
                  The Founder
                </span>
                <h2 className="font-display text-[clamp(24px,3vw,42px)] font-semibold text-white leading-[1.1] mb-3">
                  Nneoma Blessing Obi-Asualo
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold mb-8">
                  Founder &amp; CEO, PrimeAxis
                </p>

                {/* Bio — verbatim from brief, lightly edited for paragraph flow */}
                <div className="space-y-5">
                  <p className="font-sans text-[15.5px] text-white/80 leading-[1.8]">
                    Nneoma Blessing Obi-Asualo is a trained broadcast journalist, maritime
                    communications professional, and Founder &amp; CEO of PrimeAxis — a maritime
                    intelligence and strategic communications platform dedicated to informing,
                    influencing and elevating conversations shaping Africa&apos;s maritime future.
                  </p>
                  <p className="font-sans text-[15.5px] text-white/80 leading-[1.8]">
                    Through years of engagement with policymakers, regulators, industry leaders and
                    maritime stakeholders, she has developed a deep interest in advancing strategic
                    dialogue around maritime development, trade and logistics, port and shipping
                    operations, maritime policy and the blue economy. Her professional experience
                    spans journalism, stakeholder engagement, strategic communications and
                    industry-focused content development.
                  </p>
                  <p className="font-sans text-[15.5px] text-white/80 leading-[1.8]">
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

      {/* ── Platform Positioning pull-quote ──────────────────────── */}
      <section className="bg-deep py-[80px] max-sm:py-14">
        <div className="max-w-[900px] mx-auto px-11 max-sm:px-5 text-center">
          <AnimatedSection>
            <span className="block w-8 h-0.5 bg-gold mx-auto mb-10" />
            <p className="font-display text-[clamp(17px,2vw,26px)] text-white leading-[1.65]">
              PrimeAxis serves{' '}
              <span className="text-gold font-semibold">
                decision-makers, policymakers, industry leaders, investors and professionals
              </span>{' '}
              who shape the future of Africa&apos;s maritime and blue economy sectors — through
              intelligence, analysis, strategic communication and thought leadership.
            </p>
            <span className="block w-8 h-0.5 bg-gold mx-auto mt-10" />
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-[72px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 text-center">
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
