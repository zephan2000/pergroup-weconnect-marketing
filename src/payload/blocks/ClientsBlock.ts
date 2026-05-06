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
      minRows: 0,
      fields: [
        { name: 'name', type: 'text', required: true, label: { en: 'Name', zh: '名称' } },
      ],
    },
    {
      name: 'networkSubtitle',
      type: 'text',
      localized: true,
      label: { en: 'Network Subtitle', zh: '网络副标题' },
      admin: { description: { en: 'Short line under the headline (e.g. "A globally distributed partner network").', zh: '主标题下方的副标题。' } },
    },
    {
      name: 'regionsHeading',
      type: 'text',
      localized: true,
      label: { en: 'Regions Heading', zh: '区域覆盖标题' },
    },
    {
      name: 'partnerTypes',
      type: 'array',
      label: { en: 'Partner Types', zh: '合作伙伴类型' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: { en: 'Icon', zh: '图标' },
          options: [
            { label: 'Globe', value: 'Globe' },
            { label: 'Building2', value: 'Building2' },
            { label: 'Handshake', value: 'Handshake' },
            { label: 'Award', value: 'Award' },
          ],
          admin: { description: { en: 'Lucide icon name. Frozen set — adding new icons requires a code change.', zh: 'Lucide 图标名称。固定集合 — 新增图标需修改代码。' } },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', zh: '标题' } },
        { name: 'examples', type: 'text', localized: true, label: { en: 'Examples (sub-line)', zh: '示例（副行）' } },
      ],
    },
    {
      name: 'regions',
      type: 'array',
      label: { en: 'Regional Presence', zh: '区域分布' },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true, label: { en: 'Region Name', zh: '区域名称' } },
        { name: 'count', type: 'text', required: true, label: { en: 'Count (e.g. "80+")', zh: '数量（如 "80+"）' } },
      ],
    },
  ],
}
