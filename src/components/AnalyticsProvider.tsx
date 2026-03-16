'use client'
/**
 * AnalyticsProvider — initialises Firebase Analytics once on first client render.
 *
 * Added to root layout so Analytics is active on every page.
 * Must be a client component ('use client') because it uses useEffect and
 * accesses window — it must not run on the server.
 */
import { useEffect } from 'react'
import { initFirebase } from '@/lib/analytics/firebase'

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initFirebase()
  }, []) // empty dep array — runs once after first mount

  return <>{children}</>
}
