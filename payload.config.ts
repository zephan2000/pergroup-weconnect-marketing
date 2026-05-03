import path from 'path'
import type { PoolConfig } from 'pg'
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

  // Frontend content localization. Each field marked `localized: true` stores
  // a value per locale; queries with `{ locale }` pick the right one.
  // Fallback: if zh value is empty, return en. See:
  //   docs/improvements/infrastructure/i18n-architecture.md
  //   docs/improvements/infrastructure/cms-i18n-migration.md
  localization: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    fallback: true,
  },

  admin: {
    // Payload built-in auth — CMS editors only. See CLAUDE.md Authentication section.
    user: Users.slug,
    components: {
      actions: ['@/payload/components/LanguageToggle'],
    },
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
        const slug = data?.slug && data.slug !== 'home' ? `/${data.slug}` : '/'
        return `${base}/api/draft?secret=${process.env.PAYLOAD_SECRET}&slug=${slug}`
      },
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
      max: 5,
      // Disable prepared statements — required for Supabase transaction mode pooler (port 6543).
      // Transaction mode doesn't support persistent sessions needed for prepared statements.
      // Not in pg's PoolConfig type but accepted at runtime.
      prepare: false,
    } as PoolConfig,
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
