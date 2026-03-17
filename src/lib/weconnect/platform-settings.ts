/**
 * Shared type and defaults for the WeConnect Platform Settings Payload global.
 * Imported by both the Payload global definition and the WeConnectOverlay component.
 */

export interface PlatformSettingsData {
  aiMatchingHeadline: string
  aiMatchingDescription: string
  aiMatchingPlaceholder: string
  fundingPlaceholderTitle: string
  fundingPlaceholderBody: string
  marketsPlaceholderTitle: string
  marketsPlaceholderBody: string
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsData = {
  aiMatchingHeadline: "Describe what you're looking for",
  aiMatchingDescription:
    'Tell us your needs in plain language — AI will find the best matches · 用自然语言描述需求，AI为您精准匹配',
  aiMatchingPlaceholder:
    'e.g. We are a biotech startup looking for a wet lab 500–1000 sqft near one-north Singapore, budget SGD 5 000/month…',
  fundingPlaceholderTitle: "We're still building this out",
  fundingPlaceholderBody:
    "VC, CVC, and government grant matching coming soon. Describe your funding needs and we'll find the best partners for your stage and sector.",
  marketsPlaceholderTitle: "We're still building this out",
  marketsPlaceholderBody:
    'Market entry pathways, GTM partners, and accelerator programmes across 53+ countries. This module is in active development.',
}
