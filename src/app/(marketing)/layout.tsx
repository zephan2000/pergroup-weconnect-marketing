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
import { draftMode } from 'next/headers'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CursorEffect from '@/components/CursorEffect'
import ScrollReveal from '@/components/ScrollReveal'
import LivePreviewWidthWarning from '@/components/LivePreviewWidthWarning'
import DraftModeBanner from '@/components/DraftModeBanner'
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
  DEFAULT_REQUIREMENT_FORM_SETTINGS,
  DEFAULT_OFFERING_FORM_SETTINGS,
  DEFAULT_CONTACT_FORM_SETTINGS,
  type NavSettingsData,
  type FooterSettingsData,
  type WeConnectSettingsData,
  type RequirementFormSettingsData,
  type OfferingFormSettingsData,
  type ContactFormSettingsData,
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

async function fetchPayloadData(locale: Locale, isDraft: boolean) {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const [platformDoc, siteDoc, navDoc, footerDoc, weconnectDoc, requirementFormDoc, offeringFormDoc, contactFormDoc] = await Promise.all([
      // Locale-aware fetch — Payload returns localized fields in the requested locale.
      // fallbackLocale: 'en' means empty zh values fall back to English (configured globally).
      // draft: passes through Next.js draftMode — Live Preview iframe renders the
      // in-progress draft, production (no cookie) only sees the published version.
      payload.findGlobal({ slug: 'platform-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'site-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'nav-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'footer-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'weconnect-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'requirement-form-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'offering-form-settings', locale, draft: isDraft }),
      payload.findGlobal({ slug: 'contact-form-settings', locale, draft: isDraft }),
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

    const drf = DEFAULT_REQUIREMENT_FORM_SETTINGS
    const rf = requirementFormDoc as unknown as Record<string, unknown>
    const requirementFormSettings: RequirementFormSettingsData = {
      heading: (rf.heading as string) || drf.heading,
      description: (rf.description as string) || drf.description,
      requiredHint: (rf.requiredHint as string) || drf.requiredHint,
      responseSla: (rf.responseSla as string) || drf.responseSla,
      sectionBasic: (rf.sectionBasic as string) || drf.sectionBasic,
      sectionRequirement: (rf.sectionRequirement as string) || drf.sectionRequirement,
      sectionCommercial: (rf.sectionCommercial as string) || drf.sectionCommercial,
      sectionContact: (rf.sectionContact as string) || drf.sectionContact,
      labelSubject: (rf.labelSubject as string) || drf.labelSubject,
      labelInquiryType: (rf.labelInquiryType as string) || drf.labelInquiryType,
      labelDescription: (rf.labelDescription as string) || drf.labelDescription,
      labelGoal: (rf.labelGoal as string) || drf.labelGoal,
      labelTargetLocation: (rf.labelTargetLocation as string) || drf.labelTargetLocation,
      labelBudget: (rf.labelBudget as string) || drf.labelBudget,
      labelTimeline: (rf.labelTimeline as string) || drf.labelTimeline,
      labelFullName: (rf.labelFullName as string) || drf.labelFullName,
      labelJobTitle: (rf.labelJobTitle as string) || drf.labelJobTitle,
      labelCompany: (rf.labelCompany as string) || drf.labelCompany,
      labelEmail: (rf.labelEmail as string) || drf.labelEmail,
      labelPhone: (rf.labelPhone as string) || drf.labelPhone,
      labelMessage: (rf.labelMessage as string) || drf.labelMessage,
      placeholderSubject: (rf.placeholderSubject as string) || drf.placeholderSubject,
      placeholderDescription: (rf.placeholderDescription as string) || drf.placeholderDescription,
      placeholderGoal: (rf.placeholderGoal as string) || drf.placeholderGoal,
      placeholderTargetLocation: (rf.placeholderTargetLocation as string) || drf.placeholderTargetLocation,
      placeholderBudget: (rf.placeholderBudget as string) || drf.placeholderBudget,
      placeholderName: (rf.placeholderName as string) || drf.placeholderName,
      placeholderTitle: (rf.placeholderTitle as string) || drf.placeholderTitle,
      placeholderCompany: (rf.placeholderCompany as string) || drf.placeholderCompany,
      placeholderEmail: (rf.placeholderEmail as string) || drf.placeholderEmail,
      placeholderPhone: (rf.placeholderPhone as string) || drf.placeholderPhone,
      placeholderMessage: (rf.placeholderMessage as string) || drf.placeholderMessage,
      buttonSubmit: (rf.buttonSubmit as string) || drf.buttonSubmit,
      buttonSubmitting: (rf.buttonSubmitting as string) || drf.buttonSubmitting,
      successTitle: (rf.successTitle as string) || drf.successTitle,
      successMessage: (rf.successMessage as string) || drf.successMessage,
      errorRequired: (rf.errorRequired as string) || drf.errorRequired,
      errorInvalidEmail: (rf.errorInvalidEmail as string) || drf.errorInvalidEmail,
      errorGeneric: (rf.errorGeneric as string) || drf.errorGeneric,
      typeOffice: (rf.typeOffice as string) || drf.typeOffice,
      typeLab: (rf.typeLab as string) || drf.typeLab,
      typeFactory: (rf.typeFactory as string) || drf.typeFactory,
      typeFunding: (rf.typeFunding as string) || drf.typeFunding,
      typeMarketEntry: (rf.typeMarketEntry as string) || drf.typeMarketEntry,
      typeOther: (rf.typeOther as string) || drf.typeOther,
      timelineSelect: (rf.timelineSelect as string) || drf.timelineSelect,
      timelineUrgent: (rf.timelineUrgent as string) || drf.timelineUrgent,
      timelineThisQuarter: (rf.timelineThisQuarter as string) || drf.timelineThisQuarter,
      timeline3to6: (rf.timeline3to6 as string) || drf.timeline3to6,
      timelineExploring: (rf.timelineExploring as string) || drf.timelineExploring,
    }

    const dof = DEFAULT_OFFERING_FORM_SETTINGS
    const ofd = offeringFormDoc as unknown as Record<string, unknown>
    const offeringFormSettings: OfferingFormSettingsData = {
      heading: (ofd.heading as string) || dof.heading,
      description: (ofd.description as string) || dof.description,
      requiredHint: (ofd.requiredHint as string) || dof.requiredHint,
      responseSla: (ofd.responseSla as string) || dof.responseSla,
      sectionBasic: (ofd.sectionBasic as string) || dof.sectionBasic,
      sectionCapability: (ofd.sectionCapability as string) || dof.sectionCapability,
      sectionAvailability: (ofd.sectionAvailability as string) || dof.sectionAvailability,
      sectionContact: (ofd.sectionContact as string) || dof.sectionContact,
      labelSubject: (ofd.labelSubject as string) || dof.labelSubject,
      labelCategory: (ofd.labelCategory as string) || dof.labelCategory,
      labelCapability: (ofd.labelCapability as string) || dof.labelCapability,
      labelTrackRecord: (ofd.labelTrackRecord as string) || dof.labelTrackRecord,
      labelIdealClient: (ofd.labelIdealClient as string) || dof.labelIdealClient,
      labelAvailability: (ofd.labelAvailability as string) || dof.labelAvailability,
      labelCoverage: (ofd.labelCoverage as string) || dof.labelCoverage,
      labelCapacity: (ofd.labelCapacity as string) || dof.labelCapacity,
      labelFullName: (ofd.labelFullName as string) || dof.labelFullName,
      labelJobTitle: (ofd.labelJobTitle as string) || dof.labelJobTitle,
      labelCompany: (ofd.labelCompany as string) || dof.labelCompany,
      labelEmail: (ofd.labelEmail as string) || dof.labelEmail,
      labelPhone: (ofd.labelPhone as string) || dof.labelPhone,
      placeholderSubject: (ofd.placeholderSubject as string) || dof.placeholderSubject,
      placeholderCapability: (ofd.placeholderCapability as string) || dof.placeholderCapability,
      placeholderTrackRecord: (ofd.placeholderTrackRecord as string) || dof.placeholderTrackRecord,
      placeholderIdealClient: (ofd.placeholderIdealClient as string) || dof.placeholderIdealClient,
      placeholderCoverage: (ofd.placeholderCoverage as string) || dof.placeholderCoverage,
      placeholderCapacity: (ofd.placeholderCapacity as string) || dof.placeholderCapacity,
      placeholderName: (ofd.placeholderName as string) || dof.placeholderName,
      placeholderTitle: (ofd.placeholderTitle as string) || dof.placeholderTitle,
      placeholderCompany: (ofd.placeholderCompany as string) || dof.placeholderCompany,
      placeholderEmail: (ofd.placeholderEmail as string) || dof.placeholderEmail,
      placeholderPhone: (ofd.placeholderPhone as string) || dof.placeholderPhone,
      buttonSubmit: (ofd.buttonSubmit as string) || dof.buttonSubmit,
      buttonSubmitting: (ofd.buttonSubmitting as string) || dof.buttonSubmitting,
      successTitle: (ofd.successTitle as string) || dof.successTitle,
      successMessage: (ofd.successMessage as string) || dof.successMessage,
      errorRequired: (ofd.errorRequired as string) || dof.errorRequired,
      errorInvalidEmail: (ofd.errorInvalidEmail as string) || dof.errorInvalidEmail,
      errorGeneric: (ofd.errorGeneric as string) || dof.errorGeneric,
      categoryOfficeBrokerage: (ofd.categoryOfficeBrokerage as string) || dof.categoryOfficeBrokerage,
      categoryLabBrokerage: (ofd.categoryLabBrokerage as string) || dof.categoryLabBrokerage,
      categoryFactoryBrokerage: (ofd.categoryFactoryBrokerage as string) || dof.categoryFactoryBrokerage,
      categoryAdvisory: (ofd.categoryAdvisory as string) || dof.categoryAdvisory,
      categoryMarketEntry: (ofd.categoryMarketEntry as string) || dof.categoryMarketEntry,
      categoryFunding: (ofd.categoryFunding as string) || dof.categoryFunding,
      categoryOther: (ofd.categoryOther as string) || dof.categoryOther,
      availabilitySelect: (ofd.availabilitySelect as string) || dof.availabilitySelect,
      availabilityImmediate: (ofd.availabilityImmediate as string) || dof.availabilityImmediate,
      availabilityThisQuarter: (ofd.availabilityThisQuarter as string) || dof.availabilityThisQuarter,
      availabilityNextQuarter: (ofd.availabilityNextQuarter as string) || dof.availabilityNextQuarter,
      availabilityCustom: (ofd.availabilityCustom as string) || dof.availabilityCustom,
    }

    const dcf = DEFAULT_CONTACT_FORM_SETTINGS
    const cf = contactFormDoc as unknown as Record<string, unknown>
    const contactFormSettings: ContactFormSettingsData = {
      heading: (cf.heading as string) || dcf.heading,
      successTitle: (cf.successTitle as string) || dcf.successTitle,
      successMessage: (cf.successMessage as string) || dcf.successMessage,
      buttonSendIntro: (cf.buttonSendIntro as string) || dcf.buttonSendIntro,
      buttonSending: (cf.buttonSending as string) || dcf.buttonSending,
      detailLabelSize: (cf.detailLabelSize as string) || dcf.detailLabelSize,
      detailLabelZone: (cf.detailLabelZone as string) || dcf.detailLabelZone,
      detailLabelSetup: (cf.detailLabelSetup as string) || dcf.detailLabelSetup,
      detailLabelLease: (cf.detailLabelLease as string) || dcf.detailLabelLease,
      detailLabelPrice: (cf.detailLabelPrice as string) || dcf.detailLabelPrice,
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

    return { platformSettings, colorOverrides, navSettings, footerSettings, weconnectSettings, requirementFormSettings, offeringFormSettings, contactFormSettings }
  } catch {
    return {
      platformSettings: DEFAULT_PLATFORM_SETTINGS,
      colorOverrides: {},
      navSettings: DEFAULT_NAV_SETTINGS,
      footerSettings: DEFAULT_FOOTER_SETTINGS,
      weconnectSettings: DEFAULT_WECONNECT_SETTINGS,
      requirementFormSettings: DEFAULT_REQUIREMENT_FORM_SETTINGS,
      offeringFormSettings: DEFAULT_OFFERING_FORM_SETTINGS,
      contactFormSettings: DEFAULT_CONTACT_FORM_SETTINGS,
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale()
  const { isEnabled: isDraft } = await draftMode()
  const { platformSettings, colorOverrides, navSettings, footerSettings, weconnectSettings, requirementFormSettings, offeringFormSettings, contactFormSettings } = await fetchPayloadData(locale, isDraft)

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
                <DraftModeBanner isDraft={isDraft} />
                <LivePreviewWidthWarning isDraft={isDraft} />
                <Nav settings={navSettings} eHarborTag={footerSettings.eHarborTag} />
                {children}
                <Footer settings={footerSettings} nav={navSettings} locale={locale} />
              </div>
              <WeConnectOverlay
                settings={platformSettings}
                weconnect={weconnectSettings}
                requirementForm={requirementFormSettings}
                offeringForm={offeringFormSettings}
                contactForm={contactFormSettings}
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
