/**
 * ClientsBlock — scrolling marquee of client/partner names.
 * Derived from #clients in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const ClientsBlock: Block = {
  slug: 'clients',
  labels: { singular: { en: 'Clients / Partners Block', zh: '客户/合作伙伴区块' }, plural: { en: 'Clients / Partners Blocks', zh: '客户/合作伙伴区块' } },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: { en: 'Section Label', zh: '板块标签' },
      admin: { description: { en: 'Optional label above the marquee', zh: '跑马灯上方的可选标签' } },
    },
    {
      name: 'clients',
      type: 'array',
      label: { en: 'Client / Partner Names', zh: '客户/合作伙伴名称' },
      required: true,
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true, label: { en: 'Name', zh: '名称' } },
      ],
    },
  ],
}
