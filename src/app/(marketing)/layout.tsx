/**
 * Marketing layout — wraps all PER GROUP marketing routes.
 *
 * globals.css (Tailwind directives + preflight reset) is imported HERE,
 * not in the root layout, so Tailwind's CSS reset never fires on /admin.
 *
 * WeConnectProvider wraps everything so Nav triggers, Hero CTA buttons,
 * and the WeConnectOverlay all share the same open/close state.
 *
 * I18nProvider initializes from the server-resolved locale (cookie) so the
 * client doesn't flash a different language on hydration.
 *
 * PlatformSettings is fetched from Payload at render time (locale-aware) so
 * CMS editors can update overlay copy without a code deployment.
 */
import '../globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CursorEffect from '@/components/CursorEffect'
import ScrollReveal from '@/components/ScrollReveal'
import { I18nProvider } from '@/lib/i18n/context'
import { getServerLocale } from '@/lib/i18n/server'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { WeConnectProvider } from '@/lib/weconnect/context'
import WeConnectOverlay from '@/components/WeConnectOverlay'
import { fontVariables } from '../fonts'
import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettingsData,
} from '@/lib/weconnect/platform-settings'
import {
  DEFAULT_NAV_SETTINGS,
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_WECONNECT_SETTINGS,
  type NavSettingsData,
  type FooterSettingsData,
  type WeConnectSettingsData,
} from '@/lib/cms/site-text'
import type { Locale } from '@/lib/i18n/strings'

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

async function fetchPayloadData(locale: Locale) {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const [platformDoc, siteDoc, navDoc, footerDoc, weconnectDoc] = await Promise.all([
      // Locale-aware fetch — Payload returns localized fields in the requested locale.
      // fallbackLocale: 'en' means empty zh values fall back to English (configured globally).
      payload.findGlobal({ slug: 'platform-settings', locale }),
      payload.findGlobal({ slug: 'site-settings', locale }),
      payload.findGlobal({ slug: 'nav-settings', locale }),
      payload.findGlobal({ slug: 'footer-settings', locale }),
      payload.findGlobal({ slug: 'weconnect-settings', locale }),
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

    const dn = DEFAULT_NAV_SETTINGS
    const n = navDoc as unknown as Record<string, unknown>
    const navSettings: NavSettingsData = {
      linkPhilosophy: (n.linkPhilosophy as string) || dn.linkPhilosophy,
      linkAbout: (n.linkAbout as string) || dn.linkAbout,
      linkServices: (n.linkServices as string) || dn.linkServices,
      linkPartners: (n.linkPartners as string) || dn.linkPartners,
      weconnectLabel: (n.weconnectLabel as string) || dn.weconnectLabel,
      weconnectCta: (n.weconnectCta as string) || dn.weconnectCta,
      languageToggleAria: (n.languageToggleAria as string) || dn.languageToggleAria,
    }

    const df = DEFAULT_FOOTER_SETTINGS
    const f = footerDoc as unknown as Record<string, unknown>
    const footerSettings: FooterSettingsData = {
      tagline: (f.tagline as string) || df.tagline,
      mission: (f.mission as string) || df.mission,
      pillarLine: (f.pillarLine as string) || df.pillarLine,
      eHarborTag: (f.eHarborTag as string) || df.eHarborTag,
      copyright: (f.copyright as string) || df.copyright,
    }

    const dw = DEFAULT_WECONNECT_SETTINGS
    const w = weconnectDoc as unknown as Record<string, unknown>
    const weconnectSettings: WeConnectSettingsData = {
      tabNeeds: (w.tabNeeds as string) || dw.tabNeeds,
      tabAlerts: (w.tabAlerts as string) || dw.tabAlerts,
      tabProfile: (w.tabProfile as string) || dw.tabProfile,
      postNeed: (w.postNeed as string) || dw.postNeed,
      postNeedAccent: (w.postNeedAccent as string) || dw.postNeedAccent,
      postNeedDescription: (w.postNeedDescription as string) || dw.postNeedDescription,
      shareOffering: (w.shareOffering as string) || dw.shareOffering,
      shareOfferingAccent: (w.shareOfferingAccent as string) || dw.shareOfferingAccent,
      shareOfferingDescription: (w.shareOfferingDescription as string) || dw.shareOfferingDescription,
      recentNeeds: (w.recentNeeds as string) || dw.recentNeeds,
      advisoryAlerts: (w.advisoryAlerts as string) || dw.advisoryAlerts,
      previewLabel: (w.previewLabel as string) || dw.previewLabel,
      comingSoonLabel: (w.comingSoonLabel as string) || dw.comingSoonLabel,
      profileMember: (w.profileMember as string) || dw.profileMember,
      profileMemberSince: (w.profileMemberSince as string) || dw.profileMemberSince,
      myPosts: (w.myPosts as string) || dw.myPosts,
      companyProfile: (w.companyProfile as string) || dw.companyProfile,
      enterpriseUser: (w.enterpriseUser as string) || dw.enterpriseUser,
      enterpriseRole: (w.enterpriseRole as string) || dw.enterpriseRole,
      settingsHeading: (w.settingsHeading as string) || dw.settingsHeading,
      settingLanguage: (w.settingLanguage as string) || dw.settingLanguage,
      settingNotifications: (w.settingNotifications as string) || dw.settingNotifications,
      settingContactPg: (w.settingContactPg as string) || dw.settingContactPg,
      settingAbout: (w.settingAbout as string) || dw.settingAbout,
    }

    return { platformSettings, colorOverrides, navSettings, footerSettings, weconnectSettings }
  } catch {
    return {
      platformSettings: DEFAULT_PLATFORM_SETTINGS,
      colorOverrides: {},
      navSettings: DEFAULT_NAV_SETTINGS,
      footerSettings: DEFAULT_FOOTER_SETTINGS,
      weconnectSettings: DEFAULT_WECONNECT_SETTINGS,
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale()
  const { platformSettings, colorOverrides, navSettings, footerSettings, weconnectSettings } = await fetchPayloadData(locale)

  const styleOverrides = Object.keys(colorOverrides).length > 0
    ? Object.entries(colorOverrides).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as React.CSSProperties)
    : undefined

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <AnalyticsProvider>
          <I18nProvider initialLocale={locale}>
            <WeConnectProvider>
              <CursorEffect />
              <ScrollReveal />
              <div className="bg-bg text-pg-text font-sora antialiased min-h-screen" style={styleOverrides}>
                <Nav settings={navSettings} />
                {children}
                <Footer settings={footerSettings} nav={navSettings} locale={locale} />
              </div>
              <WeConnectOverlay
                settings={platformSettings}
                weconnect={weconnectSettings}
                eHarborTag={footerSettings.eHarborTag}
                locale={locale}
              />
            </WeConnectProvider>
          </I18nProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
