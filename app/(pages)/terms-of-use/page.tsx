import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Terms of Use | PrimeAxis',
  description:
    'The terms governing your access to and use of the PrimeAxis maritime intelligence platform.',
}

// ── Shared content primitives — kept local to the legal pages so their
//    exact spacing/typography spec lives in one place per page. ──────────
function Heading({ children }: { children: ReactNode }) {
  return (
    <>
      <h2
        className="font-display"
        style={{ fontSize: '20px', fontWeight: 700, color: '#1C2B4A', marginTop: '40px', marginBottom: '12px' }}
      >
        {children}
      </h2>
      <div style={{ width: '40px', height: '1px', background: '#c8a96e', margin: '8px 0 32px' }} />
    </>
  )
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(28,43,74,0.80)', marginBottom: '16px' }}>
      {children}
    </p>
  )
}

export default function TermsOfUsePage() {
  return (
    <div className="bg-cream">
      {/* ── Hero — navy, no image. -mt-[102px] cancels the root <main>
          pt-[102px] so pt-[140px] clears the fixed nav as intended. ── */}
      <section
        className="-mt-[102px] text-center px-6"
        style={{ background: '#0d1b2a', paddingTop: '140px', paddingBottom: '60px' }}
      >
        <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
          Legal
        </span>
        <h1 className="font-display text-[clamp(30px,4vw,48px)] font-bold text-white leading-[1.1] mb-3">
          Terms of Use
        </h1>
        <p className="font-sans text-[14px] font-light text-white/60">
          Effective Date: Launch date 2026
        </p>
      </section>

      {/* ── Content — cream ─────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E8' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '64px 48px' }} className="max-sm:!px-6">
          <Body>Welcome to PrimeAxis.</Body>
          <Body>By accessing this website, you agree to these Terms of Use.</Body>

          <Heading>About PrimeAxis</Heading>
          <Body>
            PrimeAxis is an African maritime intelligence, media and strategic advisory platform dedicated to advancing informed conversations on maritime trade, ports, logistics, shipping, the blue economy and related sectors.
          </Body>

          <Heading>Intellectual Property</Heading>
          <Body>
            Unless otherwise stated, all articles, research, reports, graphics, logos, branding and original content published on PrimeAxis are the intellectual property of PrimeAxis and are protected by applicable copyright laws.
          </Body>
          <Body>
            Content may not be reproduced, distributed or republished without prior written permission except where permitted by law.
          </Body>

          <Heading>Editorial Independence</Heading>
          <Body>
            Views expressed by guest contributors are those of the respective authors and do not necessarily represent the views of PrimeAxis.
          </Body>
          <Body>
            PrimeAxis is committed to factual reporting, independent analysis and responsible commentary.
          </Body>

          <Heading>Information Disclaimer</Heading>
          <Body>
            Content published on PrimeAxis is intended for general information and professional insight. While reasonable efforts are made to ensure accuracy, PrimeAxis does not guarantee the completeness or timeliness of all information.
          </Body>
          <Body>
            Users should seek professional advice before making commercial, legal or investment decisions.
          </Body>

          <Heading>External Links</Heading>
          <Body>
            PrimeAxis may reference or link to third-party websites for informational purposes. We are not responsible for the content or availability of external websites.
          </Body>

          <Heading>Limitation of Liability</Heading>
          <Body>
            PrimeAxis shall not be liable for any direct or indirect loss arising from reliance on information published on this website.
          </Body>

          <Heading>Changes</Heading>
          <Body>
            PrimeAxis reserves the right to modify these Terms of Use at any time. Updated versions will be published on this page.
          </Body>

          <Heading>Governing Law</Heading>
          <Body>
            These Terms shall be governed by the laws of the Federal Republic of Nigeria, unless otherwise stated.
          </Body>

          <Heading>Contact</Heading>
          <Body>For enquiries regarding these Terms, please contact:</Body>
          <Body>
            PrimeAxis
            <br />
            Email:{' '}
            <a href="mailto:hello@primeaxisinnovations.com.ng" style={{ color: '#c8a96e' }}>
              hello@primeaxisinnovations.com.ng
            </a>
          </Body>
        </div>
      </section>
    </div>
  )
}
