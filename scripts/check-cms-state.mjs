#!/usr/bin/env node
/**
 * Pre-migration sanity check. Confirms the DB is in the expected state
 * before applying 5b.2.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  const envText = readFileSync(path.join(root, '.env.local'), 'utf8')
  for (const line of envText.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) {
      let val = m[2]
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      process.env[m[1]] = val
    }
  }
} catch {}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const checks = [
  {
    name: 'cms._locales enum exists',
    sql: `SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'cms' AND t.typname = '_locales'`,
  },
  {
    name: 'cms.pages_blocks_hero_locales has eyebrow column',
    sql: `SELECT 1 FROM information_schema.columns WHERE table_schema = 'cms' AND table_name = 'pages_blocks_hero_locales' AND column_name = 'eyebrow'`,
  },
  {
    name: 'cms.pages_blocks_about exists',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'pages_blocks_about'`,
  },
  {
    name: 'cms.pages_blocks_clients exists',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'pages_blocks_clients'`,
  },
  {
    name: 'cms.pages_blocks_services_locales exists',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'pages_blocks_services_locales'`,
  },
  {
    name: 'cms.payload_migrations exists',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'payload_migrations'`,
  },
  {
    name: 'cms.nav_settings does NOT exist yet',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'nav_settings'`,
    expectEmpty: true,
  },
  {
    name: 'cms.requirement_form_settings does NOT exist yet',
    sql: `SELECT 1 FROM information_schema.tables WHERE table_schema = 'cms' AND table_name = 'requirement_form_settings'`,
    expectEmpty: true,
  },
]

let ok = true
for (const c of checks) {
  const res = await client.query(c.sql)
  const has = res.rows.length > 0
  const expected = c.expectEmpty ? !has : has
  console.log(`${expected ? '✓' : '✗'} ${c.name}: ${has ? 'present' : 'absent'}`)
  if (!expected) ok = false
}

const mig = await client.query(`SELECT name, created_at FROM cms.payload_migrations ORDER BY created_at`)
console.log('')
console.log('Recorded migrations:')
for (const row of mig.rows) console.log(`  • ${row.name} @ ${row.created_at.toISOString()}`)

const pageCount = await client.query(`SELECT COUNT(*)::int AS n FROM cms.pages`)
const aboutCount = await client.query(`SELECT COUNT(*)::int AS n FROM cms.pages_blocks_about`)
const clientsCount = await client.query(`SELECT COUNT(*)::int AS n FROM cms.pages_blocks_clients`)
console.log('')
console.log(`Pages: ${pageCount.rows[0].n}, AboutBlock instances: ${aboutCount.rows[0].n}, ClientsBlock instances: ${clientsCount.rows[0].n}`)

await client.end()
process.exit(ok ? 0 : 1)
