/**
 * Pages collection — marketing pages composed of Payload blocks.
 * Each page has a slug (e.g. "home") and a blocks field that drives
 * the BlockRenderer in the Next.js front-end.
 *
 * Content is authored in /admin and stored in Supabase cms schema.
 * Read access is public. All mutations require authentication.
 */
import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { ValuesBlock } from '../blocks/ValuesBlock'
import { AboutBlock } from '../blocks/AboutBlock'
import { ServicesBlock } from '../blocks/ServicesBlock'
import { PlatformTeaserBlock } from '../blocks/PlatformTeaserBlock'
import { ClientsBlock } from '../blocks/ClientsBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    description: 'Marketing pages. Add a page with slug "home" to populate the homepage.',
  },
  access: {
    // Public read — Next.js server components fetch pages without credentials.
    // Logged to SECURITY.md.
    read: () => true,
    // Create / update / delete require a logged-in CMS editor.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Page Title',
      admin: { description: 'Internal title for the CMS (not shown on the site)' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description:
          'URL identifier. Use "home" for the homepage. Must be unique.',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Page Blocks',
      blocks: [
        HeroBlock,
        StatsBlock,
        ValuesBlock,
        AboutBlock,
        ServicesBlock,
        PlatformTeaserBlock,
        ClientsBlock,
      ],
    },
  ],
}
