/**
 * HeroBlock — full-screen hero section with DotMotif accent.
 *
 * All text fields are localized in Payload — the parent server layout
 * queries with `locale`, so `headline`, `subtitle`, `scrollHintLabel`, etc.
 * arrive already-translated. The brand pillar line lives in the CMS
 * `subtitle` field (EN: "Tech Innovation · Business Empowerment · Human
 * Care", ZH: "科技创新 · 商业赋能 · 人文关怀") so editors can adjust it
 * in /admin without a code change.
 *
 * Font: `font-sora` everywhere. The Sora stack falls back to Noto Sans SC
 * for Chinese glyphs (see tailwind.config.ts), so locale toggling never
 * changes the font — only the characters within a single span.
 *
 * `chineseSubtitle` is a legacy companion column kept until Phase 5b.5;
 * unused at render. Payload's locale fallback handles empty ZH.
 */
import HeroCTAButtons from '@/components/HeroCTAButtons'
import DotMotif from '@/components/DotMotif'

type HeroStat = {
  number: string
  label: string
  /** Legacy column — unused at render. Removed in Phase 5b.5. */
  chineseLabel?: string
}

type HeroButton = {
  label: string
  href: string
  variant: 'fill' | 'ghost' | 'weconnect'
}

type HeroBlockProps = {
  eyebrow?: string
  headline?: string
  headlineAccent?: string
  headlineFaint?: string
  subtitle?: string
  scrollHintLabel?: string
  /** Legacy column — unused at render. Removed in Phase 5b.5. */
  chineseSubtitle?: string
  ctaButtons?: HeroButton[]
  stats?: HeroStat[]
}

export default function HeroBlock({
  eyebrow,
  headline,
  headlineAccent,
  headlineFaint,
  subtitle,
  scrollHintLabel,
  ctaButtons = [],
  stats = [],
}: HeroBlockProps) {
  return (
    <section id="hero" className="bg-bg relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute top-0 right-0">
        <DotMotif className="w-48 h-48 md:w-72 md:h-72" opacity={0.06} />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-start gap-12 relative z-10">
        <div className="flex-1 md:w-[60%] space-y-6">
          {eyebrow && (
            <div className="flex items-center gap-2 text-sm text-muted hero-fade-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber animate-dot-pulse" />
              <span>{eyebrow}</span>
            </div>
          )}

          <h1 className="font-sora font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight hero-fade-2">
            {headline && <span className="block text-pg-text">{headline}</span>}
            {headlineAccent && <span className="block text-amber">{headlineAccent}</span>}
            {headlineFaint && <span className="block text-pg-text/30">{headlineFaint}</span>}
          </h1>

          {subtitle && (
            <p className="text-muted text-lg tracking-widest hero-fade-3">
              {subtitle}
            </p>
          )}

          {ctaButtons.length > 0 && <div className="hero-fade-4"><HeroCTAButtons buttons={ctaButtons} /></div>}
        </div>

        {stats.length > 0 && (
          <div className="w-full md:w-[40%] grid grid-cols-2 gap-4 hero-fade-5">
            {stats.map((stat) => (
              <div key={stat.label || stat.number} className="glass-card rounded-xl p-5">
                <div className="font-sora font-extrabold text-3xl text-amber">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-pg-text mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {scrollHintLabel && (
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint text-[10px] tracking-[3px]">
          <div
            className="w-px h-11"
            style={{
              background: 'linear-gradient(var(--amber), transparent)',
              animation: 'scrollLine 2s infinite',
            }}
          />
          {scrollHintLabel}
        </div>
      )}
    </section>
  )
}
