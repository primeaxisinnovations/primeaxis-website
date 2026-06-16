'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Delay = 0 | 100 | 200 | 300

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: Delay
  threshold?: number
}

const delayClass: Record<Delay, string> = {
  0: 'delay-0',
  100: 'delay-100',
  200: 'delay-200',
  300: 'delay-300',
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        delayClass[delay],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
    >
      {children}
    </div>
  )
}
