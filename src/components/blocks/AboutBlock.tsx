/**
 * AboutBlock — "A Network Built on Genuine Trust" section.
 * Matches #about in /reference/pergroup-website.html.
 * Server component.
 */
import { RichText } from '@payloadcms/richtext-lexical/react'

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

// Globe dot positions matching the reference
const GLOBE_DOTS = [
  { top: '30%', left: '48%', delay: '0s', green: false },
  { top: '42%', left: '72%', delay: '.5s', green: true },
  { top: '55%', left: '30%', delay: '1s', green: false },
  { top: '25%', left: '60%', delay: '1.5s', green: true },
  { top: '68%', left: '55%', delay: '.3s', green: false },
  { top: '38%', left: '20%', delay: '.8s', green: true },
  { top: '60%', left: '75%', delay: '1.2s', green: false },
  { top: '20%', left: '35%', delay: '.6s', green: false },
]

export default function AboutBlock({
  sectionLabel = 'Who We Are · 我们是谁',
  headline = 'A Network Built on',
  headlineAccent = 'Genuine Trust',
  body,
  advantages = [],
  globeStat,
}: AboutBlockProps) {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '120px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left — text */}
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
                fontSize: 'clamp(34px, 4.5vw, 60px)',
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1,
                marginBottom: 28,
                color: 'var(--text)',
              }}
            >
              {headline}
              <br />
              <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>{headlineAccent}</em>
            </h2>

            {body && (
              <div style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--muted)', marginBottom: 28 }}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <RichText data={body as any} />
              </div>
            )}

            {/* Advantages 2×2 grid */}
            {advantages.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  marginTop: 44,
                }}
              >
                {advantages.map((adv) => (
                  <div
                    key={adv.title}
                    style={{
                      padding: '22px 24px',
                      border: '1px solid var(--line)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {adv.icon && <div style={{ fontSize: 18, marginBottom: 9 }}>{adv.icon}</div>}
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: 'var(--text)' }}>{adv.title}</div>
                    {adv.description && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{adv.description}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — globe visualisation */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 35% 35%, rgba(245,168,42,.08), transparent 60%), radial-gradient(circle at 70% 70%, rgba(57,224,122,.05), transparent 50%)',
                border: '1px solid rgba(245,168,42,.1)',
                overflow: 'hidden',
              }}
            >
              {/* Meridian lines */}
              {[0, 30, 60, 90, 120, 150].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    height: '100%',
                    borderLeft: '1px solid rgba(245,168,42,.07)',
                    transform: `rotate(${deg}deg)`,
                    transformOrigin: 'center',
                  }}
                />
              ))}
              {/* Parallel lines */}
              {['20%', '35%', '50%', '65%', '80%'].map((top) => (
                <div
                  key={top}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top,
                    borderTop: '1px solid rgba(245,168,42,.07)',
                  }}
                />
              ))}
              {/* Glowing dots */}
              {GLOBE_DOTS.map((dot, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: dot.green ? '#39E07A' : 'var(--amber)',
                    top: dot.top,
                    left: dot.left,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: dot.green
                      ? '0 0 12px rgba(57,224,122,.8)'
                      : '0 0 12px rgba(245,168,42,.8)',
                    animation: `gdotGlow 2s ${dot.delay} infinite alternate`,
                  }}
                />
              ))}
              {/* Centre stat */}
              {globeStat && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 68,
                      fontWeight: 800,
                      color: 'var(--amber)',
                      lineHeight: 1,
                    }}
                  >
                    {globeStat.number}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--muted)' }}>
                    {globeStat.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
