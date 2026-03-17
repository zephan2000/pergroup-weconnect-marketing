/**
 * ClientsBlock — scrolling marquee of client/partner names.
 * Matches #clients in /reference/pergroup-website.html.
 * Server component — marquee animation driven by CSS @keyframes marquee in globals.css.
 * The client list is duplicated inside the component to create a seamless infinite loop.
 */

type ClientItem = { name: string }

type ClientsBlockProps = {
  sectionLabel?: string
  headline?: string
  clients?: ClientItem[]
}

export default function ClientsBlock({
  sectionLabel = 'Trusted By · 合作客户',
  headline = 'Global Industry Leaders',
  clients = [],
}: ClientsBlockProps) {
  return (
    <section
      id="clients"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--bg2)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '70px 80px' }}>
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
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 800,
            letterSpacing: -2,
            marginBottom: 52,
            color: 'var(--text)',
          }}
        >
          {headline}
        </h2>

        {/* Marquee — list is doubled so the animation loops seamlessly */}
        <div
          style={{
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'marquee 28s linear infinite',
            }}
          >
            {/* Render twice for seamless loop */}
            {[...clients, ...clients].map((client, i) => (
              <div
                key={i}
                style={{
                  padding: '15px 34px',
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  whiteSpace: 'nowrap',
                  color: 'var(--muted)',
                  flexShrink: 0,
                  borderRight: 'none',
                }}
              >
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
