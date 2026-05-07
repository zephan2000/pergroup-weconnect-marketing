/**
 * Footer — site footer for all PER GROUP marketing routes.
 *
 * Text values come from the FooterSettings + NavSettings Payload globals,
 * fetched server-side in (marketing)/layout.tsx. The pillarLine field is
 * translated per locale (EN: "Tech Innovation · Business Empowerment ·
 * Human Care", ZH: "科技创新 · 商业赋能 · 人文关怀").
 *
 * Font: `font-sora` everywhere. The Sora stack falls back to Noto Sans SC
 * for Chinese glyphs (see tailwind.config.ts), so locale never changes
 * the font class.
 */
import Link from 'next/link'
import Image from 'next/image'
import type { FooterSettingsData, NavSettingsData } from '@/lib/cms/site-text'
import type { Locale } from '@/lib/i18n/strings'

interface FooterProps {
  settings: FooterSettingsData
  nav: NavSettingsData
  locale: Locale
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Footer({ settings, nav, locale }: FooterProps) {
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
            <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center flex-shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <Image
                src="/e-harbour-logo.png"
                alt="PER GROUP by E-Harbor"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-white text-xl tracking-[0.5px]">PER GROUP</div>
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
