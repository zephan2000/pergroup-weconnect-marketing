/**
 * Types + default fallbacks for the site-wide CMS globals consumed by Nav,
 * Footer, and (eventually) WeConnect overlay + form modals.
 *
 * Pattern mirrors src/lib/weconnect/platform-settings.ts:
 *   - Type defines the localized fields the component reads.
 *   - DEFAULT_* provides last-resort fallback values if Payload is unreachable.
 *   - The marketing layout fetches the global with `payload.findGlobal({ slug, locale })`
 *     and passes a typed object down as props.
 */

export interface NavSettingsData {
  linkPhilosophy: string
  linkAbout: string
  linkServices: string
  linkPartners: string
  weconnectLabel: string
  weconnectCta: string
  languageToggleAria: string
}

export const DEFAULT_NAV_SETTINGS: NavSettingsData = {
  linkPhilosophy: 'Philosophy',
  linkAbout: 'About',
  linkServices: 'Services',
  linkPartners: 'Partners',
  weconnectLabel: 'WeConnect ✦',
  weconnectCta: 'WECONNECT PLATFORM →',
  languageToggleAria: 'Switch language',
}

export interface FooterSettingsData {
  tagline: string
  mission: string
  pillarLine: string
  eHarborTag: string
  copyright: string
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsData = {
  tagline: 'A globalized tech innovation ecosystem.',
  mission: 'Making innovation open to anyone, anywhere.',
  pillarLine: 'Tech Innovation · Business Empowerment · Human Care',
  eHarborTag: 'by E-Harbor',
  copyright: '© 2026 E-Harbor / PER GROUP · Singapore',
}

export interface WeConnectSettingsData {
  // Tabs
  tabNeeds: string
  tabAlerts: string
  tabProfile: string
  // Needs CTA cards
  postNeed: string
  postNeedAccent: string
  postNeedDescription: string
  shareOffering: string
  shareOfferingAccent: string
  shareOfferingDescription: string
  recentNeeds: string
  // Alerts
  advisoryAlerts: string
  previewLabel: string
  comingSoonLabel: string
  // Profile
  profileMember: string
  profileMemberSince: string
  myPosts: string
  companyProfile: string
  enterpriseUser: string
  enterpriseRole: string
  // Settings
  settingsHeading: string
  settingLanguage: string
  settingNotifications: string
  settingContactPg: string
  settingAbout: string
}

export const DEFAULT_WECONNECT_SETTINGS: WeConnectSettingsData = {
  tabNeeds: 'Needs',
  tabAlerts: 'Alerts',
  tabProfile: 'Profile',
  postNeed: 'Post a Need',
  postNeedAccent: 'Need',
  postNeedDescription: "Tell us what you're looking for.",
  shareOffering: 'Share What You Offer',
  shareOfferingAccent: 'Offer',
  shareOfferingDescription: 'Let us know your capabilities.',
  recentNeeds: 'Recent Needs',
  advisoryAlerts: 'Advisory Alerts',
  previewLabel: 'Preview',
  comingSoonLabel: 'Coming Soon',
  profileMember: 'PER GROUP Enterprise',
  profileMemberSince: 'E-Harbor Member since 2024',
  myPosts: 'My Posts',
  companyProfile: 'Company Profile',
  enterpriseUser: 'PER GROUP User',
  enterpriseRole: 'Enterprise Member',
  settingsHeading: 'Settings',
  settingLanguage: 'Language',
  settingNotifications: 'Notification preferences',
  settingContactPg: 'Contact PER GROUP',
  settingAbout: 'About WeConnect',
}
