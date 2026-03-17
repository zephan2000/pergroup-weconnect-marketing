/**
 * StatsBlock — standalone stat card row.
 * Used when stats need to appear as their own page section.
 * Matches .stat-card in /reference/pergroup-website.html.
 */

type StatItem = {
  number: string
  label: string
  chineseLabel?: string
}

type StatsBlockProps = {
  stats: StatItem[]
}

export default function StatsBlock({ stats = [] }: StatsBlockProps) {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '80px 80px',
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(stats.length, 1)}, 1fr)`,
          border: '1px solid var(--line)',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: '32px 36px',
              borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none',
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
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 6 }}>
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
        ))}
      </div>
    </section>
  )
}
