/**
 * Marketing layout — wraps all PER GROUP marketing routes.
 *
 * globals.css (Tailwind directives + preflight reset) is imported HERE,
 * not in the root layout, so Tailwind's CSS reset never fires on /admin.
 * Payload's admin has its own complete CSS and must not be disrupted by
 * Tailwind's preflight or our * { margin:0; padding:0 } reset.
 */
import '../globals.css'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-bg text-pg-text font-syne antialiased min-h-screen">
      {children}
    </div>
  )
}
