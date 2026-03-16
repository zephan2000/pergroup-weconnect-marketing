/**
 * ClientsBlock — scrolling marquee of client/partner names.
 * Derived from #clients in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ClientsBlock: Block = {
  slug: 'clients',
  labels: { singular: 'Clients / Partners Block', plural: 'Clients / Partners Blocks' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
      admin: { description: 'Optional label above the marquee' },
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Client / Partner Names',
      required: true,
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Name' },
      ],
    },
  ],
}
