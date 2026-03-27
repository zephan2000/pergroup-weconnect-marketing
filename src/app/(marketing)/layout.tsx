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
import CursorEffect from '@/components/CursorEffect'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { WeConnectProvider } from '@/lib/weconnect/context'
import WeConnectOverlay from '@/components/WeConnectOverlay'
import { fontVariables } from '../fonts'
import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettingsData,
} from '@/lib/weconnect/platform-settings'

/** Color variable names that map from SiteSettings fields to CSS custom properties. */
const COLOR_VAR_MAP: Record<string, string> = {
  amber: '--amber',
  green: '--green',
  bg: '--bg',
  bg2: '--bg2',
  text: '--text',
  muted: '--muted',
  line: '--line',
}

async function fetchPayloadData() {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const [platformDoc, siteDoc] = await Promise.all([
      payload.findGlobal({ slug: 'platform-settings' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])

    const d = DEFAULT_PLATFORM_SETTINGS
    const p = platformDoc as unknown as Record<string, unknown>
    const platformSettings: PlatformSettingsData = {
      aiMatchingHeadline: (p.aiMatchingHeadline as string) ?? d.aiMatchingHeadline,
      aiMatchingDescription: (p.aiMatchingDescription as string) ?? d.aiMatchingDescription,
      aiMatchingPlaceholder: (p.aiMatchingPlaceholder as string) ?? d.aiMatchingPlaceholder,
      fundingPlaceholderTitle: (p.fundingPlaceholderTitle as string) ?? d.fundingPlaceholderTitle,
      fundingPlaceholderBody: (p.fundingPlaceholderBody as PlatformSettingsData['fundingPlaceholderBody']) ?? d.fundingPlaceholderBody,
      marketsPlaceholderTitle: (p.marketsPlaceholderTitle as string) ?? d.marketsPlaceholderTitle,
      marketsPlaceholderBody: (p.marketsPlaceholderBody as PlatformSettingsData['marketsPlaceholderBody']) ?? d.marketsPlaceholderBody,
      // Contact Modal
      contactModalHeading: (p.contactModalHeading as string) ?? d.contactModalHeading,
      contactModalSuccessTitle: (p.contactModalSuccessTitle as string) ?? d.contactModalSuccessTitle,
      contactModalSuccessMessage: (p.contactModalSuccessMessage as string) ?? d.contactModalSuccessMessage,
      detailLabelSize: (p.detailLabelSize as string) ?? d.detailLabelSize,
      detailLabelZone: (p.detailLabelZone as string) ?? d.detailLabelZone,
      detailLabelSetup: (p.detailLabelSetup as string) ?? d.detailLabelSetup,
      detailLabelLease: (p.detailLabelLease as string) ?? d.detailLabelLease,
      detailLabelPrice: (p.detailLabelPrice as string) ?? d.detailLabelPrice,
      // Requirement Modal
      requirementModalHeading: (p.requirementModalHeading as string) ?? d.requirementModalHeading,
      requirementModalDescription: (p.requirementModalDescription as string) ?? d.requirementModalDescription,
      requirementModalSuccessTitle: (p.requirementModalSuccessTitle as string) ?? d.requirementModalSuccessTitle,
      requirementModalSuccessMessage: (p.requirementModalSuccessMessage as string) ?? d.requirementModalSuccessMessage,
    }

    // Build CSS variable overrides from SiteSettings color fields.
    const colorOverrides: Record<string, string> = {}
    const colors = (siteDoc as unknown as Record<string, unknown>).colors as Record<string, string> | undefined
    if (colors) {
      for (const [field, cssVar] of Object.entries(COLOR_VAR_MAP)) {
        if (colors[field]) colorOverrides[cssVar] = colors[field]
      }
    }

    return { platformSettings, colorOverrides }
  } catch {
    return { platformSettings: DEFAULT_PLATFORM_SETTINGS, colorOverrides: {} }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { platformSettings, colorOverrides } = await fetchPayloadData()

  // If any CMS color overrides are set, inject them as inline CSS custom properties.
  const styleOverrides = Object.keys(colorOverrides).length > 0
    ? Object.entries(colorOverrides).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as React.CSSProperties)
    : undefined

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AnalyticsProvider>
          <WeConnectProvider>
            <CursorEffect />
            <div className="bg-bg text-pg-text font-syne antialiased min-h-screen" style={styleOverrides}>
              <Nav />
              {children}
              <Footer />
            </div>
            <WeConnectOverlay settings={platformSettings} />
          </WeConnectProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
