/**
 * StatsBlock — stat cards displayed beside the hero.
 * Derived from .hero-side / .stat-card in /reference/pergroup-website.html.
 */
import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats Block', plural: 'Stats Blocks' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Stat Items',
      required: true,
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', required: true, label: 'Number (e.g. "15+")' },
        { name: 'label', type: 'text', required: true, label: 'English Label' },
        { name: 'chineseLabel', type: 'text', label: 'Chinese Label' },
      ],
    },
  ],
}
