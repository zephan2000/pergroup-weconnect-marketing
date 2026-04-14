'use client'

/**
 * Nav — sticky glass navbar for all PER GROUP marketing routes.
 * Adapted from per-group-connect-main reference.
 * Client component — needs scroll detection and mobile menu state.
 */
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import WeConnectTrigger from '@/components/WeConnectTrigger'

const navLinks = [
  { label: 'Philosophy', href: '/#values' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Partners', href: '/#clients' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-[500] transition-all duration-300 ${
        scrolled ? 'glass-light-scrolled' : 'glass-light'
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 bg-amber flex items-center justify-center font-extrabold text-xs text-white rounded-lg flex-shrink-0"
            style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
          >
            P
          </div>
          <span className="text-sm font-extrabold tracking-[3px] uppercase text-pg-text font-sora">
            PER GROUP
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-muted text-sm no-underline hover:text-amber transition-colors"
            >
              {label}
            </Link>
          ))}
          <WeConnectTrigger
            tab="needs"
            className="text-amber text-sm font-semibold hover:text-amber/80 transition-colors bg-transparent border-none cursor-pointer font-sora"
          >
            WeConnect ✦
          </WeConnectTrigger>
        </div>

        {/* Desktop CTA */}
        <WeConnectTrigger
          tab="needs"
          className="hidden md:inline-flex items-center gap-2 bg-amber text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-amber/90 transition-colors border-none cursor-pointer font-sora"
        >
          WECONNECT PLATFORM →
        </WeConnectTrigger>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-pg-text bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-bg border-b border-line shadow-lg z-50 animate-fade-in">
          <div className="flex flex-col py-2">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-pg-text/80 text-base font-sora font-semibold px-6 py-3 no-underline hover:bg-faint hover:text-amber transition-colors border-b border-line/50 last:border-b-0"
              >
                {label}
              </Link>
            ))}
            <div className="px-4 py-3">
              <WeConnectTrigger
                tab="needs"
                className="w-full bg-amber text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber/90 transition-colors border-none cursor-pointer font-sora"
              >
                WECONNECT PLATFORM →
              </WeConnectTrigger>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
