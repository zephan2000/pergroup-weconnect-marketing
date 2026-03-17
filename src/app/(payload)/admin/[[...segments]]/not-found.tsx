/**
 * 404 handler within the Payload admin route group.
 * Keeps the user inside the admin context if they navigate to a non-existent admin path.
 */
import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div
      style={{
        padding: '3rem',
        fontFamily: 'sans-serif',
        background: '#0F1117',
        color: '#E8EAF0',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>404 — Page not found</h1>
      <Link href="/admin" style={{ color: '#F5A623' }}>
        ← Return to admin
      </Link>
    </div>
  )
}
