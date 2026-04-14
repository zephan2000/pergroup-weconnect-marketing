/**
 * PlatformTeaserBlock — WeConnect platform teaser CTA section.
 * Adapted from per-group-connect-main WeConnectTeaser.
 * Server component — CTA uses WeConnectTrigger (client).
 */
import WeConnectTrigger from '@/components/WeConnectTrigger'
import DotMotif from '@/components/DotMotif'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Feature = {
  title: string
  description?: string
  accentColor: 'green' | 'amber'
}

type PlatformTeaserBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  body?: Record<string, unknown>
  features?: Feature[]
  launchCtaLabel?: string
}

export default function PlatformTeaserBlock({
  sectionLabel = 'New Platform · 全新平台',
  headline = 'Introducing',
  headlineAccent = 'WeConnect',
  body,
  features = [],
  launchCtaLabel = 'OPEN WECONNECT PLATFORM →',
}: PlatformTeaserBlockProps) {
  return (
    <section id="platform-teaser" className="bg-bg py-16 md:py-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-0">
        <DotMotif className="w-40 h-40" opacity={0.05} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center relative z-10">
        <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
          {sectionLabel}
        </p>
        <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-pg-text">
          {headline} <span className="text-amber">{headlineAccent}</span>
        </h2>
        <p className="font-noto-sans-sc text-muted text-lg mt-2">智能匹配平台</p>

        {body ? (
          <div className="text-muted max-w-xl mx-auto mt-4 leading-relaxed text-sm">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <RichText data={body as any} />
          </div>
        ) : (
          <>
            <p className="text-muted max-w-xl mx-auto mt-4 leading-relaxed">
              AI-powered relationship intelligence that proactively connects your business
              with vetted global suppliers through PER GROUP&apos;s trusted network.
            </p>
            <p className="font-noto-sans-sc text-muted text-sm mt-2 max-w-xl mx-auto">
              AI驱动的关系智能平台，通过PER GROUP的可信网络，主动将您的业务与经过验证的全球供应商连接。
            </p>
          </>
        )}

        {/* Feature list */}
        {features.length > 0 && (
          <div className="max-w-lg mx-auto mt-8 text-left">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="flex gap-3 py-4 border-b border-line"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    feat.accentColor === 'amber' ? 'bg-amber shadow-[0_0_8px_hsla(36,90%,47%,0.6)]' : 'bg-green shadow-[0_0_8px_hsla(140,35%,44%,0.6)]'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-pg-text">{feat.title}</div>
                  {feat.description && (
                    <div className="text-xs text-muted mt-0.5">{feat.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <WeConnectTrigger
          tab="needs"
          className="mt-8 inline-flex items-center bg-amber text-white font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity border-none cursor-pointer font-sora"
        >
          {launchCtaLabel}
        </WeConnectTrigger>
      </div>
    </section>
  )
}
