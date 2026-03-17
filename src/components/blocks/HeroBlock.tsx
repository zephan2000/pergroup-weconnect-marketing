/**
 * HeroBlock — full-screen hero section.
 * Matches #hero in /reference/pergroup-website.html.
 * Server component — all animations are CSS-driven via globals.css keyframes.
 *
 * CTA buttons are rendered by HeroCTAButtons (client component) so that
 * /platform/* buttons open the WeConnect overlay instead of navigating.
 */
import HeroCTAButtons from '@/components/HeroCTAButtons'

type HeroStat = {
  number: string
  label: string
  chineseLabel?: string
}

type HeroButton = {
  label: string
  href: string
  variant: 'fill' | 'ghost' | 'weconnect'
}

type HeroBlockProps = {
  eyebrow?: string
  headline?: string
  headlineAccent?: string
  headlineFaint?: string
  chineseSubtitle?: string
  ctaButtons?: HeroButton[]
  stats?: HeroStat[]
}

export default function HeroBlock({
  eyebrow,
  headline,
  headlineAccent,
  headlineFaint,
  chineseSubtitle,
  ctaButtons = [],
  stats = [],
}: HeroBlockProps) {
  // Split stats: first 2 are full-width cards, items 3+4 go side-by-side
  const fullStats = stats.slice(0, 2)
  const splitStats = stats.slice(2, 4)

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(245,168,42,.04), transparent 70%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(57,224,122,.03), transparent 60%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '120px 80px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: stats.length ? '1fr 400px' : '1fr',
            gap: 60,
            alignItems: 'center',
          }}
        >
          {/* Left — text content */}
          <div>
            {eyebrow && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(245,168,42,.25)',
                  padding: '7px 16px',
                  marginBottom: 36,
                  fontSize: 11,
                  letterSpacing: 2,
                  color: 'var(--amber)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--amber)',
                    display: 'inline-block',
                    animation: 'pulse 2s infinite',
                    flexShrink: 0,
                  }}
                />
                {eyebrow}
              </div>
            )}

            <h1
              style={{
                fontSize: 'clamp(50px, 5.5vw, 84px)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: -2,
                marginBottom: 8,
              }}
            >
              {headline && <span style={{ display: 'block' }}>{headline}</span>}
              {headlineAccent && (
                <span
                  style={{
                    display: 'block',
                    background: 'linear-gradient(90deg, var(--amber) 0%, #FFD080 50%, var(--amber) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200%',
                    animation: 'shimmer 4s linear infinite',
                  }}
                >
                  {headlineAccent}
                </span>
              )}
              {headlineFaint && (
                <span style={{ display: 'block', color: 'var(--faint)' }}>
                  {headlineFaint}
                </span>
              )}
            </h1>

            {chineseSubtitle && (
              <p
                style={{
                  fontFamily: 'var(--font-noto-serif-sc), serif',
                  fontSize: 17,
                  color: 'var(--muted)',
                  letterSpacing: 6,
                  margin: '26px 0 44px',
                  fontWeight: 300,
                }}
              >
                {chineseSubtitle}
              </p>
            )}

            {ctaButtons.length > 0 && <HeroCTAButtons buttons={ctaButtons} />}
          </div>

          {/* Right — stat cards */}
          {stats.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fullStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
              {splitStats.length === 2 && (
                <div
                  style={{
                    border: '1px solid var(--line)',
                    padding: '26px 30px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ paddingRight: 20, borderRight: '1px solid var(--line)' }}>
                    <MiniStat stat={splitStats[0]} />
                  </div>
                  <div style={{ paddingLeft: 20 }}>
                    <MiniStat stat={splitStats[1]} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'var(--faint)',
          fontSize: 10,
          letterSpacing: 3,
        }}
      >
        <div
          style={{
            width: 1,
            height: 44,
            background: 'linear-gradient(var(--amber), transparent)',
            animation: 'scrollLine 2s infinite',
          }}
        />
        SCROLL
      </div>
    </section>
  )
}

function StatCard({ stat }: { stat: HeroStat }) {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        padding: '26px 30px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--amber), #FFD080)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {stat.number}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 5 }}>
        {stat.label}
        {stat.chineseLabel && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-noto-serif-sc), serif',
              fontSize: 10,
              color: 'var(--faint)',
              marginTop: 2,
            }}
          >
            {stat.chineseLabel}
          </span>
        )}
      </div>
    </div>
  )
}

function MiniStat({ stat }: { stat: HeroStat }) {
  return (
    <>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--amber), #FFD080)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {stat.number}
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, marginTop: 5 }}>
        {stat.label}
        {stat.chineseLabel && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-noto-serif-sc), serif',
              fontSize: 9,
              color: 'var(--faint)',
              marginTop: 2,
            }}
          >
            {stat.chineseLabel}
          </span>
        )}
      </div>
    </>
  )
}
