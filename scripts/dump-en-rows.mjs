#!/usr/bin/env node
/**
 * Phase 5b.4 prep — dump full EN rows for the array-bearing locales tables
 * so I can pair each item with a ZH translation in the SQL fill.
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

async function dump(table, columns) {
  const cols = ['_locale', '_parent_id', ...columns].map((c) => `"${c}"`).join(', ')
  const r = await client.query(
    `SELECT ${cols} FROM cms.${table} WHERE _locale='en' ORDER BY _parent_id`,
  )
  console.log(`\n=== ${table} (${r.rows.length} en rows) ===`)
  for (const row of r.rows) {
    console.log(JSON.stringify(row, null, 2))
  }
}

await dump('pages_blocks_about_advantages_locales', ['title', 'description'])
await dump('pages_blocks_about_advantages', []).catch(() => {})
await dump('pages_blocks_hero_cta_buttons_locales', ['label'])
await dump('pages_blocks_platform_teaser_features_locales', ['title', 'description'])
await dump('pages_blocks_services_services_locales', ['title', 'description'])
await dump('pages_blocks_values_four_harmonies_items_locales', ['english'])
await dump('pages_blocks_values_five_unities_items_locales', ['english'])
await dump('pages_blocks_values_mottos_locales', ['label', 'english'])

// Also dump the parent rows for context (year/icon/code identifiers)
const aboutAdv = await client.query(
  `SELECT id, _order, "icon" FROM cms.pages_blocks_about_advantages ORDER BY _order`,
)
console.log('\n=== pages_blocks_about_advantages parents ===')
console.log(JSON.stringify(aboutAdv.rows, null, 2))

const features = await client.query(
  `SELECT id, _order FROM cms.pages_blocks_platform_teaser_features ORDER BY _order`,
)
console.log('\n=== pages_blocks_platform_teaser_features parents ===')
console.log(JSON.stringify(features.rows, null, 2))

const services = await client.query(
  `SELECT id, _order, "number", "icon", "chinese_title" FROM cms.pages_blocks_services_services ORDER BY _order`,
)
console.log('\n=== pages_blocks_services_services parents ===')
console.log(JSON.stringify(services.rows, null, 2))

const fourH = await client.query(
  `SELECT id, _order, "chinese" FROM cms.pages_blocks_values_four_harmonies_items ORDER BY _order`,
)
console.log('\n=== pages_blocks_values_four_harmonies_items parents ===')
console.log(JSON.stringify(fourH.rows, null, 2))

const fiveU = await client.query(
  `SELECT id, _order, "chinese" FROM cms.pages_blocks_values_five_unities_items ORDER BY _order`,
)
console.log('\n=== pages_blocks_values_five_unities_items parents ===')
console.log(JSON.stringify(fiveU.rows, null, 2))

const mottos = await client.query(
  `SELECT id, _order, "chinese" FROM cms.pages_blocks_values_mottos ORDER BY _order`,
)
console.log('\n=== pages_blocks_values_mottos parents ===')
console.log(JSON.stringify(mottos.rows, null, 2))

const ctaBtns = await client.query(
  `SELECT id, _order, "href", "variant" FROM cms.pages_blocks_hero_cta_buttons ORDER BY _order`,
)
console.log('\n=== pages_blocks_hero_cta_buttons parents ===')
console.log(JSON.stringify(ctaBtns.rows, null, 2))

await client.end()
