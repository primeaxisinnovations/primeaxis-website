import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, DM_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${dmMono.variable}`}
    >
      <body className="font-sans">
        <Header />
        <main className="pt-[102px]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
