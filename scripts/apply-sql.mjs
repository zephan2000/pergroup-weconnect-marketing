#!/usr/bin/env node
/**
 * Apply an arbitrary .sql file to the production database.
 * The .sql file is expected to wrap itself in BEGIN/COMMIT.
 *
 * Usage: node scripts/apply-sql.mjs scripts/zh-translations-fill.sql
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

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/apply-sql.mjs <path-to-sql>')
  process.exit(1)
}

const sql = readFileSync(path.join(root, file), 'utf8')
console.log(`▸ Applying ${file}  (${sql.length} chars)`)

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  await client.query(sql)
  console.log(`✓ Applied successfully.`)
} catch (err) {
  console.error(`✗ FAILED — ${err.message}`)
  if (err.position) console.error(`  position: ${err.position}`)
  if (err.detail) console.error(`  detail: ${err.detail}`)
  process.exit(1)
} finally {
  await client.end()
}
