import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Services | PrimeAxis Maritime Intelligence',
  description:
    'PrimeAxis delivers strategic communications, thought leadership development, maritime research and intelligence, stakeholder engagement, event communications, and content and media advisory services for Africa\'s maritime and blue economy sector.',
}

// ── Service icons — matching the homepage icon set ──────────────────────────
const ICONS: Record<string, ReactElement> = {
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
}

// ── Services — names and order are final per Nneoma's brief. ─────────────────
// Descriptions, outcome bullets, and "What this includes" items below are
// original editorial content written for this page, pending Nneoma's review,
// since she did not supply her own copy for the dedicated services page.
const SERVICES: Array<{
  icon: ReactElement
  title: string
  description: string
  outcomes: string[]
}> = [
  {
    icon: ICONS.megaphone,
    title: 'Strategic Communications',
    description:
      'Integrated communications strategies that position maritime organisations as authoritative voices shaping how stakeholders and policymakers engage with them.',
    outcomes: [
      'Institutional messaging and brand narrative',
      'Multi-stakeholder programme design',
      'Crisis communications planning',
    ],
  },
  {
    icon: ICONS.lightbulb,
    title: 'Thought Leadership Development',
    description:
      'Helping executives build sustained intellectual authority through publications, commentary, and speaking — moving organisations from reactive to proactive shapers.',
    outcomes: [
      'Executive positioning and editorial development',
      'Long-form intelligence reports and op-ed placement',
      'Speaking programme and conference positioning',
    ],
  },
  {
    icon: ICONS.chart,
    title: 'Maritime Research & Intelligence',
    description:
      'Original research on African maritime markets, trade flows, and regulatory environments — providing the evidence base for strategic decisions at the institutional level.',
    outcomes: [
      'Custom market intelligence and sector analysis',
      'Regulatory landscape mapping and policy tracking',
      'Impact assessments and trade route analysis',
    ],
  },
  {
    icon: ICONS.handshake,
    title: 'Stakeholder Engagement',
    description:
      'Structured engagement programmes that build the multi-sector relationships maritime organisations need to advance policy, secure partnerships, and achieve objectives.',
    outcomes: [
      'Stakeholder mapping and influence network analysis',
      'Structured dialogue design and facilitation',
      'Government and industry coalition engagement',
    ],
  },
  {
    icon: ICONS.calendar,
    title: 'Event Communications',
    description:
      'End-to-end communications support for maritime conferences — from pre-event content strategy and media coordination to post-event knowledge capture and dissemination.',
    outcomes: [
      'Pre-event content and media management',
      'Speaker briefing and panel facilitation',
      'Post-event reporting and follow-up communications',
    ],
  },
  {
    icon: ICONS.pen,
    title: 'Content & Media Advisory',
    description:
      'Advising maritime institutions on building editorial capabilities, content systems, and media relationships to sustain long-term communications impact independently.',
    outcomes: [
      'Editorial strategy and content calendar development',
      'Media relationship and placement strategy',
      'In-house communications capacity coaching',
    ],
  },
]

// ── How We Work ─────────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We begin by understanding your objectives, stakeholders, and operating context — taking time to define the problem clearly before proposing any approach.',
  },
  {
    number: '02',
    title: 'Strategy & Execution',
    description:
      'We design a programme built specifically around your goals and execute it with rigour, adapting as your environment and priorities evolve.',
  },
  {
    number: '03',
    title: 'Delivery & Impact',
    description:
      'We deliver clear, measurable outputs and track outcomes against agreed objectives, ensuring every engagement produces demonstrable value.',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page Header — full-bleed maritime photography behind a
          frosted-glass content card (same recipe as the homepage's
          photo-backed surfaces) ───────────────────────────────────── */}
      <section className="relative pt-[60px] pb-[72px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1735774551547-0e6c38870714?w=1600&q=80&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1824]/90 via-[#0D1824]/60 to-transparent" />
        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div
              className="max-w-[680px] p-8 max-sm:p-6 border border-white/20 backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
              }}
            >
              <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
                Our Services
              </span>
              <h1 className="font-display text-[clamp(28px,4vw,54px)] font-semibold text-white leading-[1.1] max-w-[720px] mb-5">
                Strategic Services for Africa&apos;s Maritime Leaders
              </h1>
              <p className="font-sans text-[16px] text-white/70 leading-relaxed max-w-[540px]">
                We translate intelligence, access, and strategic communications expertise into
                measurable outcomes for the institutions and executives shaping Africa&apos;s
                maritime future.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Services list — full-bleed photo background behind the
          six service cards ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'transparent', padding: '80px 48px 100px' }}
      >
        <img
          className="services-section-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782354512654-3483a9f6-nv.png"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'rgba(5,12,24,0.72)' }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[160px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0d1b2a, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[160px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0d1b2a, transparent)' }}
        />
        <div className="relative z-[3]" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection>
            <span className="services-eyebrow">What We Offer</span>
            <h2
              className="font-display font-bold text-white"
              style={{ fontSize: 'clamp(32px, 3.8vw, 52px)', lineHeight: 1.10, marginBottom: '56px' }}
            >
              Strategic Services for{' '}
              <em className="italic" style={{ color: '#c8a96e' }}>Maritime Leaders</em>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((service, i) => (
                <div key={service.title} className="svc-card">
                  <span className="card-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="card-icon">{service.icon}</div>
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-body">{service.description}</p>
                  <div>
                    <span className="card-label">What This Includes</span>
                    <ul className="card-list">
                      {service.outcomes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── How We Work ──────────────────────────────────────────── */}
      <section className="py-[72px] max-sm:py-14 bg-white border-y border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">

          <AnimatedSection className="mb-12">
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
              How We Work
            </span>
            <h2 className="font-display text-[clamp(22px,2.6vw,34px)] font-semibold text-deep leading-[1.15] max-w-[480px]">
              A Structured Approach to Every Engagement
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {PROCESS_STEPS.map((step) => (
                <div key={step.title} className="bg-cream p-8 max-sm:p-6">
                  <span className="font-display text-[3.5rem] font-bold leading-none text-gold/15 block mb-6 select-none">
                    {step.number}
                  </span>
                  <h3 className="font-display text-[20px] font-semibold text-deep mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[13.5px] text-muted leading-[1.75]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="py-[80px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <div className="max-w-[640px]">
              <span className="block w-6 h-0.5 bg-gold mb-7" />
              <h2 className="font-display text-[clamp(24px,2.8vw,38px)] font-semibold text-deep leading-[1.15] mb-5">
                Not sure which service fits your objective?
              </h2>
              <p className="font-sans text-[15.5px] text-muted leading-[1.75] mb-8">
                Many of our clients come to us with a clear outcome in mind but an open question
                about the most effective path to it. Start a conversation — we will help you
                identify the right approach for where your organisation is and where it needs to go.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 font-sans font-semibold text-[13px] tracking-[.04em] bg-gold text-deep px-8 py-[14px] hover:bg-gold-light transition-colors duration-200"
                >
                  Start a Conversation
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
                <Link
                  href="/intelligence-hub"
                  className="inline-flex items-center font-sans font-semibold text-[13px] tracking-[.04em] text-teal border border-teal/30 px-8 py-[14px] hover:border-gold hover:text-gold transition-all duration-200"
                >
                  Explore Our Intelligence
                </Link>
              </div>
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
