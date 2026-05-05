'use client'

/**
 * HeroBlock — full-screen hero section with DotMotif accent.
 * Client component for locale-aware fallbacks (subtitle CN/EN, scroll hint).
 *
 * Data flow: parent server layout queries Payload with locale, so
 * `headline`, `eyebrow`, etc. arrive already-translated for the current locale.
 * `chineseSubtitle` is a legacy companion field; we fall back to it in ZH mode
 * if the new localized `subtitle` field is empty.
 */
import HeroCTAButtons from '@/components/HeroCTAButtons'
import DotMotif from '@/components/DotMotif'
import { useLocale, useStrings } from '@/lib/i18n/context'

type HeroStat = {
  number: string
  label: string
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
  /** Localized subtitle (new). Filled via Payload locale switcher. */
  subtitle?: string
  /** Legacy chineseSubtitle field — fallback for zh locale if `subtitle` empty. */
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
  chineseSubtitle,
  ctaButtons = [],
  stats = [],
}: HeroBlockProps) {
  const { locale } = useLocale()
  const t = useStrings()

  // Subtitle resolution:
  //   ZH locale: use `subtitle` (locale-aware) → fall back to legacy `chineseSubtitle`
  //   EN locale: use `subtitle` only — don't show Chinese subtitle in EN mode
  const displaySubtitle = locale === 'zh'
    ? subtitle || chineseSubtitle
    : subtitle

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

          {displaySubtitle && (
            <p className={`text-muted text-lg tracking-widest hero-fade-3 ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>
              {displaySubtitle}
            </p>
          )}

          {ctaButtons.length > 0 && <div className="hero-fade-4"><HeroCTAButtons buttons={ctaButtons} /></div>}
        </div>

        {stats.length > 0 && (
          <div className="w-full md:w-[40%] grid grid-cols-2 gap-4 hero-fade-5">
            {stats.map((stat) => {
              // ZH fallback chain: localized `label` → legacy `chineseLabel`
              const displayLabel = locale === 'zh' && !stat.label
                ? stat.chineseLabel || ''
                : stat.label
              return (
                <div key={stat.label || stat.number} className="glass-card rounded-xl p-5">
                  <div className="font-sora font-extrabold text-3xl text-amber">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-pg-text mt-1">
                    {displayLabel}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint text-[10px] tracking-[3px]">
        <div
          className="w-px h-11"
          style={{
            background: 'linear-gradient(var(--amber), transparent)',
            animation: 'scrollLine 2s infinite',
          }}
        />
        {t.hero.scrollHint}
      </div>
    </section>
  )
}
