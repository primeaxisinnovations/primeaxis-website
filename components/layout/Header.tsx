'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Intelligence Hub', href: '/intelligence-hub' },
  { label: 'Executive Conversations', href: '/executive-conversations' },
  { label: 'Services', href: '/services' },
  { label: 'Work With Us', href: '/work-with-us' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-[100] transition-all duration-300',
          pathname === '/' ? 'top-[38px]' : 'top-0',
          scrolled
            ? 'bg-deep/95 backdrop-blur-md border-b border-gold/20 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col gap-0.5 flex-shrink-0">
            <span className="font-display font-bold text-white text-xl tracking-[0.08em] leading-none">
              PRIME<span className="text-gold">AXIS</span>
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-white/50 uppercase leading-none">
              Maritime Intelligence
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative group text-[13px] font-medium pb-0.5 transition-colors duration-200',
                  isActive(link.href) ? 'text-gold' : 'text-white/75 hover:text-white'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-px w-full bg-gold origin-left transition-transform duration-200',
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right — desktop contact + mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center font-sans font-semibold text-sm tracking-wide text-gold border border-gold px-5 py-2 transition-all duration-200 hover:bg-gold hover:text-deep"
            >
              Contact
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-bare lg:hidden text-white p-1"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[200] bg-deep/97 backdrop-blur-md flex flex-col',
          'transition-all duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Overlay header row */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
          <Link href="/" className="flex flex-col gap-0.5" onClick={() => setIsOpen(false)}>
            <span className="font-display font-bold text-white text-xl tracking-[0.08em]">
              PRIME<span className="text-gold">AXIS</span>
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-white/50 uppercase">
              Maritime Intelligence
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="btn-bare text-white/60 hover:text-white transition-colors duration-200 p-1"
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>
        </div>

        {/* Overlay nav links */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'font-display text-[28px] font-semibold py-1.5 transition-colors duration-200',
                isActive(link.href) ? 'text-gold' : 'text-white hover:text-gold'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-8 font-sans font-semibold text-sm tracking-wide text-gold border border-gold px-8 py-3 hover:bg-gold hover:text-deep transition-all duration-200"
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  )
}
