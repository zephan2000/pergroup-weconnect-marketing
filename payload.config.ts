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
import { NavSettings } from './src/payload/globals/NavSettings'
import { FooterSettings } from './src/payload/globals/FooterSettings'
import { WeConnectSettings } from './src/payload/globals/WeConnectSettings'
import { RequirementFormSettings } from './src/payload/globals/RequirementFormSettings'
import { OfferingFormSettings } from './src/payload/globals/OfferingFormSettings'
import { ContactFormSettings } from './src/payload/globals/ContactFormSettings'

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
      url: ({ data, globalConfig }) => {
        const base = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
        const secret = process.env.PAYLOAD_SECRET
        // Form-settings globals: route to homepage with a preview tag so the
        // matching modal auto-opens in the iframe (see WeConnectOverlay).
        const previewByGlobalSlug: Record<string, string> = {
          'requirement-form-settings': 'need-form',
          'offering-form-settings': 'offering-form',
          'contact-form-settings': 'contact-form',
        }
        const previewTag = globalConfig?.slug ? previewByGlobalSlug[globalConfig.slug] : undefined
        if (previewTag) {
          return `${base}/api/draft?secret=${secret}&slug=/&preview=${previewTag}`
        }
        const slug = data?.slug && data.slug !== 'home' ? `/${data.slug}` : '/'
        return `${base}/api/draft?secret=${secret}&slug=${slug}`
      },
      collections: ['pages'],
      globals: [
        'platform-settings',
        'site-settings',
        'nav-settings',
        'footer-settings',
        'weconnect-settings',
        'requirement-form-settings',
        'offering-form-settings',
        'contact-form-settings',
      ],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [Pages, Users],

  globals: [
    PlatformSettings,
    SiteSettings,
    NavSettings,
    FooterSettings,
    WeConnectSettings,
    RequirementFormSettings,
    OfferingFormSettings,
    ContactFormSettings,
  ],

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
    schemaName: 'cms',
    // Drizzle Kit auto-push:
    //   • In local dev — enabled (fast iteration on schema changes).
    //   • In production (Vercel build/runtime) — disabled. All schema changes
    //     flow through explicit migrations: `npx payload migrate:create` +
    //     hand-edit if needed + `npx payload migrate`.
    // See docs/improvements/infrastructure/cms-backup-runbook.md.
    // Reason: auto-push prompts (y/N) for destructive ops. Vercel has no TTY
    // → prompt hangs → 500. Migrations are also versioned and auditable.
    push: process.env.NODE_ENV !== 'production',
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
