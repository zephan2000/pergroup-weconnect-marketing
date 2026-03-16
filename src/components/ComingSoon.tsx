/**
 * ComingSoon — shared placeholder for /platform/funding and /platform/markets.
 * Per CLAUDE.md WeConnect v1 Scope: these tabs are placeholder only.
 */
interface ComingSoonProps {
  section: string
}

export default function ComingSoon({ section }: ComingSoonProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0F1117',
        color: '#E8EAF0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#F5A623',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
        }}
      >
        WeConnect — {section}
      </p>
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          letterSpacing: '-0.5px',
        }}
      >
        We&apos;re still building this out
      </h1>
      <p
        style={{
          color: 'rgba(232,234,240,0.45)',
          fontSize: '14px',
          maxWidth: '380px',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}
      >
        This section is on the roadmap. Check back soon or explore Spaces in the
        meantime.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/platform/spaces"
          style={{
            background: '#F5A623',
            color: '#05060A',
            padding: '10px 24px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          Explore Spaces →
        </a>
        <a
          href="/"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(232,234,240,0.6)',
            padding: '10px 24px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          ← Back to PER GROUP
        </a>
      </div>
    </main>
  )
}
