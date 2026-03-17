/**
 * AboutBlock — "A Network Built on Genuine Trust" section.
 * Derived from #about in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: { en: 'About Block', zh: '关于区块' }, plural: { en: 'About Blocks', zh: '关于区块' } },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: { en: 'Section Label', zh: '板块标签' },
    },
    {
      name: 'headline',
      type: 'text',
      label: { en: 'Headline (first part)', zh: '标题（前半部分）' },
      required: true,
      admin: { description: { en: 'e.g. "A Network Built on"', zh: '如 "A Network Built on"' } },
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: { en: 'Headline Accent (renders in amber)', zh: '标题强调（琥珀色显示）' },
      admin: { description: { en: 'e.g. "Genuine Trust"', zh: '如 "Genuine Trust"' } },
    },
    {
      name: 'body',
      type: 'richText',
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
          admin: { description: { en: 'e.g. 🔭', zh: '如 🔭' } },
        },
        { name: 'title', type: 'text', required: true, label: { en: 'Title', zh: '标题' } },
        { name: 'description', type: 'text', label: { en: 'Description (incl. Chinese)', zh: '描述（含中文）' } },
      ],
    },
    {
      name: 'globeStat',
      type: 'group',
      label: { en: 'Globe Stat', zh: '地球仪数据' },
      fields: [
        { name: 'number', type: 'text', label: { en: 'Number (e.g. "53+")', zh: '数字（如 "53+"）' } },
        { name: 'label', type: 'text', label: { en: 'Label (e.g. "COUNTRIES")', zh: '标签（如 "COUNTRIES"）' } },
      ],
    },
  ],
}
