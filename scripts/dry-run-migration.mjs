#!/usr/bin/env node
/**
 * Dry-run a migration: BEGIN, run the up SQL, then ROLLBACK.
 * Tells you whether the SQL parses + executes cleanly without committing.
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

const migrationName = process.argv[2]
if (!migrationName) {
  console.error('Usage: node scripts/dry-run-migration.mjs <migration-name>')
  process.exit(2)
}

const tsPath = path.join(root, 'src', 'migrations', `${migrationName}.ts`)
const tsText = readFileSync(tsPath, 'utf8')
const upMatch = tsText.match(/export async function up[\s\S]*?await db\.execute\(sql`([\s\S]*?)`\)/)
if (!upMatch) {
  console.error(`Could not extract SQL`)
  process.exit(2)
}
const upSql = upMatch[1]

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

console.log(`▸ Dry-running ${migrationName}`)
console.log(`  SQL length: ${upSql.length} chars`)

try {
  await client.query('BEGIN')
  await client.query(upSql)
  // Rollback so nothing persists
  await client.query('ROLLBACK')
  console.log(`✓ DRY-RUN PASSED — SQL executed cleanly inside transaction. Rolled back, no changes persisted.`)
} catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error(`✗ DRY-RUN FAILED:`)
  console.error(`  ${err.message}`)
  if (err.detail) console.error(`  detail: ${err.detail}`)
  if (err.hint) console.error(`  hint: ${err.hint}`)
  if (err.position) console.error(`  position: ${err.position}`)
  process.exit(1)
} finally {
  await client.end()
}
