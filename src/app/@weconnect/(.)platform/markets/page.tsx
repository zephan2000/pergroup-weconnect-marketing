/**
 * Intercepting route for /platform/markets.
 * The WeConnectOverlay is already rendered in (marketing)/layout.tsx —
 * this slot only needs to exist so Next.js activates the parallel route.
 * Tab switching is handled by WeConnectContext.
 */
export default function WeConnectMarketsIntercepted() {
  return null
}
