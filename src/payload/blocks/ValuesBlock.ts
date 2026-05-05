/**
 * ValuesBlock — Four Harmonies + Five Unities + motto row.
 * Localized fields for ZH support; legacy `chinese*` fields kept as fallback
 * (see docs/improvements/infrastructure/cms-i18n-migration.md).
 */
import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'values',
  labels: { singular: { en: 'Values Block', zh: '价值观区块' }, plural: { en: 'Values Blocks', zh: '价值观区块' } },
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
      name: 'chineseHeadline',
      type: 'text',
      label: { en: 'Chinese Headline (legacy)', zh: '中文标题（旧版）' },
      admin: { description: { en: 'LEGACY fallback when zh locale headline is empty.', zh: '当 zh locale 的 headline 为空时作为回退。' } },
    },
    {
      name: 'fourHarmoniesItems',
      type: 'array',
      label: { en: 'Four Harmonies Items', zh: '四和项目' },
      maxRows: 4,
      fields: [
        // The single character (e.g. 心) is decorative brand identity — kept Chinese in both locales.
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Character (decorative)', zh: '中文字符（装饰性）' } },
        { name: 'english', type: 'text', required: true, localized: true, label: { en: 'Label', zh: '标签' } },
      ],
    },
    {
      name: 'fiveUnitiesItems',
      type: 'array',
      label: { en: 'Five Unities Items', zh: '五统项目' },
      maxRows: 5,
      fields: [
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Character (decorative)', zh: '中文字符（装饰性）' } },
        { name: 'english', type: 'text', required: true, localized: true, label: { en: 'Label', zh: '标签' } },
      ],
    },
    {
      name: 'mottos',
      type: 'array',
      label: { en: 'Motto Items', zh: '箴言项目' },
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { en: 'Label (e.g. "VALUES")', zh: '标签（如 "价值观"）' } },
        { name: 'chinese', type: 'text', required: true, label: { en: 'Chinese Text (legacy)', zh: '中文文字（旧版）' } },
        { name: 'english', type: 'text', required: true, localized: true, label: { en: 'Text', zh: '文字' } },
      ],
    },
  ],
}
