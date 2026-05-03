/**
 * StatsBlock — stat cards displayed beside the hero.
 * Derived from .hero-side / .stat-card in /reference/pergroup-website.html.
 */
import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: { en: 'Stats Block', zh: '数据统计区块' }, plural: { en: 'Stats Blocks', zh: '数据统计区块' } },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: { en: 'Stat Items', zh: '数据项' },
      required: true,
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', required: true, label: { en: 'Number (e.g. "15+")', zh: '数字（如 "15+"）' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { en: 'Label', zh: '标签' } },
        { name: 'chineseLabel', type: 'text', label: { en: 'Chinese Label (legacy)', zh: '中文标签（旧版）' }, admin: { description: { en: 'LEGACY: prefer label in zh locale.', zh: '旧版字段。建议在 zh locale 中设置 label。' } } },
      ],
    },
  ],
}
