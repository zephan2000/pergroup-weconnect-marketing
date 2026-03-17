/**
 * Nav — fixed top navigation bar for all PER GROUP marketing routes.
 * Matches the <nav> in /reference/pergroup-website.html.
 * Server component — WeConnect buttons are client components (WeConnectTrigger).
 */
import Link from 'next/link'
import WeConnectTrigger from '@/components/WeConnectTrigger'

export default function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: 'rgba(5,6,10,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: 'var(--amber)',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 13,
            color: 'var(--bg)',
            flexShrink: 0,
          }}
        >
          P
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}
        >
          PER GROUP
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 38, alignItems: 'center' }}>
        {[
          { label: 'Philosophy', href: '/#values' },
          { label: 'About', href: '/#about' },
          { label: 'Services', href: '/#services' },
          { label: 'Partners', href: '/#clients' },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              textDecoration: 'none',
              color: 'var(--muted)',
              fontSize: 13,
              letterSpacing: 1,
            }}
            className="nav-link"
          >
            {label}
          </Link>
        ))}
        <WeConnectTrigger
          tab="spaces"
          style={{
            color: 'var(--amber)',
            fontSize: 13,
            letterSpacing: 1,
            fontFamily: 'inherit',
          }}
        >
          WeConnect ✦
        </WeConnectTrigger>
      </div>

      {/* CTA */}
      <WeConnectTrigger
        tab="spaces"
        style={{
          border: '1px solid rgba(245,168,42,0.4)',
          color: 'var(--amber)',
          padding: '9px 22px',
          fontSize: 12,
          letterSpacing: 2,
          fontWeight: 700,
          textTransform: 'uppercase',
          fontFamily: 'inherit',
        }}
      >
        WeConnect Platform →
      </WeConnectTrigger>
    </nav>
  )
}
