import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { zh } from '@payloadcms/translations/languages/zh'
import { Pages } from './src/payload/collections/Pages'
import { Users } from './src/payload/collections/Users'
import { PlatformSettings } from './src/payload/globals/PlatformSettings'
import { SiteSettings } from './src/payload/globals/SiteSettings'

export default buildConfig({
  i18n: {
    supportedLanguages: { en, zh },
    fallbackLanguage: 'en',
  },

  admin: {
    // Payload built-in auth — CMS editors only. See CLAUDE.md Authentication section.
    user: Users.slug,
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'}${
          data?.slug && data.slug !== 'home' ? `/${data.slug}` : ''
        }`,
      collections: ['pages'],
      globals: ['platform-settings', 'site-settings'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [Pages, Users],

  globals: [PlatformSettings, SiteSettings],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // DECISION: schemaName places all Payload-generated tables in the `cms`
    // Postgres schema, keeping them separate from weconnect.* tables.
    // Requires `CREATE SCHEMA IF NOT EXISTS cms;` in Supabase before first run.
    // Verify: check @payloadcms/db-postgres docs for your exact version.
    schemaName: 'cms',
  }),

  // Lexical is the default and recommended rich text editor for Payload v3.
  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || '',

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  typescript: {
    // Generated types file — run `npm run generate:types` after changing collections.
    outputFile: path.resolve(__dirname, 'src/payload-types.ts'),
  },
})
