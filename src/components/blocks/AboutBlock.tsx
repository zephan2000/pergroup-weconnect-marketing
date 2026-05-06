/**
 * AboutBlock — "15 Years Bridging East & West" section with timeline.
 * Server component; reads timeline milestones from CMS (5b.2 schema).
 * Locale-aware via getServerLocale() so the right font class is applied.
 */
import { RichText } from '@payloadcms/richtext-lexical/react'
import DotMotif from '@/components/DotMotif'
import { getServerLocale } from '@/lib/i18n/server'

type Advantage = { icon?: string; title: string; description?: string }
type GlobeStat = { number?: string; label?: string }
type Milestone = { year: string; title: string }

type AboutBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  body?: Record<string, unknown>
  advantages?: Advantage[]
  globeStat?: GlobeStat
  milestones?: Milestone[]
}

export default async function AboutBlock({
  sectionLabel,
  headline,
  headlineAccent,
  body,
  advantages = [],
  milestones = [],
}: AboutBlockProps) {
  const locale = await getServerLocale()
  const cnFont = locale === 'zh' ? 'font-noto-sans-sc' : ''
  const headingFont = locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2/30 to-bg" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="reveal">
            {sectionLabel && (
              <p className={`text-amber text-xs tracking-widest uppercase mb-3 ${cnFont || 'font-sora'}`}>
                {sectionLabel}
              </p>
            )}
            <h2 className={`font-extrabold text-3xl md:text-4xl text-pg-text leading-tight ${headingFont}`}>
              {headline} {headlineAccent && <><br /><span className="text-amber">{headlineAccent}</span></>}
            </h2>

            {body && (
              <div className={`mt-8 text-muted text-sm leading-relaxed space-y-4 ${cnFont}`}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <RichText data={body as any} />
              </div>
            )}

            {advantages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {advantages.map((adv) => (
                  <div key={adv.title} className="glass-card rounded-lg px-4 py-2">
                    {adv.icon && <span className="mr-2">{adv.icon}</span>}
                    <span className={`text-amber text-sm font-bold ${cnFont}`}>{adv.title}</span>
                    {adv.description && (
                      <span className={`text-muted text-xs ml-2 ${cnFont}`}>{adv.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative reveal d2">
            <DotMotif className="absolute -top-8 -right-4 w-24 h-24" opacity={0.05} />
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-amber group-hover:scale-125 transition-transform" />
                    {i < milestones.length - 1 && (
                      <div className="w-px h-full min-h-[60px] bg-gradient-to-b from-amber/40 to-line" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="font-sora font-extrabold text-amber text-lg">{m.year}</span>
                    <div className={`font-semibold text-pg-text text-sm mt-1 ${headingFont}`}>{m.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
