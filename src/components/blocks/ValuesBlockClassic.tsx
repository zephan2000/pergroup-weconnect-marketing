/**
 * ValuesBlockClassic — Original dark "Core Philosophy" section with concentric rings
 * and spinning petals. Preserved for A/B testing against the new glass-card variant.
 *
 * To use: change BlockRenderer to map 'values' → ValuesBlockClassic instead of ValuesBlock.
 * Or use the `variant` field on the Payload block to select at runtime.
 *
 * Server component — spinning animation driven by CSS @keyframes spinSlow.
 */
import React from 'react'

type HarmonyItem = { chinese: string; english: string }
type FiveUnityItem = { chinese: string; english: string }
type MottoItem = { label: string; chinese: string; english: string }

type ValuesBlockClassicProps = {
  sectionLabel?: string
  headline?: string
  chineseHeadline?: string
  fourHarmoniesItems?: HarmonyItem[]
  fiveUnitiesItems?: FiveUnityItem[]
  mottos?: MottoItem[]
}

export default function ValuesBlockClassic({
  sectionLabel = 'Our Philosophy · 我们的哲学',
  headline = 'Core Philosophy',
  chineseHeadline = '四和五一',
  fourHarmoniesItems = [],
  fiveUnitiesItems = [],
  mottos = [],
}: ValuesBlockClassicProps) {
  return (
    <section
      id="values"
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        background: 'hsl(20 10% 7%)',
        color: 'hsl(40 33% 93%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '100px 80px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <div
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 11,
              letterSpacing: 3,
              color: 'var(--amber)',
              textTransform: 'uppercase',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 30, height: 1, background: 'var(--amber)', display: 'inline-block' }} />
            {sectionLabel}
          </div>
          <h2
            style={{
              fontSize: 'clamp(38px, 5vw, 68px)',
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            {headline}
          </h2>
          <div
            className="font-noto-sans-sc"
            style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              color: 'var(--amber)',
              letterSpacing: 8,
            }}
          >
            {chineseHeadline}
          </div>
        </div>

        {/* 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Panel 1 — Four Harmonies */}
          <div
            style={{
              padding: 56,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,.01)',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.45)', marginBottom: 22 }}>
              01 — FOUR HARMONIES
            </div>
            <div
              className="font-noto-sans-sc"
              style={{ fontSize: 60, fontWeight: 700, lineHeight: 1, marginBottom: 4, color: 'hsl(140 35% 44%)' }}
            >
              四和
            </div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: 'rgba(255,255,255,0.45)', marginBottom: 44 }}>FOUR HARMONIES</div>

            {/* Harmony visualisation */}
            <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 44px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(57,224,122,.2)' }} />
              <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', border: '1px solid rgba(57,224,122,.3)' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 58,
                  borderRadius: '50%',
                  background: 'rgba(57,224,122,.06)',
                  border: '1px solid rgba(57,224,122,.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <span className="font-noto-sans-sc" style={{ fontSize: 28, color: 'hsl(140 35% 44%)' }}>和</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, marginTop: 3 }}>HARMONY</span>
              </div>
              {[-90, 0, 90, 180].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 100,
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(57,224,122,.5), transparent)',
                    transformOrigin: 'left center',
                    transform: `rotate(${deg}deg)`,
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {fourHarmoniesItems.map((item) => (
                <div key={item.chinese} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
                  <div className="font-noto-sans-sc" style={{ fontSize: 13, color: 'hsl(140 35% 44%)', marginBottom: 3 }}>{item.chinese}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{item.english}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2 — Five Unities */}
          <div
            style={{
              padding: 56,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,.01)',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.45)', marginBottom: 22 }}>
              02 — FIVE UNITIES
            </div>
            <div
              className="font-noto-sans-sc"
              style={{ fontSize: 60, fontWeight: 700, lineHeight: 1, marginBottom: 4, color: 'var(--amber)' }}
            >
              五一
            </div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: 'rgba(255,255,255,0.45)', marginBottom: 44 }}>FIVE UNITIES</div>

            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 44px' }}>
              <div style={{ position: 'absolute', inset: 0, animation: 'spinSlow 22s linear infinite' }}>
                {[0, 72, 144, 216, 288].map((deg) => (
                  <div
                    key={deg}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      width: 1,
                      height: 110,
                      background: 'linear-gradient(var(--amber), transparent)',
                      transformOrigin: '50% 100%',
                      transform: `rotate(${deg}deg)`,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 65,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245,168,42,.12), transparent 70%)',
                  border: '1px solid rgba(245,168,42,.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <span className="font-noto-sans-sc" style={{ fontSize: 28, color: 'var(--amber)' }}>爱</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, marginTop: 3 }}>LOVE</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 7 }}>
              {fiveUnitiesItems.map((item) => (
                <div
                  key={item.chinese}
                  style={{
                    border: '1px solid rgba(245,168,42,.2)',
                    padding: '11px 14px',
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <div className="font-noto-sans-sc" style={{ fontSize: 20, color: 'var(--amber)' }}>{item.chinese}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 3, letterSpacing: 1 }}>{item.english}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Motto row */}
          {mottos.length > 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '44px 56px',
                display: 'flex',
                gap: 56,
                alignItems: 'center',
                background: 'rgba(245,168,42,.02)',
              }}
            >
              {mottos.map((motto, i) => (
                <React.Fragment key={motto.label}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.45)', marginBottom: 9 }}>{motto.label}</div>
                    <div className="font-noto-sans-sc" style={{ fontSize: 26, color: 'var(--amber)' }}>{motto.chinese}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 5, letterSpacing: 1 }}>{motto.english}</div>
                  </div>
                  {i < mottos.length - 1 && (
                    <div style={{ width: 1, height: 72, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
