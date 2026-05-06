/**
 * Footer — site footer for all PER GROUP marketing routes.
 *
 * Text values come from the FooterSettings + NavSettings Payload globals,
 * fetched server-side in (marketing)/layout.tsx. Single-locale rendering —
 * no EN+CN side-by-side anywhere. The pillarLine field is translated per
 * locale; the brand calligraphy elsewhere on the site stays untranslated
 * as iconography.
 *
 * Font: `font-sora` everywhere. The Sora stack falls back to Noto Sans SC
 * for Chinese glyphs (see tailwind.config.ts), so locale never changes
 * the font class.
 */
import Link from 'next/link'
import type { FooterSettingsData, NavSettingsData } from '@/lib/cms/site-text'

interface FooterProps {
  settings: FooterSettingsData
  nav: NavSettingsData
}

export default function Footer({ settings, nav }: FooterProps) {
  const navLinks = [
    { label: nav.linkPhilosophy, href: '/#values' },
    { label: nav.linkAbout, href: '/#about' },
    { label: nav.linkServices, href: '/#services' },
    { label: nav.linkPartners, href: '/#clients' },
    { label: nav.weconnectLabel, href: '/#platform-teaser' },
  ]

  return (
    <footer className="py-12 font-sora" style={{ backgroundColor: 'hsl(20, 12%, 16%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 bg-amber flex items-center justify-center font-extrabold text-sm text-white rounded-lg flex-shrink-0"
              style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
            >
              P
            </div>
            <div>
              <div className="font-extrabold text-white text-xl">PER GROUP</div>
              <div className="text-white/50 text-xs mt-0.5">{settings.eHarborTag}</div>
              <p className="text-white/40 text-[10px] mt-1 italic">{settings.tagline}</p>
              <p className="text-white/50 text-sm mt-2">{settings.pillarLine}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/60 text-sm no-underline hover:text-amber transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between text-white/40 text-xs gap-2">
          <span>{settings.copyright}</span>
          <span>{settings.mission}</span>
        </div>
      </div>
    </footer>
  )
}
