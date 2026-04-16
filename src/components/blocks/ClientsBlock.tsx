/**
 * ClientsBlock — Partners section with partner types and regional presence.
 * Adapted from per-group-connect-main PartnersSection with glass cards.
 * Falls back to marquee when clients are provided without partner type data.
 * Server component.
 */
import { Globe, Handshake, Building2, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ClientItem = { name: string }

type ClientsBlockProps = {
  sectionLabel?: string
  headline?: string
  clients?: ClientItem[]
}

const partnerTypes: { icon: LucideIcon; titleEn: string; titleCn: string; examples: string }[] = [
  {
    icon: Globe,
    titleEn: 'Government & Trade Bodies',
    titleCn: '政府与贸易机构',
    examples: 'Singapore EDB, Enterprise SG, CCPIT, regional chambers of commerce',
  },
  {
    icon: Building2,
    titleEn: 'Industry Associations',
    titleCn: '行业协会',
    examples: 'Manufacturing alliances, tech clusters, innovation parks across 53+ countries',
  },
  {
    icon: Handshake,
    titleEn: 'Professional Services',
    titleCn: '专业服务',
    examples: 'Legal, accounting, IP, compliance, and ESG advisory firms — vetted and verified',
  },
  {
    icon: Award,
    titleEn: 'Innovation Ecosystem',
    titleCn: '创新生态',
    examples: 'Universities, R&D labs, accelerators, venture funds, and technology transfer offices',
  },
]

const regions = [
  { name: 'Southeast Asia', cn: '东南亚', count: '80+' },
  { name: 'Europe', cn: '欧洲', count: '45+' },
  { name: 'North America', cn: '北美', count: '30+' },
  { name: 'Middle East', cn: '中东', count: '20+' },
  { name: 'Africa', cn: '非洲', count: '15+' },
  { name: 'Oceania', cn: '大洋洲', count: '10+' },
]

export default function ClientsBlock({
  sectionLabel = 'Our Network · 合作网络',
  headline: _headline = 'Global Industry Leaders',
  clients = [],
}: ClientsBlockProps) {
  return (
    <section id="clients" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2/20 to-bg" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-14 reveal">
          <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
            {sectionLabel}
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-pg-text">
            200+ Partners, <span className="text-amber">53+ Countries</span>
          </h2>
          <p className="font-noto-sans-sc text-muted text-lg mt-2">遍布全球的合作伙伴网络</p>
        </div>

        {/* Partner types */}
        <div className="grid md:grid-cols-2 gap-5 mb-16 reveal">
          {partnerTypes.map((p) => (
            <div key={p.titleEn} className="glass-card rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-5 h-5 text-amber" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-pg-text">{p.titleEn}</h3>
                  <p className="font-noto-sans-sc text-muted text-sm">{p.titleCn}</p>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{p.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regional presence */}
        <div className="text-center mb-6">
          <h3 className="font-sora font-bold text-lg text-pg-text">Regional Presence</h3>
          <p className="font-noto-sans-sc text-muted text-sm">区域覆盖</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 reveal d2">
          {regions.map((r) => (
            <div key={r.name} className="glass-card rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className="font-sora font-extrabold text-amber text-xl">{r.count}</div>
              <div className="text-pg-text text-xs font-semibold mt-1">{r.name}</div>
              <div className="font-noto-sans-sc text-muted text-[10px]">{r.cn}</div>
            </div>
          ))}
        </div>

        {/* Client marquee (if client names provided from CMS) */}
        {clients.length > 0 && (
          <div className="mt-16">
            <div
              className="overflow-hidden"
              style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div
                className="flex w-max"
                style={{ animation: 'marquee 28s linear infinite' }}
              >
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
