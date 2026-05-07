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

export interface RequirementFormSettingsData {
  // Modal header
  heading: string
  description: string
  requiredHint: string
  responseSla: string
  // Section titles
  sectionBasic: string
  sectionRequirement: string
  sectionCommercial: string
  sectionContact: string
  // Field labels
  labelSubject: string
  labelInquiryType: string
  labelDescription: string
  labelGoal: string
  labelTargetLocation: string
  labelBudget: string
  labelTimeline: string
  labelFullName: string
  labelJobTitle: string
  labelCompany: string
  labelEmail: string
  labelPhone: string
  labelMessage: string
  // Placeholders
  placeholderSubject: string
  placeholderDescription: string
  placeholderGoal: string
  placeholderTargetLocation: string
  placeholderBudget: string
  placeholderName: string
  placeholderTitle: string
  placeholderCompany: string
  placeholderEmail: string
  placeholderPhone: string
  placeholderMessage: string
  // Buttons
  buttonSubmit: string
  buttonSubmitting: string
  // Success
  successTitle: string
  successMessage: string
  // Errors
  errorRequired: string
  errorInvalidEmail: string
  errorGeneric: string
  // Inquiry type option labels (values stay frozen in code)
  typeOffice: string
  typeLab: string
  typeFactory: string
  typeFunding: string
  typeMarketEntry: string
  typeOther: string
  // Timeline option labels
  timelineSelect: string
  timelineUrgent: string
  timelineThisQuarter: string
  timeline3to6: string
  timelineExploring: string
}

export const DEFAULT_REQUIREMENT_FORM_SETTINGS: RequirementFormSettingsData = {
  heading: 'Post a Need',
  description: 'Tell the WeConnect network what you need',
  requiredHint: 'Required fields are marked with',
  responseSla: 'PER GROUP will respond within 1 business day',
  sectionBasic: 'Basic Information',
  sectionRequirement: 'Need Details',
  sectionCommercial: 'Commercial Parameters',
  sectionContact: 'Contact Information',
  labelSubject: 'Subject',
  labelInquiryType: 'Inquiry Type',
  labelDescription: 'Description',
  labelGoal: 'Goal / Objective',
  labelTargetLocation: 'Target Location',
  labelBudget: 'Budget',
  labelTimeline: 'Timeline',
  labelFullName: 'Full Name',
  labelJobTitle: 'Job Title',
  labelCompany: 'Company',
  labelEmail: 'Email',
  labelPhone: 'Phone',
  labelMessage: 'Message',
  placeholderSubject: 'Brief title for your inquiry',
  placeholderDescription: "Describe what you're looking for",
  placeholderGoal: 'What does success look like?',
  placeholderTargetLocation: 'e.g. Singapore, Vietnam, EU',
  placeholderBudget: 'e.g. SGD 5k–15k/mo',
  placeholderName: 'Your name',
  placeholderTitle: 'e.g. Director',
  placeholderCompany: 'Company name',
  placeholderEmail: 'your@email.com',
  placeholderPhone: '+65 xxxx xxxx',
  placeholderMessage: "Tell us a bit about what you're looking for",
  buttonSubmit: 'Submit Need',
  buttonSubmitting: 'Submitting…',
  successTitle: "Got it — we'll be in touch.",
  successMessage: 'PER GROUP will respond within 1 business day.',
  errorRequired: 'Required',
  errorInvalidEmail: 'Invalid email',
  errorGeneric: 'Please fill in the required fields.',
  typeOffice: '🏢 Office Space',
  typeLab: '🔬 Lab / R&D Space',
  typeFactory: '🏭 Factory / Industrial Land',
  typeFunding: '💰 Investment / Funding',
  typeMarketEntry: '🌏 Market Entry Partner',
  typeOther: '📋 Other',
  timelineSelect: 'Select timeline',
  timelineUrgent: '⚡ Urgent (< 2 weeks)',
  timelineThisQuarter: '📅 This Quarter',
  timeline3to6: '📆 3–6 Months',
  timelineExploring: '🔍 Just Exploring',
}

export interface ContactFormSettingsData {
  heading: string
  successTitle: string
  successMessage: string
  buttonSendIntro: string
  buttonSending: string
  detailLabelSize: string
  detailLabelZone: string
  detailLabelSetup: string
  detailLabelLease: string
  detailLabelPrice: string
}

export const DEFAULT_CONTACT_FORM_SETTINGS: ContactFormSettingsData = {
  heading: 'Connect with this partner',
  successTitle: 'Introduction Sent!',
  successMessage: 'WeConnect will facilitate the connection within 1–2 business days.',
  buttonSendIntro: 'Send Introduction',
  buttonSending: 'Sending…',
  detailLabelSize: 'Size',
  detailLabelZone: 'Zone',
  detailLabelSetup: 'Setup',
  detailLabelLease: 'Lease',
  detailLabelPrice: 'Price',
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
