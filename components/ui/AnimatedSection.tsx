'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Safety timeout — forces reveal after 1.2s regardless of the observer,
    // so content is NEVER left permanently hidden.
    const safetyTimer = setTimeout(() => {
      setIsVisible(true)
    }, 1200)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
            clearTimeout(safetyTimer)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    )

    observer.observe(element)

    // Reveal immediately if the element is already in the viewport on mount.
    const rect = element.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0

    if (alreadyVisible) {
      setTimeout(() => {
        setIsVisible(true)
        observer.unobserve(element)
        clearTimeout(safetyTimer)
      }, delay || 100)
    }

    return () => {
      observer.disconnect()
      clearTimeout(safetyTimer)
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
