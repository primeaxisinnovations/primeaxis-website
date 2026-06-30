import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy | PrimeAxis',
  description:
    'How PrimeAxis collects, uses and protects the personal information you share with us.',
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

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '16px' }}>
      {items.map((item) => (
        <li
          key={item}
          style={{ position: 'relative', paddingLeft: '20px', fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(28,43,74,0.80)', marginBottom: '8px' }}
        >
          <span
            style={{ position: 'absolute', left: 0, top: '10px', width: '5px', height: '5px', borderRadius: '50%', background: '#c8a96e' }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="font-sans text-[14px] font-light text-white/60">
          Effective Date: Launch date 2026
        </p>
      </section>

      {/* ── Content — cream ─────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E8' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '64px 48px' }} className="max-sm:!px-6">
          <Body>
            PrimeAxis respects your privacy and is committed to protecting any personal information you share with us.
          </Body>

          <Heading>Information We Collect</Heading>
          <Body>We may collect information that you voluntarily provide when you:</Body>
          <Bullets
            items={[
              'Subscribe to our newsletter',
              'Contact us through our website',
              'Register for events',
              'Submit enquiries or partnership requests',
            ]}
          />
          <Body>
            This information may include your name, email address, organisation, job title and any information you choose to provide.
          </Body>

          <Heading>Website Analytics</Heading>
          <Body>
            PrimeAxis may collect non-personal information such as browser type, device information, pages visited and website usage statistics to improve user experience and platform performance.
          </Body>

          <Heading>How We Use Your Information</Heading>
          <Body>We use the information we collect to:</Body>
          <Bullets
            items={[
              'Respond to enquiries',
              'Deliver newsletters and updates',
              'Improve our content and services',
              'Manage events and registrations',
              'Develop research and intelligence products',
            ]}
          />
          <Body>PrimeAxis does not sell personal information to third parties.</Body>

          <Heading>Cookies</Heading>
          <Body>
            Our website may use cookies and similar technologies to enhance functionality and understand visitor behaviour. You may disable cookies through your browser settings.
          </Body>

          <Heading>Third-Party Links</Heading>
          <Body>
            Our website may contain links to external websites. PrimeAxis is not responsible for the privacy practices or content of third-party websites.
          </Body>

          <Heading>Data Security</Heading>
          <Body>
            We implement reasonable administrative and technical measures to safeguard the information entrusted to us. While no online system is completely secure, we continuously work to protect user information.
          </Body>

          <Heading>Your Rights</Heading>
          <Body>You may request to:</Body>
          <Bullets
            items={[
              'Access your personal information',
              'Correct inaccurate information',
              'Unsubscribe from communications',
              'Request deletion of your information where applicable',
            ]}
          />

          <Heading>Contact</Heading>
          <Body>Questions regarding this Privacy Policy may be directed to:</Body>
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
