import { cn } from '@/lib/utils'

type TagVariant = 'default' | 'filled' | 'dark'

interface TagProps {
  category: string
  variant?: TagVariant
  className?: string
}

export default function Tag({ category, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] tracking-[0.16em] uppercase',
        variant === 'default' && 'text-gold',
        variant === 'filled' && 'inline-block bg-gold text-deep px-3 py-1',
        variant === 'dark' && 'text-white/40',
        className
      )}
    >
      {category}
    </span>
  )
}
