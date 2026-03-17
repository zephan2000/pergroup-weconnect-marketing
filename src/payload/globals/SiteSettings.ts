/**
 * Payload global: Site Settings.
 * Allows CMS editors to override the marketing site color palette without code changes.
 * Colors are injected as CSS custom property overrides on the marketing layout root div.
 * If a field is left empty, the hardcoded default in globals.css applies.
 */
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { en: 'Site Settings', zh: '网站设置' },
  fields: [
    {
      name: 'colors',
      type: 'group',
      label: { en: 'Color Palette', zh: '配色方案' },
      admin: {
        description: {
          en: 'Override the site color palette. Leave blank to use defaults. Use hex values (e.g. #F5A82A).',
          zh: '覆盖网站配色方案。留空使用默认值。使用十六进制值（如 #F5A82A）。',
        },
      },
      fields: [
        {
          name: 'amber',
          type: 'text',
          label: { en: 'Amber (primary accent)', zh: '琥珀色（主强调色）' },
          admin: { description: { en: 'Default: #F5A82A', zh: '默认：#F5A82A' } },
        },
        {
          name: 'green',
          type: 'text',
          label: { en: 'Green (secondary accent)', zh: '绿色（次强调色）' },
          admin: { description: { en: 'Default: #39E07A', zh: '默认：#39E07A' } },
        },
        {
          name: 'bg',
          type: 'text',
          label: { en: 'Background', zh: '背景色' },
          admin: { description: { en: 'Default: #05060A', zh: '默认：#05060A' } },
        },
        {
          name: 'bg2',
          type: 'text',
          label: { en: 'Background Alt', zh: '备用背景色' },
          admin: { description: { en: 'Default: #080B12', zh: '默认：#080B12' } },
        },
        {
          name: 'text',
          type: 'text',
          label: { en: 'Text Color', zh: '文字颜色' },
          admin: { description: { en: 'Default: #DDE0E8', zh: '默认：#DDE0E8' } },
        },
        {
          name: 'muted',
          type: 'text',
          label: { en: 'Muted Text', zh: '弱化文字' },
          admin: { description: { en: 'Default: rgba(221,224,232,0.4)', zh: '默认：rgba(221,224,232,0.4)' } },
        },
        {
          name: 'line',
          type: 'text',
          label: { en: 'Border / Line', zh: '边框/分割线' },
          admin: { description: { en: 'Default: rgba(255,255,255,0.06)', zh: '默认：rgba(255,255,255,0.06)' } },
        },
      ],
    },
  ],
}
