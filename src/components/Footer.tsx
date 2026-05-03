'use client'

/**
 * Footer — site footer for all PER GROUP marketing routes.
 * Localized via i18n strings dictionary. Some lines (Chinese pillar tagline,
 * e创码头) stay in Chinese in both locales — they're brand identity, not
 * translatable text.
 */
import Link from 'next/link'
import { useStrings, useLocale } from '@/lib/i18n/context'

export default function Footer() {
  const t = useStrings()
  const { locale } = useLocale()

  const navLinks = [
    { label: t.nav.philosophy, href: '/#values' },
    { label: t.nav.about, href: '/#about' },
    { label: t.nav.services, href: '/#services' },
    { label: t.nav.partners, href: '/#clients' },
    { label: 'WeConnect', href: '/#platform-teaser' },
  ]

  return (
    <footer className="py-12" style={{ backgroundColor: 'hsl(20, 12%, 16%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 bg-amber flex items-center justify-center font-extrabold text-sm text-white rounded-lg flex-shrink-0"
              style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
            >
              P
            </div>
            <div>
              <div className="font-sora font-extrabold text-white text-xl">PER GROUP</div>
              <div className="text-white/50 text-xs mt-0.5">
                {t.footer.eHarborTag} · <span className="font-noto-sans-sc">{t.footer.eHarborTagCn}</span>
              </div>
              <p className="text-white/40 text-[10px] mt-1 italic">Innovative Solution Provider</p>
              {/* Brand pillar line stays in Chinese in both locales — it's iconography */}
              <p className="text-white/50 text-sm mt-2 font-noto-sans-sc">{t.footer.pillarLine}</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-white/60 text-sm no-underline hover:text-amber transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between text-white/40 text-xs">
          <span>{t.footer.copyright}</span>
          <span className={`${locale === 'zh' ? 'font-noto-sans-sc' : ''} mt-2 md:mt-0`}>{t.footer.mission}</span>
        </div>
      </div>
    </footer>
  )
}
