/**
 * Footer — site footer for all PER GROUP marketing routes.
 * Matches <footer> in /reference/pergroup-website.html.
 * Server component.
 */
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--bg2)',
          borderTop: '1px solid var(--line)',
          padding: '70px 80px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 56,
        }}
      >
        {/* Col 1 — Brand */}
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, marginBottom: 14, color: 'var(--text)' }}>
            PER GROUP
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.9, maxWidth: 260 }}>
            A globalized tech innovation ecosystem. Making innovation open to anyone, anywhere.
            <br /><br />以商载道，共创共生
          </p>
          <div style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)' }}>
            CEO: Kelly Chen
            <br />
            <a href="mailto:cxy@e-harbor.com" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
              cxy@e-harbor.com
            </a>
          </div>
        </div>

        {/* Col 2 — Platform */}
        <div>
          <h4 style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', marginBottom: 18, textTransform: 'uppercase' }}>
            Platform · 平台
          </h4>
          <Link href="/platform/spaces" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>
            WeConnect ✦
          </Link>
          <a href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>PERE Enterprise Center</a>
          <a href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>e创码头 E-Harbor</a>
          <a href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>Global Entrepreneur Club</a>
        </div>

        {/* Col 3 — Services */}
        <div>
          <h4 style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', marginBottom: 18, textTransform: 'uppercase' }}>
            Services · 服务
          </h4>
          {['Market Entry', 'IP & Compliance', 'Green / ESG', 'Acceleration'].map((s) => (
            <a key={s} href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>{s}</a>
          ))}
        </div>

        {/* Col 4 — Philosophy */}
        <div>
          <h4 style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', marginBottom: 18, textTransform: 'uppercase' }}>
            Philosophy · 价值观
          </h4>
          <Link href="/#values" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>四和 Four Harmonies</Link>
          <Link href="/#values" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>五一 Five Unities</Link>
          <a href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>Social Enterprise</a>
          <a href="#" style={{ display: 'block', color: 'var(--muted)', textDecoration: 'none', fontSize: 12, marginBottom: 10 }}>Sustainability</a>
        </div>
      </footer>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--bg)',
          borderTop: '1px solid var(--line)',
          padding: '18px 80px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--faint)',
          letterSpacing: 1,
        }}
      >
        <span>© 2025 PER GROUP. All rights reserved.</span>
        <span>科技创新 · 商业赋能 · 人文关怀</span>
      </div>
    </>
  )
}
