/**
 * /platform/spaces — WeConnect Spaces listing (v1, live Supabase data).
 *
 * STUB: renders placeholder text. Full implementation reads from
 * weconnect.listings via /src/lib/weconnect/listings.ts.
 *
 * When implementing:
 *  import { getSpacesListings } from '@/lib/weconnect/listings'
 *  const listings = await getSpacesListings()
 */
export default function SpacesPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0F1117',
        color: '#E8EAF0',
        padding: '4rem 2rem',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '2px',
          color: '#F5A623',
          marginBottom: '1rem',
        }}
      >
        WECONNECT — SPACES
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        WeConnect — Spaces (v1)
      </h1>
      <p style={{ color: 'rgba(232,234,240,0.45)', fontSize: '14px', marginBottom: '2rem' }}>
        Live listings from Supabase. Full UI coming next sprint.
      </p>
      <a
        href="/"
        style={{ color: '#F5A623', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}
      >
        ← Back to PER GROUP
      </a>
    </main>
  )
}
