#!/usr/bin/env node
/**
 * Manual migration runner — bypasses the broken Payload CLI on Node v24 + tsx 4.21.
 *
 * Reads SQL from a migration .ts file (between the inner `sql\`...\`` template
 * literal in `up()`) and applies it to DATABASE_URL inside a transaction.
 * Records the migration name in cms.payload_migrations on success.
 *
 * Usage:
 *   node scripts/apply-migration.mjs <migration-name>
 * Example:
 *   node scripts/apply-migration.mjs 20260506_010000_phase5b2_globals_arrays
 *
 * Env: DATABASE_URL must be set (from .env.local or shell).
 *
 * Safety:
 *   - Wraps everything in BEGIN/COMMIT — any failure rolls back the whole batch.
 *   - Refuses to re-run a migration already recorded in cms.payload_migrations.
 *   - Logs the SQL it's about to run before applying.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

// Lazy-load .env.local
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env.local')
try {
  const envText = readFileSync(envPath, 'utf8')
  for (const line of envText.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) {
      let val = m[2]
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      process.env[m[1]] = val
    }
  }
} catch (e) {
  // .env.local absent — DATABASE_URL must come from shell
}

const migrationName = process.argv[2]
if (!migrationName) {
  console.error('Usage: node scripts/apply-migration.mjs <migration-name>')
  process.exit(2)
}

const tsPath = path.join(root, 'src', 'migrations', `${migrationName}.ts`)
const tsText = readFileSync(tsPath, 'utf8')

// Extract the SQL template literal from the `up()` function.
// Pattern: `await db.execute(sql\`...\`)`
const upMatch = tsText.match(/export async function up[\s\S]*?await db\.execute\(sql`([\s\S]*?)`\)/)
if (!upMatch) {
  console.error(`Could not extract SQL from ${tsPath}`)
  process.exit(2)
}
const upSql = upMatch[1]

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(2)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  // Idempotency check
  const existing = await client.query(
    `SELECT 1 FROM cms.payload_migrations WHERE name = $1`,
    [migrationName],
  )
  if (existing.rows.length > 0) {
    console.log(`✓ Migration "${migrationName}" already recorded — skipping.`)
    await client.end()
    process.exit(0)
  }

  console.log(`▸ Applying migration: ${migrationName}`)
  console.log(`  Total SQL length: ${upSql.length} chars`)
  console.log()

  await client.query('BEGIN')
  await client.query(upSql)

  // Record in payload_migrations table
  await client.query(
    `INSERT INTO cms.payload_migrations (name, batch, updated_at, created_at)
     VALUES ($1, COALESCE((SELECT MAX(batch) FROM cms.payload_migrations), 0) + 1, now(), now())`,
    [migrationName],
  )

  await client.query('COMMIT')
  console.log(`✓ Migration "${migrationName}" applied and recorded.`)
} catch (err) {
  await client.query('ROLLBACK')
  console.error(`✗ Migration failed — rolled back:`)
  console.error(err.message)
  if (err.detail) console.error(`  detail: ${err.detail}`)
  if (err.hint) console.error(`  hint: ${err.hint}`)
  if (err.position) console.error(`  position: ${err.position}`)
  process.exit(1)
} finally {
  await client.end()
}
