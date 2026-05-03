/**
 * AboutBlock — "A Network Built on Genuine Trust" section.
 * All text fields localized for ZH support.
 */
import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: { en: 'About Block', zh: '关于区块' }, plural: { en: 'About Blocks', zh: '关于区块' } },
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
      label: { en: 'Headline (first part)', zh: '标题（前半部分）' },
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      localized: true,
      label: { en: 'Headline Accent (renders in amber)', zh: '标题强调（琥珀色显示）' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { en: 'Body Content', zh: '正文内容' },
    },
    {
      name: 'advantages',
      type: 'array',
      label: { en: 'Advantage Cards', zh: '优势卡片' },
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: { en: 'Emoji Icon', zh: '表情图标' },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', zh: '标题' } },
        { name: 'description', type: 'text', localized: true, label: { en: 'Description', zh: '描述' } },
      ],
    },
    {
      name: 'globeStat',
      type: 'group',
      label: { en: 'Globe Stat', zh: '地球仪数据' },
      fields: [
        { name: 'number', type: 'text', label: { en: 'Number (e.g. "53+")', zh: '数字（如 "53+"）' } },
        { name: 'label', type: 'text', localized: true, label: { en: 'Label', zh: '标签' } },
      ],
    },
  ],
}
