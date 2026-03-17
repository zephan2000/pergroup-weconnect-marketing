/**
 * Payload global: WeConnect Platform Settings.
 * Allows CMS editors to update overlay copy without a code deployment.
 * Accessible in Payload admin under Globals → WeConnect Platform Settings.
 */
import type { GlobalConfig } from 'payload'

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: 'WeConnect Platform Settings',
  fields: [
    {
      name: 'aiMatchingHeadline',
      type: 'text',
      defaultValue: "Describe what you're looking for",
      admin: { description: 'Headline above the AI matching search box.' },
    },
    {
      name: 'aiMatchingDescription',
      type: 'text',
      defaultValue:
        'Tell us your needs in plain language — AI will find the best matches · 用自然语言描述需求，AI为您精准匹配',
      admin: { description: 'Subtitle beneath the AI headline.' },
    },
    {
      name: 'aiMatchingPlaceholder',
      type: 'textarea',
      defaultValue:
        'e.g. We are a biotech startup looking for a wet lab 500–1000 sqft near one-north Singapore, budget SGD 5 000/month…',
      admin: { description: 'Placeholder text inside the AI search textarea.' },
    },
    {
      name: 'fundingPlaceholderTitle',
      type: 'text',
      defaultValue: "We're still building this out",
      admin: { description: 'Title on the Funding tab coming-soon screen.' },
    },
    {
      name: 'fundingPlaceholderBody',
      type: 'textarea',
      defaultValue:
        "VC, CVC, and government grant matching coming soon. Describe your funding needs and we'll find the best partners for your stage and sector.",
    },
    {
      name: 'marketsPlaceholderTitle',
      type: 'text',
      defaultValue: "We're still building this out",
      admin: { description: 'Title on the Markets tab coming-soon screen.' },
    },
    {
      name: 'marketsPlaceholderBody',
      type: 'textarea',
      defaultValue:
        'Market entry pathways, GTM partners, and accelerator programmes across 53+ countries. This module is in active development.',
    },
  ],
}
