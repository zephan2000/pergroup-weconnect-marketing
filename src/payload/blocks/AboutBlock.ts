/**
 * AboutBlock — "A Network Built on Genuine Trust" section.
 * Derived from #about in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: 'About Block', plural: 'About Blocks' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline (first part)',
      required: true,
      admin: { description: 'e.g. "A Network Built on"' },
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: 'Headline Accent (renders in amber)',
      admin: { description: 'e.g. "Genuine Trust"' },
    },
    {
      name: 'bodyParagraphs',
      type: 'array',
      label: 'Body Paragraphs',
      fields: [
        { name: 'text', type: 'textarea', required: true, label: 'Paragraph' },
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      label: 'Advantage Cards',
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Emoji Icon',
          admin: { description: 'e.g. 🔭' },
        },
        { name: 'title', type: 'text', required: true, label: 'Title' },
        { name: 'description', type: 'text', label: 'Description (incl. Chinese)' },
      ],
    },
    {
      name: 'globeStat',
      type: 'group',
      label: 'Globe Stat',
      fields: [
        { name: 'number', type: 'text', label: 'Number (e.g. "53+")' },
        { name: 'label', type: 'text', label: 'Label (e.g. "COUNTRIES")' },
      ],
    },
  ],
}
