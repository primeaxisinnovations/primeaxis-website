import type { Metadata } from 'next'
import NewsBrowser, { type NewsListItem } from '@/components/news/NewsBrowser'
import BreakingBar from '@/components/sections/BreakingBar'
import { getAllNews } from '@/lib/news'

export const metadata: Metadata = {
  title: 'News | PrimeAxis Maritime Intelligence',
  description:
    "Dated industry reporting on Africa's maritime and blue economy sector — regulation, security, trade, infrastructure, and policy as it happens.",
}

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour,
// and the admin API's revalidatePath('/news') pushes it live immediately.
export const revalidate = 3600

export default async function NewsPage() {
  const news = await getAllNews()

  // Strip the rich body before crossing into the client component — the
  // listing renders excerpts only, so shipping full HTML bodies (embedded
  // images and all) into the page payload would be pure waste.
  const items: NewsListItem[] = news.map(({ slug, title, date, category, coverImage, excerpt }) => ({
    slug,
    title,
    date,
    category,
    coverImage,
    excerpt,
  }))

  return (
    <div className="min-h-screen" style={{ background: '#0D1824' }}>

      <BreakingBar />

      {/* ── Hero ────────────────────────────────────────────────────
          Editorial, not photographic — the newsroom voice, set against
          the deep navy the rest of the dark pages share. */}
      <section className="relative overflow-hidden bg-deep pt-[92px] pb-[76px] max-sm:pt-14 max-sm:pb-12">
        {/* Decorative rings — the same gold contour device used on the
            homepage hero, dialled well down so it reads as texture. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="1180" cy="210" rx="520" ry="300" stroke="rgba(191,159,102,0.14)" strokeWidth="1" />
          <ellipse cx="1180" cy="210" rx="340" ry="196" stroke="rgba(191,159,102,0.09)" strokeWidth="1" />
          <path d="M 0 340 Q 360 250 720 285 T 1440 230" stroke="rgba(191,159,102,0.07)" strokeWidth="1.2" strokeDasharray="8 6" />
        </svg>

        <div className="relative max-w-[1240px] mx-auto px-11 max-md:px-5">
          <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
          <span className="block font-mono text-[10.5px] tracking-[0.22em] uppercase text-gold mb-3">
            Our Reporting
          </span>
          <h1 className="font-display text-[clamp(28px,3.5vw,50px)] font-bold text-white leading-[1.1] max-w-[760px] mb-5">
            Breaking: Africa&apos;s Maritime Industry.
          </h1>
          <p className="font-sans text-[15px] font-light text-white/60 leading-relaxed max-w-[560px]">
            Dated reporting from the PrimeAxis desk — regulation, security, trade, infrastructure,
            and policy, filed as the story develops.
          </p>
        </div>
      </section>

      {/* Filter pills + reverse-chronological list — all client-side */}
      <section className="pt-[56px] pb-[88px] max-sm:pt-10 max-sm:pb-14">
        <div className="max-w-[900px] mx-auto px-11 max-md:px-5">
          <NewsBrowser items={items} />
        </div>
      </section>

    </div>
  )
}
