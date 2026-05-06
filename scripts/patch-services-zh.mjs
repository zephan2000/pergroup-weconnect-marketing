#!/usr/bin/env node
/**
 * Post-5b.2 patch: insert missing ZH row in pages_blocks_services_locales.
 *
 * The localize_blocks migration only seeded EN for parent block locales — ZH
 * rows are missing for several block tables. For 5b.2 we just need the new
 * `subtitle` field to render in ZH; broader missing-ZH translations on
 * about/platform_teaser/values will be handled in Phase 5b.4's SQL fill.
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

try {
  await client.query('BEGIN')

  // For each ServicesBlock parent, insert a ZH row if absent.
  await client.query(`
    INSERT INTO cms.pages_blocks_services_locales (_locale, _parent_id, subtitle)
    SELECT 'zh', sb.id, '全方位全球化服务'
    FROM cms.pages_blocks_services sb
    WHERE NOT EXISTS (
      SELECT 1 FROM cms.pages_blocks_services_locales sl
      WHERE sl._parent_id = sb.id AND sl._locale = 'zh'
    );
  `)
  // Same for the version table.
  await client.query(`
    INSERT INTO cms._pages_v_blocks_services_locales (_locale, _parent_id, subtitle)
    SELECT 'zh', vsb.id, '全方位全球化服务'
    FROM cms._pages_v_blocks_services vsb
    WHERE NOT EXISTS (
      SELECT 1 FROM cms._pages_v_blocks_services_locales vsl
      WHERE vsl._parent_id = vsb.id AND vsl._locale = 'zh'
    );
  `)

  await client.query('COMMIT')

  const v = await client.query(`SELECT _locale, subtitle FROM cms.pages_blocks_services_locales ORDER BY _locale`)
  console.log('After patch:')
  for (const r of v.rows) console.log(`  ${r._locale}: ${r.subtitle}`)
} catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error('Patch failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
