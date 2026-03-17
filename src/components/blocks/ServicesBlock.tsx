/**
 * ServicesBlock — "End-to-End Global Services" 3-column grid.
 * Matches #services in /reference/pergroup-website.html.
 * Server component.
 */

type ServiceItem = {
  number: string
  icon?: string
  title: string
  chineseTitle?: string
  description?: string
}

type ServicesBlockProps = {
  sectionLabel?: string
  headline?: string
  headlineAccent?: string
  services?: ServiceItem[]
}

export default function ServicesBlock({
  sectionLabel = 'What We Do · 服务内容',
  headline = 'End-to-End',
  headlineAccent = 'Global Services',
  services = [],
}: ServicesBlockProps) {
  return (
    <section
      id="services"
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg2)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '120px 80px' }}>
        {/* Heading */}
        <div style={{ marginBottom: 56 }}>
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
              color: 'var(--text)',
            }}
          >
            {headline}
            <br />
            <span style={{ color: 'var(--amber)' }}>{headlineAccent}</span>
          </h2>
        </div>

        {/* 3-column service grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--line)',
          }}
        >
          {services.map((svc, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            const totalRows = Math.ceil(services.length / 3)
            const isLastRow = row === totalRows - 1
            const isLastCol = col === 2

            return (
              <div
                key={svc.number}
                style={{
                  padding: '44px 38px',
                  borderRight: isLastCol ? 'none' : '1px solid var(--line)',
                  borderBottom: isLastRow ? 'none' : '1px solid var(--line)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-syne-mono), monospace',
                    fontSize: 10,
                    color: 'var(--faint)',
                    marginBottom: 18,
                    letterSpacing: 2,
                  }}
                >
                  {svc.number}
                </div>
                {svc.icon && (
                  <div style={{ fontSize: 26, marginBottom: 18 }}>{svc.icon}</div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 5, color: 'var(--text)' }}>
                  {svc.title}
                </div>
                {svc.chineseTitle && (
                  <div
                    style={{
                      fontFamily: 'var(--font-noto-serif-sc), serif',
                      fontSize: 11,
                      color: 'var(--amber)',
                      marginBottom: 12,
                      letterSpacing: 2,
                    }}
                  >
                    {svc.chineseTitle}
                  </div>
                )}
                {svc.description && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                    {svc.description}
                  </div>
                )}
                {/* Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 28,
                    right: 28,
                    fontSize: 16,
                    color: 'var(--faint)',
                  }}
                >
                  ↗
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
