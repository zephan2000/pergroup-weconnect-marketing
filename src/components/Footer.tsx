/**
 * Footer — site footer for all PER GROUP marketing routes.
 * Adapted from per-group-connect-main Footer with dark bg and bilingual content.
 * Server component.
 */
import Link from 'next/link'

export default function Footer() {
  return (
    <>
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
                  by E-Harbor · <span className="font-noto-sans-sc">e创码头</span>
                </div>
                <p className="text-white/40 text-[10px] mt-1 italic">Innovative Solution Provider</p>
                <p className="text-white/50 text-sm mt-2 font-noto-sans-sc">科技创新 · 商业赋能 · 人文关怀</p>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex gap-8">
              {[
                { label: 'Philosophy', href: '/#values' },
                { label: 'About', href: '/#about' },
                { label: 'Services', href: '/#services' },
                { label: 'Partners', href: '/#clients' },
                { label: 'WeConnect', href: '/#platform-teaser' },
              ].map((l) => (
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
            <span>© 2026 E-Harbor / PER GROUP · Singapore</span>
            <span className="font-noto-sans-sc mt-2 md:mt-0">让创新对任何人、任何地方开放</span>
          </div>
        </div>
      </footer>
    </>
  )
}
