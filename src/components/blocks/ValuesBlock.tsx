/**
 * ValuesBlock — "Core Philosophy" section: Four Harmonies + Five Unities + mottos.
 * Adapted from per-group-connect-main PhilosophySection with glass cards.
 * Server component.
 */
import React from 'react'
import DotMotif from '@/components/DotMotif'

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
  headline = 'Core Philosophy',
  chineseHeadline = '四和五一',
  fourHarmoniesItems = [],
  fiveUnitiesItems = [],
  mottos = [],
}: ValuesBlockProps) {
  return (
    <section id="values" className="bg-bg py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-10 right-0 opacity-50">
        <DotMotif className="w-32 h-32" opacity={0.04} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-amber text-xs tracking-widest uppercase mb-3 font-sora">
            {sectionLabel}
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-pg-text">
            Rooted in <span className="text-amber">Harmony</span>
          </h2>
          <p className="font-noto-sans-sc text-muted text-lg mt-3">
            {chineseHeadline === '四和五一' ? '和而不同 · 美美与共' : chineseHeadline}
          </p>
        </div>

        {/* Two-column split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          {/* Left: Four Harmonies */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-amber font-sora font-extrabold text-sm">01</span>
              <div className="h-px flex-1 bg-line" />
              <h3 className="font-sora font-bold text-xl text-pg-text">Four Harmonies</h3>
              <span className="font-noto-sans-sc text-muted text-lg">四和</span>
            </div>

            <div className="flex items-center justify-center mb-8">
              <span className="font-noto-sans-sc text-green text-7xl font-bold opacity-80">和</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fourHarmoniesItems.map((item) => (
                <div key={item.english} className="glass-card rounded-xl p-5 text-center group hover:shadow-md transition-shadow">
                  <div className="font-noto-sans-sc text-green text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">
                    {item.chinese.charAt(0)}
                  </div>
                  <div className="font-sora font-semibold text-pg-text text-sm">{item.english}</div>
                  <div className="font-noto-sans-sc text-muted text-sm mt-1">{item.chinese}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Five Unities */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-amber font-sora font-extrabold text-sm">02</span>
              <div className="h-px flex-1 bg-line" />
              <h3 className="font-sora font-bold text-xl text-pg-text">Five Unities</h3>
              <span className="font-noto-sans-sc text-muted text-lg">五一</span>
            </div>

            <div className="flex items-center justify-center mb-8">
              <span className="font-noto-sans-sc text-deep-orange text-7xl font-bold opacity-80">爱</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fiveUnitiesItems.map((item) => (
                <div key={item.english} className="glass-card rounded-xl p-5 text-center group hover:shadow-md transition-shadow">
                  <div className="font-noto-sans-sc text-deep-orange text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">
                    {item.chinese.charAt(0)}
                  </div>
                  <div className="font-sora font-semibold text-pg-text text-sm">{item.english}</div>
                  <div className="text-muted text-xs mt-1">{item.chinese}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motto row */}
        {mottos.length > 0 && (
          <div className="mt-8 glass-card rounded-xl p-8 md:p-10 flex flex-wrap gap-8 md:gap-14 items-center justify-center">
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
    </section>
  )
}
