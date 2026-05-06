#!/usr/bin/env node
/**
 * Post-migration verification for Phase 5b.2.
 * Confirms every new table exists with the expected row counts.
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
  { table: 'cms.nav_settings', expect: 1 },
  { table: 'cms.nav_settings_locales', expect: 2 },
  { table: 'cms.footer_settings', expect: 1 },
  { table: 'cms.footer_settings_locales', expect: 2 },
  { table: 'cms.weconnect_settings', expect: 1 },
  { table: 'cms.weconnect_settings_locales', expect: 2 },
  { table: 'cms.requirement_form_settings', expect: 1 },
  { table: 'cms.requirement_form_settings_locales', expect: 2 },
  { table: 'cms.contact_form_settings', expect: 1 },
  { table: 'cms.contact_form_settings_locales', expect: 2 },
  { table: 'cms.pages_blocks_about_milestones', expect: 4 },
  { table: 'cms.pages_blocks_about_milestones_locales', expect: 8 },
  { table: 'cms.pages_blocks_clients_partner_types', expect: 4 },
  { table: 'cms.pages_blocks_clients_partner_types_locales', expect: 8 },
  { table: 'cms.pages_blocks_clients_regions', expect: 6 },
  { table: 'cms.pages_blocks_clients_regions_locales', expect: 12 },
  { table: 'cms.pages_blocks_clients_locales', expect: 2 },
]

let ok = true
for (const c of checks) {
  try {
    const res = await client.query(`SELECT COUNT(*)::int AS n FROM ${c.table}`)
    const n = res.rows[0].n
    const pass = n === c.expect
    console.log(`${pass ? '✓' : '✗'} ${c.table}: ${n} rows (expected ${c.expect})`)
    if (!pass) ok = false
  } catch (err) {
    console.log(`✗ ${c.table}: ${err.message}`)
    ok = false
  }
}

// Check the backfilled columns are set
const heroEn = await client.query(`SELECT scroll_hint_label FROM cms.pages_blocks_hero_locales WHERE _locale='en' LIMIT 1`)
const heroZh = await client.query(`SELECT scroll_hint_label FROM cms.pages_blocks_hero_locales WHERE _locale='zh' LIMIT 1`)
const svcEn = await client.query(`SELECT subtitle FROM cms.pages_blocks_services_locales WHERE _locale='en' LIMIT 1`)
const svcZh = await client.query(`SELECT subtitle FROM cms.pages_blocks_services_locales WHERE _locale='zh' LIMIT 1`)
console.log('')
console.log(`hero scroll_hint_label  en="${heroEn.rows[0]?.scroll_hint_label ?? ''}"  zh="${heroZh.rows[0]?.scroll_hint_label ?? ''}"`)
console.log(`services subtitle       en="${svcEn.rows[0]?.subtitle ?? ''}"  zh="${svcZh.rows[0]?.subtitle ?? ''}"`)

// Sample a couple of populated rows
const sample = await client.query(`
  SELECT 'milestone-en' AS k, ml.title FROM cms.pages_blocks_about_milestones_locales ml WHERE _locale='en'
  UNION ALL SELECT 'milestone-zh', ml.title FROM cms.pages_blocks_about_milestones_locales ml WHERE _locale='zh'
`)
console.log('')
console.log('Sample milestone titles:')
for (const row of sample.rows) console.log(`  ${row.k}: ${row.title}`)

await client.end()
process.exit(ok ? 0 : 1)
