import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  onDark?: boolean
  showArrow?: boolean
  href?: string
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  onDark = false,
  showArrow = false,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const base = cn(
    'group inline-flex items-center gap-2 font-sans font-semibold tracking-wide transition-all duration-200 cursor-pointer leading-none',
    variant !== 'text' && sizeClasses[size]
  )

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gold text-deep hover:-translate-y-0.5 hover:shadow-gold',
    ghost: cn(
      'bg-transparent border',
      onDark
        ? 'border-white text-white hover:bg-gold hover:border-gold hover:text-deep'
        : 'border-gold text-gold hover:bg-gold hover:text-deep'
    ),
    text: 'p-0 text-gold hover:underline underline-offset-2',
  }

  const allClasses = cn(base, variantClasses[variant], className)

  const content = (
    <>
      {children}
      {(showArrow || variant === 'text') && (
        <ArrowRight
          size={14}
          className={cn(
            'transition-transform duration-200',
            variant === 'text' && 'group-hover:translate-x-1'
          )}
        />
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button className={allClasses} {...props}>
      {content}
    </button>
  )
}
