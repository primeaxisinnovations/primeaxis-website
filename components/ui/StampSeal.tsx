import type { ReactElement } from 'react'
import { cn } from '@/lib/utils'

interface StampSealProps {
  children: ReactElement
  size?: number
  className?: string
}

export default function StampSeal({ children, size = 60, className }: StampSealProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center justify-center flex-shrink-0 rounded-full',
        'border-[1.5px] border-teal text-teal',
        'hover:border-stamp hover:text-stamp',
        'active:scale-[0.96]',
        'transition-colors duration-[250ms] ease-in-out',
        className
      )}
      style={{ width: size, height: size, transform: 'rotate(-6deg)' }}
      aria-hidden="true"
    >
      {/* Inner concentric ring — follows parent hover via group-hover */}
      <span
        className="absolute rounded-full border border-teal group-hover:border-stamp transition-colors duration-[250ms] ease-in-out pointer-events-none"
        style={{ inset: 4 }}
      />
      {/* Icon, centered within the rings */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </div>
  )
}
