/**
 * ValuesBlock — Four Harmonies + Five Unities + motto row.
 * Derived from #values in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'values',
  labels: { singular: 'Values Block', plural: 'Values Blocks' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      required: true,
    },
    {
      name: 'chineseHeadline',
      type: 'text',
      label: 'Chinese Headline',
    },
    {
      name: 'fourHarmoniesItems',
      type: 'array',
      label: 'Four Harmonies Items',
      maxRows: 4,
      fields: [
        { name: 'chinese', type: 'text', required: true, label: 'Chinese Text' },
        { name: 'english', type: 'text', required: true, label: 'English Text' },
      ],
    },
    {
      name: 'fiveUnitiesItems',
      type: 'array',
      label: 'Five Unities Items',
      maxRows: 5,
      fields: [
        { name: 'chinese', type: 'text', required: true, label: 'Chinese Character' },
        { name: 'english', type: 'text', required: true, label: 'English Label' },
      ],
    },
    {
      name: 'mottos',
      type: 'array',
      label: 'Motto Items',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Label (e.g. "VALUES · 价值观")' },
        { name: 'chinese', type: 'text', required: true, label: 'Chinese Text' },
        { name: 'english', type: 'text', required: true, label: 'English Text' },
      ],
    },
  ],
}
