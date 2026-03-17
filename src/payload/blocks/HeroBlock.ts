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
      label: { en: 'Eyebrow Text', zh: '眉标文字' },
      admin: { description: { en: 'Small text above the headline, e.g. "Global Tech Innovation Ecosystem"', zh: '标题上方的小字，如 "Global Tech Innovation Ecosystem"' } },
    },
    {
      name: 'headline',
      type: 'text',
      label: { en: 'Headline (Line 1)', zh: '标题（第一行）' },
      required: true,
      admin: { description: { en: 'e.g. "Make Innovation"', zh: '如 "Make Innovation"' } },
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: { en: 'Headline (Accent Line — amber gradient)', zh: '标题（强调行 — 琥珀色渐变）' },
      admin: { description: { en: 'e.g. "Open to Anyone,"', zh: '如 "Open to Anyone,"' } },
    },
    {
      name: 'headlineFaint',
      type: 'text',
      label: { en: 'Headline (Faint Line)', zh: '标题（淡化行）' },
      admin: { description: { en: 'e.g. "Anywhere."', zh: '如 "Anywhere."' } },
    },
    {
      name: 'chineseSubtitle',
      type: 'text',
      label: { en: 'Chinese Subtitle', zh: '中文副标题' },
      admin: { description: { en: 'e.g. "科技创新 · 商业赋能 · 人文关怀"', zh: '如 "科技创新 · 商业赋能 · 人文关怀"' } },
    },
    {
      name: 'stats',
      type: 'array',
      label: { en: 'Stat Cards (right column)', zh: '数据卡片（右栏）' },
      maxRows: 4,
      admin: { description: { en: 'The stat cards displayed to the right of the headline. Up to 4; the last two are grouped side-by-side automatically.', zh: '标题右侧显示的数据卡片。最多4个；最后两个自动并排显示。' } },
      fields: [
        { name: 'number', type: 'text', required: true, label: { en: 'Number (e.g. "15+")', zh: '数字（如 "15+"）' } },
        { name: 'label', type: 'text', required: true, label: { en: 'English Label', zh: '英文标签' } },
        { name: 'chineseLabel', type: 'text', label: { en: 'Chinese Label', zh: '中文标签' } },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: { en: 'CTA Buttons', zh: '行动按钮' },
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Button Label', zh: '按钮文字' } },
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
