'use client'

/**
 * Nav — sticky glass navbar for all PER GROUP marketing routes.
 * Client component for scroll detection + mobile menu state.
 *
 * Text values come from the NavSettings Payload global, fetched server-side
 * in (marketing)/layout.tsx and passed as `settings`. Single-locale rendering
 * — Payload returns the right locale based on the cookie.
 */
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import WeConnectTrigger from '@/components/WeConnectTrigger'
import LanguageToggle from '@/components/LanguageToggle'
import type { NavSettingsData } from '@/lib/cms/site-text'

export default function Nav({ settings, eHarborTag }: { settings: NavSettingsData; eHarborTag: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { label: settings.linkPhilosophy, href: '/#values' },
    { label: settings.linkAbout, href: '/#about' },
    { label: settings.linkServices, href: '/#services' },
    { label: settings.linkPartners, href: '/#clients' },
  ]

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
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/e-harbour-logo.png"
            alt="PER GROUP by E-Harbor"
            width={36}
            height={36}
            className="object-contain flex-shrink-0"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-[2px] uppercase text-pg-text font-sora">
              PER GROUP
            </span>
            <span className="text-[11px] text-muted font-sora mt-0.5">
              {eHarborTag}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
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
            className="text-amber text-sm font-semibold px-3 py-1.5 rounded-lg border border-amber/25 bg-amber/5 hover:bg-amber/15 transition-all duration-200 cursor-pointer font-sora"
          >
            {settings.weconnectLabel}
          </WeConnectTrigger>
          <LanguageToggle ariaLabel={settings.languageToggleAria} />
        </div>

        <WeConnectTrigger
          tab="needs"
          className="hidden md:inline-flex items-center gap-2 bg-amber text-pg-text text-sm font-semibold px-5 py-2 rounded-lg hover:bg-amber/85 transition-all duration-200 border-none cursor-pointer font-sora"
        >
          {settings.weconnectCta}
        </WeConnectTrigger>

        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle ariaLabel={settings.languageToggleAria} />
          <button
            className="text-pg-text bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

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
                className="w-full bg-amber text-pg-text text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber/90 transition-colors border-none cursor-pointer font-sora"
              >
                {settings.weconnectCta}
              </WeConnectTrigger>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
