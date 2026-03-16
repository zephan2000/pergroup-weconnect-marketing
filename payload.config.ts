import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Pages } from './src/payload/collections/Pages'
import { Users } from './src/payload/collections/Users'

export default buildConfig({
  admin: {
    // Payload built-in auth — CMS editors only. See CLAUDE.md Authentication section.
    user: Users.slug,
  },

  collections: [Pages, Users],

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
