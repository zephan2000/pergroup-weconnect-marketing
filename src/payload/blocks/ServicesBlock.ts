/**
 * ServicesBlock — "End-to-End Global Services" 3-column grid.
 * Derived from #services in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services Block', plural: 'Services Blocks' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline (first line)',
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: 'Headline Accent Line (amber)',
    },
    {
      name: 'services',
      type: 'array',
      label: 'Service Items',
      required: true,
      minRows: 1,
      maxRows: 9,
      fields: [
        { name: 'number', type: 'text', required: true, label: 'Number (e.g. "01")' },
        {
          name: 'icon',
          type: 'text',
          label: 'Emoji Icon',
          admin: { description: 'e.g. 🔍' },
        },
        { name: 'title', type: 'text', required: true, label: 'English Title' },
        { name: 'chineseTitle', type: 'text', label: 'Chinese Title' },
        { name: 'description', type: 'textarea', label: 'Description' },
      ],
    },
  ],
}
