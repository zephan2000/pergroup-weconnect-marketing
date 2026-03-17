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
}
