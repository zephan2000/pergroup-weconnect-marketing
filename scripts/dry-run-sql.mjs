#!/usr/bin/env node
/**
 * Dry-run an arbitrary .sql file: wraps in BEGIN/ROLLBACK and reports
 * pass/fail without persisting changes.
 *
 * Usage: node scripts/dry-run-sql.mjs scripts/zh-translations-fill.sql
 *
 * Note: the .sql file may contain its own BEGIN/COMMIT — we strip them
 * so our outer rollback wins.
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
  console.error('Usage: node scripts/dry-run-sql.mjs <path-to-sql>')
  process.exit(1)
}

let sql = readFileSync(path.join(root, file), 'utf8')
// Strip an outer BEGIN/COMMIT pair so we control the transaction.
sql = sql.replace(/^\s*BEGIN\s*;\s*$/gim, '').replace(/^\s*COMMIT\s*;\s*$/gim, '')

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  await client.query('BEGIN')
  await client.query(sql)
  await client.query('ROLLBACK')
  console.log(`✓ DRY-RUN PASSED — ${file} executed cleanly inside transaction. Rolled back.`)
} catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error(`✗ DRY-RUN FAILED — ${file}`)
  console.error(err.message)
  if (err.position) console.error(`  position: ${err.position}`)
  if (err.detail) console.error(`  detail: ${err.detail}`)
  process.exit(1)
} finally {
  await client.end()
}
