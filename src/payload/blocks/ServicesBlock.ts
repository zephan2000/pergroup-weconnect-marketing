/**
 * ServicesBlock — "End-to-End Global Services" grid.
 * Localized fields for ZH support; legacy chineseTitle kept as fallback.
 */
import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: { en: 'Services Block', zh: '服务区块' }, plural: { en: 'Services Blocks', zh: '服务区块' } },
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
      label: { en: 'Headline (first line)', zh: '标题（第一行）' },
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      localized: true,
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
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', zh: '标题' } },
        { name: 'chineseTitle', type: 'text', label: { en: 'Chinese Title (legacy)', zh: '中文标题（旧版）' }, admin: { description: { en: 'LEGACY fallback. Prefer title in zh locale.', zh: '旧版字段。建议在 zh locale 中设置 title。' } } },
        { name: 'description', type: 'textarea', localized: true, label: { en: 'Description', zh: '描述' } },
      ],
    },
  ],
}
