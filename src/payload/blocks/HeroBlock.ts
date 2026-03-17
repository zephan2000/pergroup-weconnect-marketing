/**
 * HeroBlock — the full-screen hero section.
 * Derived from #hero in /reference/pergroup-website.html.
 */
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      admin: { description: 'Small text above the headline, e.g. "Global Tech Innovation Ecosystem"' },
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline (Line 1)',
      required: true,
      admin: { description: 'e.g. "Make Innovation"' },
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: 'Headline (Accent Line — amber gradient)',
      admin: { description: 'e.g. "Open to Anyone,"' },
    },
    {
      name: 'headlineFaint',
      type: 'text',
      label: 'Headline (Faint Line)',
      admin: { description: 'e.g. "Anywhere."' },
    },
    {
      name: 'chineseSubtitle',
      type: 'text',
      label: 'Chinese Subtitle',
      admin: { description: 'e.g. "科技创新 · 商业赋能 · 人文关怀"' },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stat Cards (right column)',
      maxRows: 4,
      admin: { description: 'The stat cards displayed to the right of the headline. Up to 4; the last two are grouped side-by-side automatically.' },
      fields: [
        { name: 'number', type: 'text', required: true, label: 'Number (e.g. "15+")' },
        { name: 'label', type: 'text', required: true, label: 'English Label' },
        { name: 'chineseLabel', type: 'text', label: 'Chinese Label' },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'CTA Buttons',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Button Label' },
        { name: 'href', type: 'text', required: true, label: 'Link (href)' },
        {
          name: 'variant',
          type: 'select',
          label: 'Style',
          defaultValue: 'fill',
          options: [
            { label: 'Filled (amber)', value: 'fill' },
            { label: 'Ghost (outline)', value: 'ghost' },
            { label: 'WeConnect Platform trigger', value: 'weconnect' },
          ],
        },
      ],
    },
  ],
}
