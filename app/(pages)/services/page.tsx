import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import StampSeal from '@/components/ui/StampSeal'

export const metadata: Metadata = {
  title: 'Services | PrimeAxis Maritime Intelligence',
  description:
    'PrimeAxis delivers strategic communications, thought leadership development, maritime research and intelligence, stakeholder engagement, event communications, and content and media advisory services for Africa\'s maritime and blue economy sector.',
}

// ── Service icons — matching the homepage icon set ──────────────────────────
const ICONS: Record<string, ReactElement> = {
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 stroke-teal" aria-hidden="true">
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
      "We develop and execute integrated communications strategies that position maritime organisations, port authorities, and blue economy institutions as authoritative voices in their sectors. Our approach builds the messaging architecture, stakeholder mapping, and channel strategy your institution needs to shape how decision-makers, investors, and regulators perceive and engage with you — moving well beyond reactive press releases. Whether you are navigating a policy shift, managing institutional transition, or establishing presence in a new market segment, we ensure your communications are strategically aligned with your objectives and credible to an expert maritime audience.",
    outcomes: [
      'Institutional positioning strategy and messaging framework',
      'Multi-stakeholder communications programme design',
      'Crisis communications protocol and rapid response planning',
    ],
  },
  {
    icon: ICONS.lightbulb,
    title: 'Thought Leadership Development',
    description:
      "In a sector where credibility is built through sustained intellectual presence, we help maritime executives and institutions build the authority their roles demand. We develop the research-backed publications, executive commentary, and speaking programmes that establish your voice as essential reading for policymakers, investors, and industry peers across Africa's maritime landscape. The result is not simply visibility — it is the kind of earned authority that shapes policy conversations, attracts strategic partnerships, and distinguishes your institution in a competitive environment where reputation is a strategic asset.",
    outcomes: [
      'Executive positioning strategy and editorial voice development',
      'Long-form intelligence reports, white papers, and op-ed placement',
      'Speaking programme design and conference brief preparation',
    ],
  },
  {
    icon: ICONS.chart,
    title: 'Maritime Research & Intelligence',
    description:
      "Decisions made without sound market intelligence carry disproportionate risk in Africa's evolving maritime landscape. We produce original, rigorously researched analysis on African maritime markets, trade flows, regulatory environments, and blue economy opportunities — providing the evidence base that supports strategic investment, policy design, and commercial planning. Our work is calibrated for executive audiences: concise, actionable, and grounded in the institutional and political realities that determine what is achievable within the African maritime operating environment.",
    outcomes: [
      'Custom market intelligence reports and sector analysis',
      'Regulatory landscape mapping across African jurisdictions',
      'Policy impact assessments and trade route analysis',
    ],
  },
  {
    icon: ICONS.handshake,
    title: 'Stakeholder Engagement',
    description:
      "The outcomes that matter most in the maritime sector — policy change, market access, regulatory reform, strategic partnership — are achieved through structured relationships and deliberate dialogue, not documentation alone. We design and manage engagement programmes that identify the stakeholders your organisation needs to reach, develop the formats through which to engage them, and sustain the relationships that convert initial contact into durable influence. Our approach ensures your engagement is well-sequenced, strategically positioned, and oriented toward the specific policy or commercial outcomes you are pursuing.",
    outcomes: [
      'Stakeholder mapping and influence network analysis',
      'Structured dialogue design, facilitation, and follow-through',
      'Government, regulatory body, and industry coalition engagement',
    ],
  },
  {
    icon: ICONS.calendar,
    title: 'Event Communications',
    description:
      "Maritime conferences and industry summits are among the most concentrated opportunities for institutional positioning in the sector — but only when the communications surrounding them are as carefully planned as the event itself. We provide end-to-end support: pre-event narrative development and media coordination, in-event content delivery and speaker briefing, and post-event knowledge dissemination that extends impact beyond the room. Every engagement your institution participates in becomes a communications asset, not just a calendar obligation.",
    outcomes: [
      'Pre-event narrative development and media accreditation management',
      'Speaker briefing, panel facilitation support, and in-event content',
      'Post-event reporting, media coverage, and follow-up communications',
    ],
  },
  {
    icon: ICONS.pen,
    title: 'Content & Media Advisory',
    description:
      "Sustained communications impact in the maritime sector requires institutional capability — the editorial systems, media relationships, and in-house capacity to produce authoritative content consistently without dependence on external agencies for every output. We advise maritime organisations on building these foundations: defining editorial strategy aligned with institutional priorities, developing content architecture across channels, and equipping in-house teams to execute independently. The outcome is a communications function that compounds in value over time rather than resetting with each new engagement.",
    outcomes: [
      'Editorial strategy and content calendar development',
      'Maritime media relationship building and placement strategy',
      'In-house communications team capacity development and coaching',
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

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="bg-cream pt-[60px] pb-[72px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5">
              Our Services
            </span>
            <h1 className="font-display text-[clamp(28px,4vw,54px)] font-semibold text-deep leading-[1.1] max-w-[720px] mb-5">
              Strategic Services for Africa&apos;s Maritime Leaders
            </h1>
            <p className="font-sans text-[16px] text-muted leading-relaxed max-w-[540px]">
              We translate intelligence, access, and strategic communications expertise into
              measurable outcomes for the institutions and executives shaping Africa&apos;s
              maritime future.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Services list ────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <AnimatedSection>
            {SERVICES.map((service, i) => (
              <div key={service.title} className={`py-[56px] max-sm:py-10 ${i < SERVICES.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="grid grid-cols-[72px_1fr] gap-x-10 gap-y-6 max-sm:grid-cols-1 max-sm:gap-x-0">

                  {/* Left: seal */}
                  <div className="pt-1 flex flex-col gap-5 max-sm:flex-row max-sm:items-center max-sm:gap-4">
                    <StampSeal size={64}>{service.icon}</StampSeal>
                  </div>

                  {/* Right: name, description, outcomes */}
                  <div>
                    <h2 className="font-display text-[clamp(21px,2.4vw,30px)] font-semibold text-deep leading-[1.15] mb-5">
                      {service.title}
                    </h2>
                    <p className="font-sans text-[15.5px] text-muted leading-[1.8] max-w-[640px] mb-7">
                      {service.description}
                    </p>
                    <div>
                      <span className="block font-mono text-[10px] tracking-[0.18em] uppercase text-gold mb-3">
                        What This Includes
                      </span>
                      <ul className="space-y-2.5">
                        {service.outcomes.map((item) => (
                          <li key={item} className="flex items-start gap-3 font-sans text-[13.5px] text-muted">
                            <span className="w-[5px] h-[5px] rounded-full bg-gold mt-[7px] flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            ))}
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
