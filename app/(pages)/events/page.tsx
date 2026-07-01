import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllEvents } from '@/lib/events'
import EventsBrowser from '@/components/events/EventsBrowser'
import BreakingBar from '@/components/sections/BreakingBar'

export const metadata: Metadata = {
  title: 'Events | PrimeAxis',
  description:
    "Conferences, summits, and press briefings shaping Africa's maritime agenda — captured by the PrimeAxis intelligence desk.",
}

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour.
// Raised from 60s to cut GitHub-API cold-load latency on cache misses.
export const revalidate = 3600

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div className="min-h-screen" style={{ background: '#0D1824' }}>

      <BreakingBar />

      {/* Page Header — full-viewport hero photograph, bleeding behind the
          transparent fixed header (-mt cancels the global main pt-[102px]) ── */}
      <section className="hero-section relative min-h-screen overflow-hidden -mt-[102px]">
        <Image
          src="/images/Events.png"
          alt="Maritime conference gathering"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover hero-events-image"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(13,24,36,0.55) 0%, rgba(13,24,36,0.35) 45%, rgba(13,24,36,0.92) 100%)' }}
        />
        <div className="absolute z-10 bottom-[52px] left-[64px] max-sm:bottom-9 max-sm:left-6">
          <span
            className="block font-mono text-[10px] tracking-[0.24em] uppercase mb-3"
            style={{ color: 'var(--color-gold-bright)', textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
          >
            Our Events
          </span>
          <h1
            className="font-display text-[46px] max-sm:text-[32px] font-bold text-white leading-[1.12] max-w-[620px] mb-4"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.75), 0 1px 6px rgba(0,0,0,0.60)' }}
          >
            Where Maritime Africa Gathers
          </h1>
          <p
            className="font-sans text-[15px] font-light text-white/80 max-w-[520px]"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85), 0 2px 20px rgba(0,0,0,0.60)' }}
          >
            Conferences, summits, and press briefings shaping Africa&apos;s maritime agenda.
          </p>
        </div>
      </section>

      {/* Filter bar + events grid + gallery lightbox — all client-side */}
      <section className="pt-[72px] pb-[88px] max-sm:pt-12 max-sm:pb-14">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <EventsBrowser events={events} />
        </div>
      </section>

    </div>
  )
}
