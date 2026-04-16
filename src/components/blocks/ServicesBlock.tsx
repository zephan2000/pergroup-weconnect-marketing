/**
 * ServicesBlock — "End-to-End Global Services" grid with Lucide icons.
 * Adapted from per-group-connect-main ServicesSection with glass cards.
 * Server component.
 */
import { Search, MapPin, Users, Shield, Leaf, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ServiceItem = {
  number: string
  icon?: string
  title: string
  chineseTitle?: string
  description?: string
}

type ServicesBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
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

export default function ServicesBlock({
  sectionLabel = 'What We Do · 服务内容',
  headline = 'End-to-End',
  headlineAccent = 'Global Services',
  services = [],
}: ServicesBlockProps) {
  return (
    <section id="services" className="bg-bg py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-14 reveal">
          <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
            {sectionLabel}
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-pg-text">
            {headline} <span className="text-amber">{headlineAccent}</span>
          </h2>
          <p className="font-noto-sans-sc text-muted text-lg mt-2">全方位全球化服务</p>
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
                      <h3 className="font-sora font-bold text-base text-pg-text">{svc.title}</h3>
                    </div>
                    {svc.chineseTitle && (
                      <p className="font-noto-sans-sc text-muted text-sm mt-0.5">{svc.chineseTitle}</p>
                    )}
                    {svc.description && (
                      <p className="text-sm text-muted mt-2 leading-relaxed">{svc.description}</p>
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
