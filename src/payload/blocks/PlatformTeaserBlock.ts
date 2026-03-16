/**
 * PlatformTeaserBlock — WeConnect platform teaser section.
 * Derived from #platform-teaser in /reference/pergroup-website.html.
 * Content is authored in /admin and stored in Supabase cms schema.
 */
import type { Block } from 'payload'

export const PlatformTeaserBlock: Block = {
  slug: 'platformTeaser',
  labels: { singular: 'Platform Teaser Block', plural: 'Platform Teaser Blocks' },
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
      name: 'headlineAccent',
      type: 'text',
      label: 'Headline Accent (amber italic)',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body Text',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Feature List Items',
      maxRows: 5,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Feature Title' },
        { name: 'description', type: 'text', label: 'Feature Description' },
        {
          name: 'accentColor',
          type: 'select',
          label: 'Dot Colour',
          defaultValue: 'green',
          options: [
            { label: 'Green', value: 'green' },
            { label: 'Amber', value: 'amber' },
          ],
        },
      ],
    },
    {
      name: 'launchCtaLabel',
      type: 'text',
      label: 'Launch CTA Button Label',
      required: true,
    },
  ],
}
