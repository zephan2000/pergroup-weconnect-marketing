/**
 * PlatformTeaserBlock — WeConnect platform teaser section.
 * All text fields localized for ZH support.
 */
import type { Block } from 'payload'

export const PlatformTeaserBlock: Block = {
  slug: 'platformTeaser',
  labels: { singular: { en: 'Platform Teaser Block', zh: '平台预告区块' }, plural: { en: 'Platform Teaser Blocks', zh: '平台预告区块' } },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      localized: true,
      label: { en: 'Section Label', zh: '板块标签' },
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      label: { en: 'Headline', zh: '标题' },
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      localized: true,
      label: { en: 'Headline Accent (amber italic)', zh: '标题强调（琥珀色斜体）' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { en: 'Body Text', zh: '正文' },
    },
    {
      name: 'features',
      type: 'array',
      label: { en: 'Feature List Items', zh: '功能列表项' },
      maxRows: 5,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Feature Title', zh: '功能标题' } },
        { name: 'description', type: 'text', localized: true, label: { en: 'Feature Description', zh: '功能描述' } },
        {
          name: 'accentColor',
          type: 'select',
          label: { en: 'Dot Colour', zh: '圆点颜色' },
          defaultValue: 'green',
          options: [
            { label: { en: 'Green', zh: '绿色' }, value: 'green' },
            { label: { en: 'Amber', zh: '琥珀色' }, value: 'amber' },
          ],
        },
      ],
    },
    {
      name: 'launchCtaLabel',
      type: 'text',
      localized: true,
      label: { en: 'Launch CTA Button Label', zh: '启动按钮文字' },
      required: true,
    },
  ],
}
