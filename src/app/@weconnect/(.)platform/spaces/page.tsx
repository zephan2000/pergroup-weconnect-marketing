/**
 * Intercepting route — activates when the user navigates client-side to
 * /platform/spaces from within the app (e.g. clicking "WeConnect Platform →").
 *
 * This renders the WeConnect overlay ON TOP of the current page instead of
 * navigating away. On direct access / refresh, Next.js bypasses this file
 * entirely and renders src/app/(marketing)/platform/spaces/page.tsx instead.
 */
import WeConnectOverlay from '@/components/WeConnectOverlay'

export default function WeConnectSpacesIntercepted() {
  return <WeConnectOverlay activeTab="spaces" />
}
