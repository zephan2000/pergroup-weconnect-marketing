/**
 * AboutBlock — "15 Years Bridging East & West" section with timeline.
 * Adapted from per-group-connect-main AboutSection with glass cards.
 * Server component.
 */
import { RichText } from '@payloadcms/richtext-lexical/react'
import DotMotif from '@/components/DotMotif'

type Advantage = { icon?: string; title: string; description?: string }
type GlobeStat = { number?: string; label?: string }

type AboutBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  body?: Record<string, unknown>
  advantages?: Advantage[]
  globeStat?: GlobeStat
}

const milestones = [
  { year: '2009', en: 'Founded in Singapore', cn: '新加坡成立' },
  { year: '2015', en: 'Expanded to 20+ countries', cn: '拓展至20+国家' },
  { year: '2019', en: 'E-Harbor ecosystem launched', cn: 'E-Harbor生态平台启动' },
  { year: '2024', en: 'WeConnect AI platform', cn: 'WeConnect智能平台上线' },
]

export default function AboutBlock({
  sectionLabel = 'About Us · 关于我们',
  headline = '15 Years Bridging',
  headlineAccent = 'East & West',
  body,
  advantages = [],
}: AboutBlockProps) {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2/30 to-bg" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Story */}
          <div className="reveal">
            <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
              {sectionLabel}
            </p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-pg-text leading-tight">
              {headline} <br />
              <span className="text-amber">{headlineAccent}</span>
            </h2>
            <p className="font-noto-sans-sc text-muted text-base mt-2">连接东西方的桥梁</p>

            {body && (
              <div className="mt-8 text-muted text-sm leading-relaxed space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <RichText data={body as any} />
              </div>
            )}

            {/* Brand pillars / Advantages */}
            {advantages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {advantages.map((adv) => (
                  <div key={adv.title} className="glass-card rounded-lg px-4 py-2">
                    {adv.icon && <span className="mr-2">{adv.icon}</span>}
                    <span className="font-noto-sans-sc text-amber text-sm font-bold">{adv.title}</span>
                    {adv.description && (
                      <span className="text-muted text-xs ml-2">{adv.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Timeline */}
          <div className="relative reveal d2">
            <DotMotif className="absolute -top-8 -right-4 w-24 h-24" opacity={0.05} />
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-4 group">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-amber group-hover:scale-125 transition-transform" />
                    {i < milestones.length - 1 && (
                      <div className="w-px h-full min-h-[60px] bg-gradient-to-b from-amber/40 to-line" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <span className="font-sora font-extrabold text-amber text-lg">{m.year}</span>
                    <div className="font-sora font-semibold text-pg-text text-sm mt-1">{m.en}</div>
                    <div className="font-noto-sans-sc text-muted text-xs">{m.cn}</div>
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
