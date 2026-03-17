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
  labels: {
    singular: { en: 'Page', zh: '页面' },
    plural: { en: 'Pages', zh: '页面列表' },
  },
  admin: {
    useAsTitle: 'title',
    description: {
      en: 'Marketing pages. Add a page with slug "home" to populate the homepage.',
      zh: '营销页面。添加 slug 为 "home" 的页面以填充首页。',
    },
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
      const slug = doc?.slug && doc.slug !== 'home' ? `/${doc.slug}` : '/'
      return `${base}/api/draft?secret=${process.env.PAYLOAD_SECRET}&slug=${slug}`
    },
    components: {
      edit: {
        PreviewButton: '@/payload/components/PreviewButton',
      },
    },
  },
  versions: {
    drafts: true, // Save Draft + Publish buttons; no autosave (manual save only)
    // No maxPerDoc — all versions kept indefinitely. Editors can review/revert
    // any past version from the admin Versions tab. Storage is negligible.
    // RISK: See CHANGELOG.md and SECURITY.md for monitoring guidance.
  },
  access: {
    // Authenticated editors see all docs (including drafts).
    // Public (unauthenticated) only sees published pages.
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
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
      label: { en: 'Page Title', zh: '页面标题' },
      admin: { description: { en: 'Internal title for the CMS (not shown on the site)', zh: 'CMS 内部标题（不显示在网站上）' } },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: { en: 'Slug', zh: '页面标识符' },
      admin: {
        description: {
          en: 'URL identifier. Use "home" for the homepage. Must be unique.',
          zh: 'URL 标识符。首页使用 "home"。必须唯一。',
        },
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: { en: 'Page Blocks', zh: '页面区块' },
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
