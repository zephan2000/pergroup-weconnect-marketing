/**
 * Marketing layout — wraps all PER GROUP marketing routes.
 *
 * globals.css (Tailwind directives + preflight reset) is imported HERE,
 * not in the root layout, so Tailwind's CSS reset never fires on /admin.
 *
 * WeConnectProvider wraps everything so Nav triggers, Hero CTA buttons,
 * and the WeConnectOverlay all share the same open/close state.
 *
 * PlatformSettings is fetched from Payload at render time so CMS editors
 * can update overlay copy without a code deployment.
 */
import '../globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { WeConnectProvider } from '@/lib/weconnect/context'
import WeConnectOverlay from '@/components/WeConnectOverlay'
import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettingsData,
} from '@/lib/weconnect/platform-settings'

async function fetchPlatformSettings(): Promise<PlatformSettingsData> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })
    // findGlobal returns the saved document or field defaults if never saved.
    const doc = await payload.findGlobal({ slug: 'platform-settings' })
    return {
      aiMatchingHeadline: doc.aiMatchingHeadline ?? DEFAULT_PLATFORM_SETTINGS.aiMatchingHeadline,
      aiMatchingDescription:
        doc.aiMatchingDescription ?? DEFAULT_PLATFORM_SETTINGS.aiMatchingDescription,
      aiMatchingPlaceholder:
        doc.aiMatchingPlaceholder ?? DEFAULT_PLATFORM_SETTINGS.aiMatchingPlaceholder,
      fundingPlaceholderTitle:
        doc.fundingPlaceholderTitle ?? DEFAULT_PLATFORM_SETTINGS.fundingPlaceholderTitle,
      fundingPlaceholderBody:
        doc.fundingPlaceholderBody ?? DEFAULT_PLATFORM_SETTINGS.fundingPlaceholderBody,
      marketsPlaceholderTitle:
        doc.marketsPlaceholderTitle ?? DEFAULT_PLATFORM_SETTINGS.marketsPlaceholderTitle,
      marketsPlaceholderBody:
        doc.marketsPlaceholderBody ?? DEFAULT_PLATFORM_SETTINGS.marketsPlaceholderBody,
    }
  } catch {
    // DB not available (local dev without Supabase, or cold start error) — use defaults.
    return DEFAULT_PLATFORM_SETTINGS
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchPlatformSettings()

  return (
    <WeConnectProvider>
      <div className="bg-bg text-pg-text font-syne antialiased min-h-screen">
        <Nav />
        {children}
        <Footer />
      </div>
      {/* Overlay sits outside the page div so it can cover Nav/Footer too */}
      <WeConnectOverlay settings={settings} />
    </WeConnectProvider>
  )
}
