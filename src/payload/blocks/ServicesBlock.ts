/**
 * ServicesBlock — "End-to-End Global Services" 3-column grid.
 * Derived from #services in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: { en: 'Services Block', zh: '服务区块' }, plural: { en: 'Services Blocks', zh: '服务区块' } },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: { en: 'Section Label', zh: '板块标签' },
    },
    {
      name: 'headline',
      type: 'text',
      label: { en: 'Headline (first line)', zh: '标题（第一行）' },
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: { en: 'Headline Accent Line (amber)', zh: '标题强调行（琥珀色）' },
    },
    {
      name: 'services',
      type: 'array',
      label: { en: 'Service Items', zh: '服务项目' },
      required: true,
      minRows: 1,
      maxRows: 9,
      fields: [
        { name: 'number', type: 'text', required: true, label: { en: 'Number (e.g. "01")', zh: '编号（如 "01"）' } },
        {
          name: 'icon',
          type: 'text',
          label: { en: 'Emoji Icon', zh: '表情图标' },
          admin: { description: { en: 'e.g. 🔍', zh: '如 🔍' } },
        },
        { name: 'title', type: 'text', required: true, label: { en: 'English Title', zh: '英文标题' } },
        { name: 'chineseTitle', type: 'text', label: { en: 'Chinese Title', zh: '中文标题' } },
        { name: 'description', type: 'textarea', label: { en: 'Description', zh: '描述' } },
      ],
    },
  ],
}
