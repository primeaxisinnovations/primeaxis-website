'use client'

import { useEffect, type ReactElement } from 'react'

interface ProcessStep {
  title: string
  description: string
  icon: ReactElement
}

interface HowWeWorkSectionProps {
  steps: ProcessStep[]
}

// Custom scroll-triggered reveal (not the shared AnimatedSection
// component) — mirrors the WhyPartnerSection.tsx pattern: a short mount
// timer reveals the section, with an IntersectionObserver fallback in
// case the section mounts off-screen with a delay.
export default function HowWeWorkSection({ steps }: HowWeWorkSectionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const section = document.querySelector('.how-we-work-section')
      if (section) section.classList.add('in-view')
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const section = document.querySelector('.how-we-work-section')
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
      className="how-we-work-section py-[72px] max-sm:py-14 bg-white border-y border-border"
    >
      <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">

        <div className="mb-12">
          <span className="hww-eyebrow block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
            How We Work
          </span>
          <h2 className="hww-heading font-display text-[clamp(22px,2.6vw,34px)] font-semibold text-deep leading-[1.15] max-w-[480px]">
            A Structured Approach to Every Engagement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.title} className="hww-card">
              <div className="hww-icon-box">{step.icon}</div>
              <h3 className="font-display text-[20px] font-semibold text-deep mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-[13.5px] text-muted leading-[1.75]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
