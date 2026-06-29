'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Event } from '@/types'
import { formatDate } from '@/lib/utils'

// Filter pills. The value matches Event['category'] (or 'all'); the label is
// the human-facing text from the brief.
const FILTERS: Array<{ value: 'all' | Event['category']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'conference', label: 'Conference' },
  { value: 'summit', label: 'Summit' },
  { value: 'press-briefing', label: 'Press Briefing' },
]

const CATEGORY_LABEL: Record<Event['category'], string> = {
  conference: 'Conference',
  summit: 'Summit',
  'press-briefing': 'Press Briefing',
}

const GOLD = '#c8a96e'

export default function EventsBrowser({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState<'all' | Event['category']>('all')
  // The event whose gallery is open in the lightbox, plus which slide is shown.
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)

  const visible = filter === 'all' ? events : events.filter((e) => e.category === filter)

  const openGallery = useCallback((event: Event) => {
    setActiveEvent(event)
    setSlideIndex(0)
  }, [])

  const closeGallery = useCallback(() => {
    setActiveEvent(null)
  }, [])

  const gallery = activeEvent?.gallery ?? []

  const next = useCallback(() => {
    if (gallery.length === 0) return
    setSlideIndex((i) => (i + 1) % gallery.length)
  }, [gallery.length])

  const prev = useCallback(() => {
    if (gallery.length === 0) return
    setSlideIndex((i) => (i - 1 + gallery.length) % gallery.length)
  }, [gallery.length])

  // Keyboard control while the lightbox is open: Escape closes, arrows
  // navigate. Also lock body scroll so the page behind doesn't move.
  useEffect(() => {
    if (!activeEvent) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeGallery()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [activeEvent, closeGallery, next, prev])

  const activeItem = gallery[slideIndex]

  return (
    <>
      {/* ── Category filter bar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={
                active
                  ? { color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(200,169,110,0.08)' }
                  : {
                      color: 'rgba(255,255,255,0.62)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* ── Events grid ─────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <p className="font-sans text-[14px] text-white/55 py-12">No events in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((event) => (
            <button
              key={event.slug}
              type="button"
              onClick={() => openGallery(event)}
              className="event-card group text-left flex flex-col"
            >
              <div className="event-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.coverImage} alt={event.title} />
                <span className="event-card-badge">{CATEGORY_LABEL[event.category]}</span>
              </div>
              <div className="event-card-body">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-date">{formatDate(event.date)}</p>
                <p className="event-card-desc">{event.description}</p>
                <span className="event-card-link">View Gallery →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Gallery lightbox modal ──────────────────────────────────── */}
      {activeEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeEvent.title} gallery`}
          onClick={closeGallery}
          className="fixed inset-0 z-[300] flex flex-col"
          style={{ background: 'rgba(5,14,28,0.92)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          {/* Header row: title + close. Stop propagation so clicks here
              don't fall through to the overlay's close handler. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-start justify-between gap-4 px-6 md:px-10 pt-6 pb-4 flex-shrink-0"
          >
            <div>
              <span className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: GOLD }}>
                {CATEGORY_LABEL[activeEvent.category]}
              </span>
              <h2 className="font-display text-[22px] md:text-[26px] font-semibold text-white leading-tight max-w-[640px]">
                {activeEvent.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeGallery}
              aria-label="Close gallery"
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-150 p-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7" aria-hidden="true">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Main display + arrows */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-h-0 flex items-center justify-center gap-3 md:gap-5 px-4 md:px-10"
          >
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous item"
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors duration-150"
                style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.06)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            <div className="flex-1 h-full min-w-0 flex items-center justify-center">
              {activeItem && (
                activeItem.type === 'video' ? (
                  <video
                    key={activeItem.url}
                    src={activeItem.url}
                    controls
                    className="max-h-full max-w-full rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={activeItem.url}
                    src={activeItem.url}
                    alt={activeItem.caption ?? activeEvent.title}
                    className="max-h-full max-w-full rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                )
              )}
            </div>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next item"
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors duration-150"
                style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.06)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>

          {/* Caption */}
          {activeItem?.caption && (
            <p
              onClick={(e) => e.stopPropagation()}
              className="text-center font-mono text-[11px] tracking-[0.12em] px-6 pt-4 flex-shrink-0"
              style={{ color: GOLD }}
            >
              {activeItem.caption}
            </p>
          )}

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2.5 overflow-x-auto px-6 py-6 flex-shrink-0"
            >
              {gallery.map((item, i) => (
                <button
                  key={`${item.url}-${i}`}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  aria-label={`Show item ${i + 1}`}
                  className="relative flex-shrink-0 w-[72px] h-[48px] rounded-md overflow-hidden transition-all duration-200"
                  style={{
                    border: i === slideIndex ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.15)',
                    opacity: i === slideIndex ? 1 : 0.55,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
