/**
 * Shared type and defaults for the WeConnect Platform Settings Payload global.
 * Imported by both the Payload global definition and the WeConnectOverlay component.
 */

export interface PlatformSettingsData {
  aiMatchingHeadline: string
  aiMatchingDescription: string
  aiMatchingPlaceholder: string
  fundingPlaceholderTitle: string
  fundingPlaceholderBody: Record<string, unknown> | string | null
  marketsPlaceholderTitle: string
  marketsPlaceholderBody: Record<string, unknown> | string | null
  // Contact Modal (Space Detail)
  contactModalHeading: string
  contactModalSuccessTitle: string
  contactModalSuccessMessage: string
  detailLabelSize: string
  detailLabelZone: string
  detailLabelSetup: string
  detailLabelLease: string
  detailLabelPrice: string
  // Requirement Modal
  requirementModalHeading: string
  requirementModalDescription: string
  requirementModalSuccessTitle: string
  requirementModalSuccessMessage: string
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsData = {
  aiMatchingHeadline: "Describe what you're looking for",
  aiMatchingDescription:
    'Tell us your needs in plain language — AI will find the best matches · 用自然语言描述需求，AI为您精准匹配',
  aiMatchingPlaceholder:
    'e.g. We are a biotech startup looking for a wet lab 500–1000 sqft near one-north Singapore, budget SGD 5 000/month…',
  fundingPlaceholderTitle: "We're still building this out",
  fundingPlaceholderBody: null,
  marketsPlaceholderTitle: "We're still building this out",
  marketsPlaceholderBody: null,
  // Contact Modal
  contactModalHeading: 'Connect with this partner · 联系合作方',
  contactModalSuccessTitle: 'Introduction Sent!',
  contactModalSuccessMessage: 'WeConnect will facilitate the connection within 1–2 business days. · 已发送，1-2个工作日内回复。',
  detailLabelSize: 'Size',
  detailLabelZone: 'Zone',
  detailLabelSetup: 'Setup',
  detailLabelLease: 'Lease',
  detailLabelPrice: 'Price',
  // Requirement Modal
  requirementModalHeading: 'Post a Requirement · 发布需求',
  requirementModalDescription: 'Tell the WeConnect network what you need',
  requirementModalSuccessTitle: 'Requirement Posted!',
  requirementModalSuccessMessage: 'AI is matching with verified partners. You\'ll hear back within 24–48 hours. · AI正在匹配认证合作伙伴，24-48小时内回复。',
}
