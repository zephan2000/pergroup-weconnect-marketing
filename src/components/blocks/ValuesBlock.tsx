/**
 * ValuesBlock — "Core Philosophy" section with original concentric-ring
 * and spinning-petal visualizations, adapted to warm light aesthetic.
 * Server component — spinning animation driven by CSS @keyframes spinSlow.
 */
import React from 'react'

type HarmonyItem = { chinese: string; english: string }
type FiveUnityItem = { chinese: string; english: string }
type MottoItem = { label: string; chinese: string; english: string }

type ValuesBlockProps = {
  sectionLabel?: string
  headline?: string
  chineseHeadline?: string
  fourHarmoniesItems?: HarmonyItem[]
  fiveUnitiesItems?: FiveUnityItem[]
  mottos?: MottoItem[]
}

export default function ValuesBlock({
  sectionLabel = 'Our Philosophy · 我们的哲学',
  headline: _headline = 'Core Philosophy',
  chineseHeadline = '四和五一',
  fourHarmoniesItems = [],
  fiveUnitiesItems = [],
  mottos = [],
}: ValuesBlockProps) {
  return (
    <section
      id="values"
      className="relative z-10 flex items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, hsl(33 100% 95%) 0%, hsl(40 33% 97%) 100%)',
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-20 py-20 md:py-28">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-px bg-amber inline-block" />
            <span className="font-inter text-xs tracking-[3px] text-amber uppercase">{sectionLabel}</span>
          </div>
          <h2 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-3 text-pg-text">
            Core Philosophy
          </h2>
          <div className="font-noto-sans-sc text-2xl md:text-4xl text-amber tracking-[8px]">
            {chineseHeadline}
          </div>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
          {/* Panel 1 — Four Harmonies */}
          <div className="p-8 md:p-14 glass-card rounded-none md:rounded-l-xl border border-line reveal">
            <div className="text-[10px] tracking-[3px] text-muted mb-5 font-inter">
              01 — FOUR HARMONIES
            </div>
            <div className="font-noto-sans-sc text-5xl md:text-6xl font-bold leading-none mb-1 text-green">
              四和
            </div>
            <div className="text-xs tracking-[4px] text-muted mb-10">FOUR HARMONIES</div>

            {/* Concentric rings visualization */}
            <div className="relative w-[200px] h-[200px] mx-auto mb-10 reveal">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid hsla(140,35%,44%,.25)' }} />
              {/* Middle ring */}
              <div className="absolute rounded-full" style={{ inset: 28, border: '1px solid hsla(140,35%,44%,.35)' }} />
              {/* Center */}
              <div
                className="absolute rounded-full flex items-center justify-center flex-col"
                style={{
                  inset: 58,
                  background: 'hsla(140,35%,44%,.08)',
                  border: '1px solid hsla(140,35%,44%,.45)',
                }}
              >
                <span className="font-noto-sans-sc text-3xl text-green">和</span>
                <span className="text-[9px] text-muted tracking-[2px] mt-1">HARMONY</span>
              </div>
              {/* Spokes */}
              {[-90, 0, 90, 180].map((deg) => (
                <div
                  key={deg}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: 100,
                    height: 1,
                    background: 'linear-gradient(90deg, hsla(140,35%,44%,.45), transparent)',
                    transformOrigin: 'left center',
                    transform: `rotate(${deg}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {fourHarmoniesItems.map((item) => (
                <div
                  key={item.chinese}
                  className="p-3.5 border border-line rounded-lg hover:border-green/30 transition-colors"
                >
                  <div className="font-noto-sans-sc text-sm text-green mb-0.5">{item.chinese}</div>
                  <div className="text-[11px] text-muted">{item.english}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2 — Five Unities */}
          <div className="p-8 md:p-14 glass-card rounded-none md:rounded-r-xl border border-line reveal">
            <div className="text-[10px] tracking-[3px] text-muted mb-5 font-inter">
              02 — FIVE UNITIES
            </div>
            <div className="font-noto-sans-sc text-5xl md:text-6xl font-bold leading-none mb-1 text-amber">
              五一
            </div>
            <div className="text-xs tracking-[4px] text-muted mb-10">FIVE UNITIES</div>

            {/* Spinning petals visualization */}
            <div className="relative w-[220px] h-[220px] mx-auto mb-10 reveal">
              {/* Rotating petals */}
              <div className="absolute inset-0" style={{ animation: 'spinSlow 22s linear infinite' }}>
                {[0, 72, 144, 216, 288].map((deg) => (
                  <div
                    key={deg}
                    className="absolute"
                    style={{
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
              {/* Character labels on spokes */}
              <div className="font-noto-sans-sc text-sm font-bold text-amber absolute" style={{ top: '12%', left: '55%', transform: 'translate(-50%,-50%)' }}>艺</div>
              <div className="font-noto-sans-sc text-sm font-bold text-amber absolute" style={{ top: '47%', right: '5%', transform: 'translate(50%,-50%)' }}>医</div>
              <div className="font-noto-sans-sc text-sm font-bold text-amber absolute" style={{ top: '80%', right: '13%', transform: 'translate(50%,-50%)' }}>义</div>
              <div className="font-noto-sans-sc text-sm font-bold text-amber absolute" style={{ top: '80%', left: '13%', transform: 'translate(-50%,-50%)' }}>易</div>
              <div className="font-noto-sans-sc text-sm font-bold text-amber absolute" style={{ top: '34%', left: '2%', transform: 'translate(-50%,-50%)' }}>爱</div>
              {/* Core circle */}
              <div
                className="absolute rounded-full flex items-center justify-center flex-col"
                style={{
                  inset: 65,
                  background: 'radial-gradient(circle, hsla(36,90%,47%,.1), transparent 70%)',
                  border: '1px solid hsla(36,90%,47%,.35)',
                }}
              >
                <span className="font-noto-sans-sc text-3xl text-amber">爱</span>
                <span className="text-[9px] text-muted tracking-[2px] mt-1">LOVE</span>
              </div>
            </div>

            {/* Items row */}
            <div className="flex gap-1.5">
              {fiveUnitiesItems.map((item) => (
                <div
                  key={item.chinese}
                  className="flex-1 text-center p-3 border border-amber/20 rounded-lg hover:bg-amber/5 hover:border-amber/40 transition-all"
                >
                  <div className="font-noto-sans-sc text-xl text-amber">{item.chinese}</div>
                  <div className="text-[9px] text-muted mt-1 tracking-wide">{item.english}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Motto row — spans full width */}
          {mottos.length > 0 && (
            <div className="col-span-1 md:col-span-2 glass-card rounded-none md:rounded-b-xl border border-line p-8 md:p-12 flex flex-wrap gap-10 md:gap-14 items-center justify-center reveal"
              style={{ background: 'hsla(36,90%,47%,.03)' }}
            >
              {mottos.map((motto, i) => (
                <React.Fragment key={motto.label}>
                  <div className="text-center">
                    <div className="text-[10px] tracking-[3px] text-muted mb-2 uppercase">{motto.label}</div>
                    <div className="font-noto-sans-sc text-2xl text-amber">{motto.chinese}</div>
                    <div className="text-xs text-muted mt-1 tracking-wide">{motto.english}</div>
                  </div>
                  {i < mottos.length - 1 && (
                    <div className="hidden md:block w-px h-16 bg-line flex-shrink-0" />
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
