/**
 * ClientsBlock — Partners section with partner types and regional presence.
 * Server component; reads partnerTypes / regions / networkSubtitle / regionsHeading
 * from CMS (5b.2 schema).
 *
 * Font: `font-sora` everywhere. The Sora stack falls back to Noto Sans SC
 * for Chinese glyphs (see tailwind.config.ts). No locale-dependent class.
 *
 * The icon enum on each partnerType is one of the four Lucide icon names —
 * adding new icons requires a code change.
 */
import { Globe, Handshake, Building2, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ClientItem = { name: string }
type PartnerType = { icon: 'Globe' | 'Building2' | 'Handshake' | 'Award'; title: string; examples?: string }
type Region = { name: string; count: string }

type ClientsBlockProps = {
  sectionLabel?: string
  headline?: string
  networkSubtitle?: string
  regionsHeading?: string
  clients?: ClientItem[]
  partnerTypes?: PartnerType[]
  regions?: Region[]
}

const ICON_MAP: Record<PartnerType['icon'], LucideIcon> = {
  Globe,
  Building2,
  Handshake,
  Award,
}

export default function ClientsBlock({
  sectionLabel,
  headline,
  networkSubtitle,
  regionsHeading,
  clients = [],
  partnerTypes = [],
  regions = [],
}: ClientsBlockProps) {
  return (
    <section id="clients" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2/20 to-bg" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-14 reveal">
          {sectionLabel && (
            <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
              {sectionLabel}
            </p>
          )}
          {headline && (
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-pg-text">
              {headline}
            </h2>
          )}
          {networkSubtitle && (
            <p className="text-muted text-lg mt-2">{networkSubtitle}</p>
          )}
        </div>

        {partnerTypes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-16 reveal">
            {partnerTypes.map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Globe
              return (
                <div key={p.title} className="glass-card rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-pg-text">{p.title}</h3>
                      {p.examples && (
                        <p className="text-muted text-sm mt-2 leading-relaxed">{p.examples}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {regions.length > 0 && (
          <>
            <div className="text-center mb-6">
              {regionsHeading && (
                <h3 className="font-sora font-bold text-lg text-pg-text">{regionsHeading}</h3>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 reveal d2">
              {regions.map((r) => (
                <div key={r.name} className="glass-card rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <div className="font-sora font-extrabold text-amber text-xl">{r.count}</div>
                  <div className="text-pg-text text-xs font-semibold mt-1">{r.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {clients.length > 0 && (
          <div className="mt-16">
            <div
              className="overflow-hidden"
              style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div className="flex w-max" style={{ animation: 'marquee 28s linear infinite' }}>
                {[...clients, ...clients].map((client, i) => (
                  <div
                    key={i}
                    className="px-8 py-3 glass-card rounded-lg text-xs font-bold tracking-widest whitespace-nowrap text-muted flex-shrink-0 mx-1"
                  >
                    {client.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
