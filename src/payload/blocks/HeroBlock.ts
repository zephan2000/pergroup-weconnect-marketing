/**
 * HeroBlock — the full-screen hero section.
 * Derived from #hero in /reference/pergroup-website.html.
 */
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: { en: 'Hero Block', zh: '首屏区块' }, plural: { en: 'Hero Blocks', zh: '首屏区块' } },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow Text', zh: '眉标文字' },
      admin: { description: { en: 'Small text above the headline. Localized.', zh: '标题上方的小字。可按语言翻译。' } },
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      label: { en: 'Headline (Line 1)', zh: '标题（第一行）' },
      required: true,
    },
    {
      name: 'headlineAccent',
      type: 'text',
      localized: true,
      label: { en: 'Headline (Accent Line — amber gradient)', zh: '标题（强调行 — 琥珀色渐变）' },
    },
    {
      name: 'headlineFaint',
      type: 'text',
      localized: true,
      label: { en: 'Headline (Faint Line)', zh: '标题（淡化行）' },
    },
    {
      name: 'chineseSubtitle',
      type: 'text',
      label: { en: 'Chinese Subtitle (legacy)', zh: '中文副标题（旧版）' },
      admin: {
        description: {
          en: 'LEGACY: kept for fallback in zh locale. Prefer adding a "subtitle" via locale switcher.',
          zh: '旧版字段：当 zh locale 中 subtitle 为空时作为回退。建议改用 locale 切换器编辑 subtitle。',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { en: 'Subtitle', zh: '副标题' },
      admin: { description: { en: 'Tagline below headline. Switch to ZH locale to enter Chinese.', zh: '标题下方的副标题。切换到中文 locale 输入中文。' } },
    },
    {
      name: 'stats',
      type: 'array',
      label: { en: 'Stat Cards (right column)', zh: '数据卡片（右栏）' },
      maxRows: 4,
      fields: [
        { name: 'number', type: 'text', required: true, label: { en: 'Number (e.g. "15+")', zh: '数字（如 "15+"）' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { en: 'Label', zh: '标签' } },
        { name: 'chineseLabel', type: 'text', label: { en: 'Chinese Label (legacy)', zh: '中文标签（旧版）' }, admin: { description: { en: 'LEGACY fallback. Prefer setting label in zh locale.', zh: '旧版回退字段。建议在 zh locale 中设置 label。' } } },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: { en: 'CTA Buttons', zh: '行动按钮' },
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { en: 'Button Label', zh: '按钮文字' } },
        { name: 'href', type: 'text', required: true, label: { en: 'Link (href)', zh: '链接地址' } },
        {
          name: 'variant',
          type: 'select',
          label: { en: 'Style', zh: '样式' },
          defaultValue: 'fill',
          options: [
            { label: { en: 'Filled (amber)', zh: '填充（琥珀色）' }, value: 'fill' },
            { label: { en: 'Ghost (outline)', zh: '描边样式' }, value: 'ghost' },
            { label: { en: 'WeConnect Platform trigger', zh: 'WeConnect 平台触发器' }, value: 'weconnect' },
          ],
        },
      ],
    },
  ],
}
