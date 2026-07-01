import Link from 'next/link'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, categoryToSlug } from '@/lib/categories'

/* ── Inline SVG brand icons (lucide-react v1 removed social brand icons) ── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
)

/* ── Data ───────────────────────────────────────────────────── */
const platformLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Intelligence Hub', href: '/intelligence-hub' },
  { label: 'Executive Conversations', href: '/executive-conversations' },
  { label: 'Services', href: '/services' },
  { label: 'Work With Us', href: '/work-with-us' },
  { label: 'Contact', href: '/contact' },
]

const intelligenceLinks = [
  ...CATEGORIES.slice(0, 5).map((cat) => ({
    label: cat,
    href: `/intelligence-hub?category=${categoryToSlug(cat)}`,
  })),
  { label: 'All Categories', href: '/intelligence-hub' },
]

const socialLinks = [
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/company/primeaxisnews/about/?viewAsMember=true' },
  { Icon: XIcon, label: 'X / Twitter', href: 'https://x.com/PrimeAxis_News' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591338662946&rdid=6veXNrZObh7PiX9Y&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CBjs9ft7R%2F#' },
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/primeaxisnews?utm_source=qr&igsh=MThsczE5OWZzbWZleA==' },
  { Icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com/@primeaxislive?si=daLsFBSzJReYW_rI' },
  { Icon: MessageCircle, label: 'WhatsApp', href: '#' },
]

const columnHeading = 'font-mono text-[9.5px] tracking-[0.2em] text-gold/60 uppercase mb-5'
const footerLink = 'font-sans text-[13px] text-white/40 hover:text-white/80 transition-colors duration-200'

export default function Footer() {
  return (
    <footer className="bg-deep border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">

          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="inline-flex flex-col gap-1 mb-5">
              <span className="font-display font-bold text-white text-2xl tracking-[0.08em] leading-none">
                PRIMEAXIS
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-gold/60 uppercase leading-none">
                Maritime Intelligence
              </span>
            </Link>
            <p className="font-sans text-[13px] text-white/40 leading-relaxed mb-6 max-w-[300px]">
              Africa&apos;s maritime intelligence and strategic communications platform — informing,
              influencing and elevating conversations shaping Africa&apos;s maritime future.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center',
                    'border border-white/10 text-white/40',
                    'hover:border-gold hover:text-gold transition-all duration-200'
                  )}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Platform */}
          <div>
            <h4 className={columnHeading}>Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Intelligence */}
          <div>
            <h4 className={columnHeading}>Intelligence</h4>
            <ul className="space-y-3">
              {intelligenceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Connect */}
          <div>
            <h4 className={columnHeading}>Connect</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@primeaxisinnovations.com.ng"
                className="flex items-start gap-2.5 text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                <Mail size={13} className="text-gold/60 flex-shrink-0 mt-0.5" />
                <span className="font-sans text-[13px] break-all">
                  hello@primeaxisinnovations.com.ng
                </span>
              </a>
              <a
                href="tel:+2348029490471"
                className="flex items-center gap-2.5 text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                <Phone size={13} className="text-gold/60 flex-shrink-0" />
                <span className="font-sans text-[13px]">+234 802 949 0471</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[12px] text-white/30">
            © 2026 PrimeAxis Innovations Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/terms-of-use" className="font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors duration-200">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
