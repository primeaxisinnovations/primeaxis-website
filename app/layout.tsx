import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, DM_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminShortcut from '@/components/layout/AdminShortcut'

// ── Google Analytics (GA4) ────────────────────────────────────────────
// NEXT_PUBLIC_GA_MEASUREMENT_ID must be set to a real GA4 Measurement ID
// (the "G-XXXXXXXXXX" string from a GA4 property's Data Streams settings)
// — both in .env.local for local testing and as an Environment Variable in
// Vercel's project settings for it to track anything in production. A GA4
// property has to be created in Google Analytics first; this code does
// nothing on its own until that real ID exists. Empty/missing on purpose
// until that setup happens — guarded below so no analytics script loads
// and no blank-ID request fires when it's unset.
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// ── Google Search Console verification ────────────────────────────────
// NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION must be set to the real verification
// code Search Console gives you when you add this site as a property there
// (Settings → Ownership verification → HTML tag method) — both in
// .env.local and in Vercel's project settings. Empty/missing on purpose
// until that property exists; guarded below so metadata.verification.google
// is left undefined (Next.js omits the tag entirely) rather than rendering
// a broken/empty <meta> tag.
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'PrimeAxis | Maritime Intelligence & Strategic Communications Platform',
  description:
    "PrimeAxis provides maritime intelligence, executive insights, strategic analysis and thought leadership shaping Africa's maritime future.",
  openGraph: {
    title: 'PrimeAxis | Maritime Intelligence & Strategic Communications Platform',
    description:
      "PrimeAxis provides maritime intelligence, executive insights, strategic analysis and thought leadership shaping Africa's maritime future.",
    type: 'website',
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  icons: {
    icon: '/favicon-32.png',
    apple: '/favicon-180.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon-512.png',
        sizes: '512x512',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${dmMono.variable}`}
    >
      {/* Warm up the two cross-origin hosts every public page hits on a cache
          miss — the GitHub API (content source of truth) and the Vercel Blob
          store (uploaded images) — so DNS/TLS is already done before the first
          request fires. */}
      <head>
        <meta name="google-site-verification" content="Lz61jbm7zxLUmNHDidOIRH7GvYnYfUCgCOlqt3zXn6Y" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://n0jyvquhgs2welj7.public.blob.vercel-storage.com" />
      </head>
      {/* suppressHydrationWarning: the Grammarly browser extension injects
          data-gr-* attributes onto <body> after hydration — a confirmed
          benign client-only mismatch, not a real SSR/CSR divergence. */}
      <body className="font-sans" suppressHydrationWarning>
        <AdminShortcut />
        <Header />
        <main className="pt-[102px] bg-[#0D1824]">{children}</main>
        <Footer />
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  )
}
