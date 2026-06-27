'use client'

import { useEffect, type ReactElement } from 'react'

interface Reason {
  title: string
  body: string
  icon: ReactElement
}

interface WhyPartnerSectionProps {
  reasons: Reason[]
}

// Custom scroll-triggered reveal (not the shared AnimatedSection
// component) — this section needs per-element stagger (eyebrow, heading,
// each card, each card's gold line) rather than one fade applied to a
// single wrapped block. Reveals on a short mount timer, with an
// IntersectionObserver fallback in case the section mounts off-screen
// with a delay (e.g. behind a slow data fetch higher up the tree).
export default function WhyPartnerSection({ reasons }: WhyPartnerSectionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const section = document.querySelector('.wwu-why-section')
      if (section) section.classList.add('in-view')
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const section = document.querySelector('.wwu-why-section')
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      data-animate
      className="wwu-why-section py-[72px] max-sm:py-14 bg-white border-y border-border"
    >
      <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">

        <div className="mb-12">
          <span className="wwu-why-eyebrow block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
            Why Partner With PrimeAxis
          </span>
          <h2 className="wwu-why-heading font-display text-[clamp(22px,2.6vw,34px)] font-semibold text-deep leading-[1.15] max-w-[520px]">
            What Working With PrimeAxis Means for Your Organisation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="wwu-why-card">
              <div className="wwu-why-icon-box">{reason.icon}</div>
              <h3 className="font-display text-[18px] font-semibold text-deep mb-3 leading-snug">
                {reason.title}
              </h3>
              <p className="font-sans text-[13.5px] text-muted leading-[1.75]">
                {reason.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
