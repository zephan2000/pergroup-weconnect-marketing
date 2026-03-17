/**
 * PlatformTeaserBlock — WeConnect platform teaser with mini mockup.
 * Matches #platform-teaser in /reference/pergroup-website.html.
 * Server component.
 */
import Link from 'next/link'

type Feature = {
  title: string
  description?: string
  accentColor: 'green' | 'amber'
}

type PlatformTeaserBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  body?: string
  features?: Feature[]
  launchCtaLabel?: string
}

export default function PlatformTeaserBlock({
  sectionLabel = 'New Platform · 全新平台',
  headline = 'WeConnect —',
  headlineAccent = 'Global Demand & Supply Platform',
  body,
  features = [],
  launchCtaLabel = 'Launch WeConnect Platform →',
}: PlatformTeaserBlockProps) {
  return (
    <section
      id="platform-teaser"
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '120px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left — text + features */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-syne-mono), monospace',
                fontSize: 11,
                letterSpacing: 3,
                color: 'var(--amber)',
                textTransform: 'uppercase',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ width: 30, height: 1, background: 'var(--amber)', display: 'inline-block' }} />
              {sectionLabel}
            </div>

            <h2
              style={{
                fontSize: 'clamp(34px, 4vw, 58px)',
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1,
                marginBottom: 22,
                color: 'var(--text)',
              }}
            >
              {headline}
              <br />
              <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>{headlineAccent}</em>
            </h2>

            {body && (
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 32 }}>{body}</p>
            )}

            {/* Feature list */}
            <div>
              {features.map((feat) => (
                <div
                  key={feat.title}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '18px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: feat.accentColor === 'amber' ? 'var(--amber)' : '#39E07A',
                      flexShrink: 0,
                      marginTop: 8,
                      boxShadow:
                        feat.accentColor === 'amber'
                          ? '0 0 8px rgba(245,168,42,.6)'
                          : '0 0 8px rgba(57,224,122,.6)',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: 'var(--text)' }}>
                      {feat.title}
                    </div>
                    {feat.description && (
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{feat.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/platform/spaces"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--amber)',
                color: 'var(--bg)',
                padding: '16px 32px',
                fontSize: 13,
                letterSpacing: 2,
                fontWeight: 800,
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginTop: 36,
              }}
            >
              {launchCtaLabel}
            </Link>
          </div>

          {/* Right — mini mockup */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: 'rgba(8,11,18,.9)',
                border: '1px solid var(--line)',
                boxShadow: '0 0 60px rgba(245,168,42,.05)',
              }}
            >
              {/* Window bar */}
              <div
                style={{
                  background: 'rgba(255,255,255,.03)',
                  borderBottom: '1px solid var(--line)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                ))}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-syne-mono), monospace',
                    fontSize: 9,
                    color: 'var(--muted)',
                  }}
                >
                  WeConnect · Global Supply &amp; Demand
                </span>
              </div>

              <div style={{ padding: 20 }}>
                {/* Search bar */}
                <div
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid var(--line)',
                    padding: '11px 14px',
                    marginBottom: 14,
                    fontFamily: 'var(--font-syne-mono), monospace',
                    fontSize: 10,
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  <span style={{ color: 'var(--amber)' }}>⟩</span>
                  Find lab space near NUS, biotech, SGD 5k/mo...
                </div>

                {/* Mock cards */}
                {[
                  { tag: 'OFFICE', tagBg: 'rgba(245,168,42,.1)', tagColor: 'var(--amber)', name: 'One-North Biopolis Lab Suite', loc: '📍 Singapore · From SGD 4,200/mo', pct: '93%', pctColor: '#22C55E', barW: '93%', barColor: 'linear-gradient(90deg,#22C55E,#4ADE80)' },
                  { tag: 'GRANT', tagBg: 'rgba(57,224,122,.1)', tagColor: '#22C55E', name: 'EDB Market Readiness Assistance', loc: '📍 Singapore · Up to SGD 100K', pct: '95%', pctColor: 'var(--amber)', barW: '95%', barColor: 'var(--amber)' },
                  { tag: 'MARKET', tagBg: 'rgba(59,130,246,.1)', tagColor: '#60A5FA', name: 'SEA 5-Country GTM Accelerator', loc: '📍 SG·MY·TH·VN·ID · SGD 18,000', pct: '88%', pctColor: '#60A5FA', barW: '88%', barColor: '#60A5FA' },
                ].map((card) => (
                  <div
                    key={card.name}
                    style={{
                      background: 'rgba(255,255,255,.02)',
                      border: '1px solid var(--line)',
                      padding: 14,
                      marginBottom: 9,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 8,
                          letterSpacing: 1,
                          padding: '3px 7px',
                          fontWeight: 700,
                          background: card.tagBg,
                          color: card.tagColor,
                          display: 'inline-block',
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2, color: 'var(--text)' }}>{card.name}</div>
                      <div style={{ fontSize: 9, color: 'var(--muted)' }}>{card.loc}</div>
                      <div style={{ height: 2, background: 'rgba(255,255,255,.05)', marginTop: 7, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: card.barColor, width: card.barW }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: card.pctColor, flexShrink: 0 }}>{card.pct}</div>
                  </div>
                ))}

                {/* AI chip */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    border: '1px solid rgba(245,168,42,.25)',
                    padding: '7px 12px',
                    fontSize: 10,
                    color: 'var(--amber)',
                    letterSpacing: 1,
                    marginTop: 14,
                  }}
                >
                  ✦ AI finding 12 more matches...
                </div>
              </div>
            </div>

            {/* Click overlay */}
            <Link
              href="/platform/spaces"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 20,
                background: 'linear-gradient(transparent 60%, rgba(5,6,10,.6))',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  color: 'var(--amber)',
                  fontSize: 12,
                  letterSpacing: 2,
                  fontWeight: 700,
                  border: '1px solid rgba(245,168,42,.4)',
                  padding: '8px 20px',
                  background: 'rgba(5,6,10,.8)',
                }}
              >
                OPEN PLATFORM →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
