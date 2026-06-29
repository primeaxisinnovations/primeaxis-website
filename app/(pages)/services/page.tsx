import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HowWeWorkSection from '@/components/services/HowWeWorkSection'

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
const PROCESS_STEPS: Array<{ title: string; description: string; icon: ReactElement }> = [
  {
    title: 'Discovery',
    description:
      'We begin by understanding your objectives, stakeholders, and operating context — taking time to define the problem clearly before proposing any approach.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
      </svg>
    ),
  },
  {
    title: 'Strategy & Execution',
    description:
      'We design a programme built specifically around your goals and execute it with rigour, adapting as your environment and priorities evolve.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="3" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="21" />
        <line x1="3" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="21" y2="12" />
        <line x1="5.64" y1="5.64" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="18.36" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="16.24" y2="7.76" />
        <line x1="7.76" y1="16.24" x2="5.64" y2="18.36" />
      </svg>
    ),
  },
  {
    title: 'Delivery & Impact',
    description:
      'We deliver clear, measurable outputs and track outcomes against agreed objectives, ensuring every engagement produces demonstrable value.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="8" x2="12" y2="20" />
        <path d="M5 12 Q5 19 12 19 Q19 19 19 12" />
        <line x1="8" y1="10" x2="16" y2="10" />
      </svg>
    ),
  },
]

// ── Who We Serve ────────────────────────────────────────────────────────────
const WHO_WE_SERVE_CARDS = [
  {
    badge: 'GOVERNMENT',
    image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&q=80',
    title: 'Government & Regulators',
    body: "Port authorities, maritime ministries, and regulatory bodies shaping Africa's blue economy policy and governance.",
  },
  {
    badge: 'INDUSTRY',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    title: 'Shipping & Port Executives',
    body: 'CEOs, directors, and operators driving commercial maritime activity across African trade corridors and port systems.',
  },
  {
    badge: 'FINANCE',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    title: 'Investors & Finance',
    body: 'Private equity, development finance, and institutional investors navigating blue economy opportunities across African markets.',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Who We Serve — header row + three image cards ──────── */}
      <section
        className="relative overflow-hidden px-14 max-md:px-5"
        style={{ background: '#F5F0E8', paddingTop: '72px', paddingBottom: '72px' }}
      >
        <div className="services-who-circle-1" aria-hidden="true" />
        <div className="services-who-circle-2" aria-hidden="true" />

        <div className="relative max-w-[1240px] mx-auto">
          <AnimatedSection>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="services-who-eyebrow"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                Who We Serve
              </span>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: '#1C2B4A',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Built for the leaders shaping{' '}
                <em style={{ color: '#c8a96e', fontStyle: 'italic' }}>Africa&apos;s seas</em>
              </h2>
              <p
                className="font-sans"
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.80,
                  color: 'rgba(28,43,74,0.68)',
                  textAlign: 'center',
                  maxWidth: '520px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '52px',
                }}
              >
                PrimeAxis serves the decision-makers, policymakers, and executives who drive
                Africa&apos;s maritime and blue economy sectors forward.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {WHO_WE_SERVE_CARDS.map((card) => (
                <div key={card.title} className="services-who-card">
                  <div className="services-who-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.title} />
                    <div className="services-who-card-overlay" />
                    <span className="services-who-badge">{card.badge}</span>
                  </div>
                  <div className="services-who-card-body">
                    <h3 className="services-who-card-title">{card.title}</h3>
                    <p className="services-who-card-text">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Services heading + six service cards — single shared
          full-bleed photo background, no seam between heading and cards ── */}
      <section
        className="relative overflow-hidden px-12 max-md:px-5"
        style={{ background: 'transparent', paddingTop: '64px', paddingBottom: '72px' }}
      >
        <img
          className="services-section-bg"
          src="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com/uploads/1782354512654-3483a9f6-nv.png"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'rgba(5,12,26,0.42)' }}
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
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2
                className="font-display font-bold text-white"
                style={{
                  fontSize: 'clamp(32px, 3.8vw, 52px)',
                  lineHeight: 1.10,
                  marginBottom: '20px',
                  textAlign: 'center',
                  maxWidth: '680px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Strategic Services for{' '}
                <em className="italic" style={{ color: '#c8a96e' }}>Maritime Leaders</em>
              </h2>
              <p
                className="font-sans text-[16px] text-white/70 leading-relaxed"
                style={{ textAlign: 'center', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '56px' }}
              >
                We translate{' '}
                <span style={{ color: '#c8a96e', fontWeight: 400 }}>
                  intelligence, access, and strategic communications expertise
                </span>{' '}
                into measurable outcomes for the{' '}
                <span style={{ color: '#c8a96e', fontWeight: 400 }}>
                  institutions and executives
                </span>{' '}
                shaping Africa&apos;s maritime future.
              </p>
            </div>
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
      <HowWeWorkSection steps={PROCESS_STEPS} />

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="py-[56px] max-sm:py-14 bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection>
            <div className="max-w-[640px] mx-auto flex flex-col items-center text-center">
              <span className="block w-6 h-0.5 bg-gold mb-7" />
              <h2 className="font-display text-[clamp(24px,2.8vw,38px)] font-semibold text-deep leading-[1.15] mb-5 text-center">
                Not sure which service fits your objective?
              </h2>
              <p className="font-sans text-[15.5px] text-muted leading-[1.75] mb-8 text-center max-w-[580px] mx-auto">
                Many of our clients come to us with a clear outcome in mind but an open question
                about the most effective path to it. Start a conversation — we will help you
                identify the right approach for where your organisation is and where it needs to go.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
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

    </div>
  )
}
