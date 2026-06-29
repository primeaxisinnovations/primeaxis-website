'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Intelligence', href: '/intelligence-hub' },
  { label: 'Conversations', href: '/executive-conversations' },
  { label: 'Events', href: '/events' },
  { label: 'Services', href: '/services' },
  { label: 'Work With Us', href: '/work-with-us' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  function submitSearch(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
    setSearchQuery('')
    setMobileSearchQuery('')
    setIsOpen(false)
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    submitSearch(searchQuery)
  }

  function handleMobileSearchSubmit(e: FormEvent) {
    e.preventDefault()
    submitSearch(mobileSearchQuery)
  }

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

          {/* Logo — full horizontal logo (icon + "PRIMEAXIS" + "MARITIME INTELLIGENCE"
              wordmark baked in). Transparent PNG, light wordmark tuned for the dark
              navy nav. Wrapper reserves min-width so the nav pills can never squeeze
              it; object-contain keeps the lockup from cropping or distorting. */}
          <Link href="/" className="flex items-center flex-shrink-0" style={{ minWidth: '200px' }}>
            <Image
              src="/logo.png"
              alt="PrimeAxis Maritime Intelligence"
              width={180}
              height={52}
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              priority
            />
          </Link>

          {/* Desktop nav — pill switcher container */}
          <nav
            className="hidden lg:flex items-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '100px',
              padding: '4px',
              gap: '2px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('nav-pill-link', isActive(link.href) && 'active')}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn('nav-pill-link', isActive('/contact') && 'active')}
            >
              Contact
            </Link>
          </nav>

          {/* Right — desktop search + contact, mobile hamburger */}
          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search articles and conversations"
                className={cn(
                  'font-sans text-[13px] text-white placeholder:text-white/40 bg-white/10 border border-white/15 outline-none focus:border-gold transition-all duration-200 overflow-hidden',
                  searchOpen ? 'w-[180px] px-3 py-[7px] opacity-100 mr-1' : 'w-0 px-0 py-[7px] opacity-0 border-transparent'
                )}
              />
              <button
                type={searchOpen ? 'submit' : 'button'}
                onClick={() => {
                  if (!searchOpen) setSearchOpen(true)
                }}
                aria-label={searchOpen ? 'Submit search' : 'Open search'}
                className="btn-bare text-white/75 hover:text-gold transition-colors duration-200 p-1"
              >
                <Search size={19} />
              </button>
            </form>

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

        {/* Overlay search */}
        <form onSubmit={handleMobileSearchSubmit} className="px-6 flex-shrink-0">
          <div className="flex items-center border border-white/15 bg-white/5">
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search articles and conversations…"
              aria-label="Search articles and conversations"
              className="flex-1 font-sans text-[14px] text-white placeholder:text-white/40 bg-transparent outline-none px-4 py-3"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="btn-bare text-white/75 hover:text-gold transition-colors duration-200 px-4"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

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
