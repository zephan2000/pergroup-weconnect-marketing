/**
 * ServicesBlock — "End-to-End Global Services" grid with Lucide icons.
 * Server component. `subtitle` is now CMS-sourced; reads via locale-aware
 * Payload query in the parent. The legacy `chineseTitle` per-service field
 * is no longer rendered (would duplicate `title` already returned in the
 * current locale). Column drop deferred to Phase 5b.5.
 */
import { Search, MapPin, Users, Shield, Leaf, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getServerLocale } from '@/lib/i18n/server'

type ServiceItem = {
  number: string
  icon?: string
  title: string
  /** Legacy column — unused at render. Removed in Phase 5b.5. */
  chineseTitle?: string
  description?: string
}

type ServicesBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  subtitle?: string
  services?: ServiceItem[]
}

const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  mappin: MapPin,
  users: Users,
  shield: Shield,
  leaf: Leaf,
  rocket: Rocket,
}

const DEFAULT_ICONS: LucideIcon[] = [Search, MapPin, Users, Shield, Leaf, Rocket]

export default async function ServicesBlock({
  sectionLabel,
  headline,
  headlineAccent,
  subtitle,
  services = [],
}: ServicesBlockProps) {
  const locale = await getServerLocale()
  const cnFont = locale === 'zh' ? 'font-noto-sans-sc' : ''
  const headingFont = locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'

  return (
    <section id="services" className="bg-bg py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-14 reveal">
          {sectionLabel && (
            <p className={`text-amber text-xs tracking-widest uppercase mb-3 ${cnFont || 'font-sora'}`}>
              {sectionLabel}
            </p>
          )}
          <h2 className={`font-extrabold text-3xl md:text-4xl text-pg-text ${headingFont}`}>
            {headline} {headlineAccent && <span className="text-amber">{headlineAccent}</span>}
          </h2>
          {subtitle && (
            <p className={`text-muted text-lg mt-2 ${cnFont}`}>{subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const IconComponent = svc.icon
              ? ICON_MAP[svc.icon.toLowerCase()] || DEFAULT_ICONS[i % DEFAULT_ICONS.length]
              : DEFAULT_ICONS[i % DEFAULT_ICONS.length]

            return (
              <div key={svc.number} className="glass-card rounded-xl p-6 hover:shadow-md transition-all group reveal">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0 group-hover:bg-amber/25 transition-colors">
                    <IconComponent className="w-5 h-5 text-amber" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-amber/40 font-sora font-extrabold text-xs">{svc.number}</span>
                      <h3 className={`font-bold text-base text-pg-text ${headingFont}`}>{svc.title}</h3>
                    </div>
                    {svc.description && (
                      <p className={`text-sm text-muted mt-2 leading-relaxed ${cnFont}`}>{svc.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
