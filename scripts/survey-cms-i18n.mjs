#!/usr/bin/env node
/**
 * Phase 5b.4 prep — survey every cms.*_locales table.
 *
 * Reports, per locale table:
 *   - per-locale row counts (en vs zh)
 *   - per-text-column: EN value, ZH value, and whether the EN value contains
 *     mixed-locale content (has both Latin alpha + Chinese chars)
 *
 * Skips _pages_v_* version tables (they mirror the live ones).
 * Output: pretty text table to stdout, plus a JSON dump to scripts/_cms-i18n-survey.json.
 */
import { readFileSync, writeFileSync } from 'node:fs'
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

// 1. Find every *_locales table in cms (excluding _pages_v_* version tables).
const tablesRes = await client.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'cms'
    AND table_name LIKE '%_locales'
    AND table_name NOT LIKE '_pages_v_%'
  ORDER BY table_name
`)
const tables = tablesRes.rows.map((r) => r.table_name)

const report = []

for (const table of tables) {
  const colsRes = await client.query(
    `SELECT column_name, data_type
     FROM information_schema.columns
     WHERE table_schema='cms' AND table_name=$1
     ORDER BY ordinal_position`,
    [table],
  )
  const cols = colsRes.rows
  const textCols = cols
    .filter((c) => c.data_type === 'text' || c.data_type === 'character varying')
    .map((c) => c.column_name)
    .filter((c) => !['_locale', '_parent_id', 'id', '_uuid', '_path'].includes(c))

  if (textCols.length === 0) continue

  // Per-locale row count
  const localeCountRes = await client.query(
    `SELECT _locale, COUNT(*)::int AS n FROM cms.${table} GROUP BY _locale ORDER BY _locale`,
  )
  const localeCounts = Object.fromEntries(localeCountRes.rows.map((r) => [r._locale, r.n]))

  // Pull all rows
  const colList = ['_locale', '_parent_id', ...textCols].map((c) => `"${c}"`).join(', ')
  const rowsRes = await client.query(`SELECT ${colList} FROM cms.${table}`)
  const rows = rowsRes.rows

  // Group by parent_id
  const byParent = new Map()
  for (const row of rows) {
    if (!byParent.has(row._parent_id)) byParent.set(row._parent_id, {})
    byParent.get(row._parent_id)[row._locale] = row
  }

  const fields = []
  for (const col of textCols) {
    const issues = { missingZh: 0, mixedLocaleEn: 0, sample: null }
    for (const [, locales] of byParent) {
      const en = locales.en?.[col]
      const zh = locales.zh?.[col]
      const enHasLatin = en && /[A-Za-z]/.test(en)
      const enHasChinese = en && /[一-鿿]/.test(en)
      const isMixed = enHasLatin && enHasChinese
      const zhMissing = (en && !zh) || (en && zh === en)
      if (zhMissing) issues.missingZh++
      if (isMixed) issues.mixedLocaleEn++
      if (!issues.sample && (zhMissing || isMixed)) {
        issues.sample = { en, zh, mixed: isMixed, missingZh: zhMissing }
      }
    }
    if (issues.missingZh > 0 || issues.mixedLocaleEn > 0) {
      fields.push({ col, ...issues })
    }
  }

  if (fields.length > 0) {
    report.push({ table, localeCounts, fields })
  }
}

writeFileSync(path.join(root, 'scripts/_cms-i18n-survey.json'), JSON.stringify(report, null, 2))

// Pretty-print
console.log(`\nSurvey complete — ${report.length} tables have ZH-missing or mixed-locale fields.\n`)
for (const t of report) {
  const counts = Object.entries(t.localeCounts).map(([l, n]) => `${l}=${n}`).join(', ')
  console.log(`▸ ${t.table}  (${counts})`)
  for (const f of t.fields) {
    const tags = []
    if (f.missingZh > 0) tags.push(`missingZh=${f.missingZh}`)
    if (f.mixedLocaleEn > 0) tags.push(`mixedLocaleEn=${f.mixedLocaleEn}`)
    console.log(`    ${f.col}: ${tags.join(', ')}`)
    if (f.sample) {
      const enS = f.sample.en?.slice(0, 80) ?? ''
      const zhS = f.sample.zh?.slice(0, 80) ?? '(empty)'
      console.log(`      EN: ${enS}`)
      console.log(`      ZH: ${zhS}`)
    }
  }
}

await client.end()
