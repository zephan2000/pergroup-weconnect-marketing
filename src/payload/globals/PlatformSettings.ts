/**
 * Payload global: WeConnect Platform Settings.
 * Allows CMS editors to update overlay copy without a code deployment.
 * Accessible in Payload admin under Globals → WeConnect Platform Settings.
 */
import type { GlobalConfig } from 'payload'

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: { en: 'WeConnect Platform Settings', zh: 'WeConnect 平台设置' },
  fields: [
    {
      name: 'aiMatchingHeadline',
      type: 'text',
      label: { en: 'AI Matching Headline', zh: 'AI 匹配标题' },
      defaultValue: "Describe what you're looking for",
      admin: { description: { en: 'Headline above the AI matching search box.', zh: 'AI 匹配搜索框上方的标题。' } },
    },
    {
      name: 'aiMatchingDescription',
      type: 'text',
      label: { en: 'AI Matching Description', zh: 'AI 匹配描述' },
      defaultValue:
        'Tell us your needs in plain language — AI will find the best matches · 用自然语言描述需求，AI为您精准匹配',
      admin: { description: { en: 'Subtitle beneath the AI headline.', zh: 'AI 标题下方的副标题。' } },
    },
    {
      name: 'aiMatchingPlaceholder',
      type: 'textarea',
      label: { en: 'AI Matching Placeholder', zh: 'AI 匹配占位文字' },
      defaultValue:
        'e.g. We are a biotech startup looking for a wet lab 500–1000 sqft near one-north Singapore, budget SGD 5 000/month…',
      admin: { description: { en: 'Placeholder text inside the AI search textarea.', zh: 'AI 搜索文本框内的占位文字。' } },
    },
    {
      name: 'fundingPlaceholderTitle',
      type: 'text',
      label: { en: 'Funding Placeholder Title', zh: '融资占位标题' },
      defaultValue: "We're still building this out",
      admin: { description: { en: 'Title on the Funding tab coming-soon screen.', zh: '融资标签页"即将推出"界面的标题。' } },
    },
    {
      name: 'fundingPlaceholderBody',
      type: 'richText',
      label: { en: 'Funding Placeholder Body', zh: '融资占位正文' },
    },
    {
      name: 'marketsPlaceholderTitle',
      type: 'text',
      label: { en: 'Markets Placeholder Title', zh: '市场占位标题' },
      defaultValue: "We're still building this out",
      admin: { description: { en: 'Title on the Markets tab coming-soon screen.', zh: '市场标签页"即将推出"界面的标题。' } },
    },
    {
      name: 'marketsPlaceholderBody',
      type: 'richText',
      label: { en: 'Markets Placeholder Body', zh: '市场占位正文' },
    },
  ],
}
