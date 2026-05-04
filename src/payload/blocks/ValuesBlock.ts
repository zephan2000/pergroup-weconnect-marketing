/**
 * ValuesBlock — Four Harmonies + Five Unities + motto row.
 * Derived from #values in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'values',
  labels: { singular: { en: 'Values Block', zh: '价值观区块' }, plural: { en: 'Values Blocks', zh: '价值观区块' } },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: { en: 'Section Label', zh: '板块标签' },
    },
    {
      name: 'headline',
      type: 'text',
      label: { en: 'Headline', zh: '标题' },
      required: true,
    },
    {
      name: 'chineseHeadline',
      type: 'text',
      label: { en: 'Chinese Headline', zh: '中文标题' },
    },
    {
      name: 'fourHarmoniesItems',
      type: 'array',
      label: { en: 'Four Harmonies Items', zh: '四和项目' },
      maxRows: 4,
      fields: [
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Text', zh: '中文文字' } },
        { name: 'english', type: 'text', required: true, label: { en: 'English Text', zh: '英文文字' } },
      ],
    },
    {
      name: 'fiveUnitiesItems',
      type: 'array',
      label: { en: 'Five Unities Items', zh: '五统项目' },
      maxRows: 5,
      fields: [
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Character', zh: '中文字符' } },
        { name: 'english', type: 'text', required: true, label: { en: 'English Label', zh: '英文标签' } },
      ],
    },
    {
      name: 'mottos',
      type: 'array',
      label: { en: 'Motto Items', zh: '箴言项目' },
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Label (e.g. "VALUES · 价值观")', zh: '标签（如 "VALUES · 价值观"）' } },
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Text', zh: '中文文字' } },
        { name: 'english', type: 'text', required: true, label: { en: 'English Text', zh: '英文文字' } },
      ],
    },
  ],
}
