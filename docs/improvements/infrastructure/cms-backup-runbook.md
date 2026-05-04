# CMS Backup & Restore Runbook

**Audience:** anyone (owner or future agent) preparing to run a Payload schema migration that touches existing CMS data.

**Goal:** zero CMS data loss across migrations. We always take an in-database backup before any destructive schema change, and we have a tested restore path.

---

## When to take a backup

**Required:**
- Before any Payload migration that adds `localized: true` to existing fields
- Before any migration that drops or renames columns
- Before any `npx payload migrate` run against production
- Before any `DROP TABLE`, `ALTER TABLE ... DROP COLUMN`, or `RENAME` operation on the `cms` schema

**Recommended (not required):**
- Before adding new Payload collections or blocks (additive changes are usually safe but a backup is cheap insurance)
- Weekly, as part of a maintenance routine

## Backup naming convention

`cms_backup_YYYYMMDD` — one backup per day at most. If multiple are needed in a day, append `_HHMM`: `cms_backup_20260504_1430`.

Drop backups older than 30 days unless they are tied to a specific incident.

---

## How to take a backup

### Option A — In-database clone (fastest, recommended for routine pre-migration backups)

Open Supabase Dashboard → SQL Editor → New query, paste the script below, click **Run**.

**Adjust the schema name (`cms_backup_YYYYMMDD`) to today's date before running.**

```sql
-- ═════════════════════════════════════════════════════════════════
-- Backup: clone cms schema → cms_backup_YYYYMMDD (same database)
-- Replace YYYYMMDD with today's date.
-- ═════════════════════════════════════════════════════════════════

-- 1. Drop any prior backup with the same name (safe — only removes the
--    backup schema, never touches live cms). Comment out to keep multiple.
DROP SCHEMA IF EXISTS cms_backup_YYYYMMDD CASCADE;

-- 2. Create the backup schema
CREATE SCHEMA cms_backup_YYYYMMDD;

-- 3. Clone every table (structure + indexes + defaults; foreign keys excluded
--    since they're not needed for a backup and would conflict with cross-schema refs)
DO $$
DECLARE
  tbl text;
  cnt bigint;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'cms'
    ORDER BY tablename
  LOOP
    EXECUTE format(
      'CREATE TABLE cms_backup_YYYYMMDD.%I (LIKE cms.%I INCLUDING ALL EXCLUDING CONSTRAINTS)',
      tbl, tbl
    );
    EXECUTE format(
      'INSERT INTO cms_backup_YYYYMMDD.%I SELECT * FROM cms.%I',
      tbl, tbl
    );
    EXECUTE format('SELECT COUNT(*) FROM cms_backup_YYYYMMDD.%I', tbl) INTO cnt;
    RAISE NOTICE '✓ %: % rows', tbl, cnt;
  END LOOP;
END $$;

-- 4. Verification — every row should show ✓ in the status column
SELECT
  o.table_name,
  (xpath('/row/c/text()', query_to_xml(format('SELECT COUNT(*) AS c FROM cms.%I', o.table_name), false, true, '')))[1]::text::int AS original,
  (xpath('/row/c/text()', query_to_xml(format('SELECT COUNT(*) AS c FROM cms_backup_YYYYMMDD.%I', o.table_name), false, true, '')))[1]::text::int AS backup,
  CASE
    WHEN (xpath('/row/c/text()', query_to_xml(format('SELECT COUNT(*) AS c FROM cms.%I', o.table_name), false, true, '')))[1]::text::int
       = (xpath('/row/c/text()', query_to_xml(format('SELECT COUNT(*) AS c FROM cms_backup_YYYYMMDD.%I', o.table_name), false, true, '')))[1]::text::int
    THEN '✓'
    ELSE '✗ MISMATCH'
  END AS status
FROM information_schema.tables o
WHERE o.table_schema = 'cms'
  AND o.table_type = 'BASE TABLE'
ORDER BY o.table_name;
```

**What you should see:**
- `NOTICE ✓ pages: 1 rows`, `NOTICE ✓ pages_blocks_hero: 18 rows`, etc. (one per table)
- A verification table at the end. Every row's `status` column must be `✓`. Any `✗ MISMATCH` means the backup is incomplete — DO NOT proceed with the migration until investigated.

**Caveat:** this backup lives **in the same database**. If the entire Supabase project becomes unavailable, the backup is unavailable too. For ironclad safety on a major migration, also take Option B in addition.

### Option B — pg_dump to a local file (off-site backup)

Run from project root in your terminal:

```bash
mkdir -p backups
pg_dump \
  "$(grep ^DATABASE_URL .env.local | cut -d= -f2-)" \
  --schema=cms \
  --no-owner \
  --no-privileges \
  --file=backups/cms-$(date +%Y%m%d-%H%M%S).sql

ls -lh backups/
```

The `.sql` file contains every CREATE TABLE / INSERT / ALTER for the entire `cms` schema. Keep it somewhere safe (not in git — `backups/` is in `.gitignore`).

To restore from this file see "Restore — Option B" below.

**Caveat:** requires `pg_dump` installed locally. macOS: `brew install postgresql@16`.

### Option C — Supabase dashboard backup

Supabase Dashboard → Database → Backups → Create on-demand backup. Available on Pro plan and above. Easiest for non-technical operators but the backup is managed by Supabase, not directly accessible as a SQL file.

---

## How to restore

**Only run the restore path if you confirm a migration corrupted data.** Quick check before deciding:
- Open `/admin` and view a page in Payload — does the data look right?
- Run `SELECT id, headline FROM cms.pages_blocks_hero LIMIT 5;` — do values match what you remember?

If yes → don't restore, just keep moving.

If no → use one of these:

### Restore — Option A (from in-database clone)

⚠ This is destructive to the current `cms` schema. Make absolutely sure the backup is the right state to restore to.

```sql
-- Replace YYYYMMDD with the backup you want to restore
DROP SCHEMA cms CASCADE;
ALTER SCHEMA cms_backup_YYYYMMDD RENAME TO cms;
```

After running:
1. **Trigger a Vercel redeploy** — cached database connections may hold stale schema metadata
2. Verify: open `/admin`, confirm pages list and editor renders
3. The `payload_migrations` tracking table goes back to its pre-migration state (it's part of the `cms` schema), so re-running migrations will start fresh

### Restore — Option B (from pg_dump file)

```bash
# Connect to the database and replace the cms schema with the dump
psql "$(grep ^DATABASE_URL .env.local | cut -d= -f2-)" \
  -c "DROP SCHEMA IF EXISTS cms CASCADE;" \
  -f backups/cms-YYYYMMDD-HHMMSS.sql
```

Then trigger a Vercel redeploy.

### Restore — Option C (from Supabase dashboard backup)

Supabase Dashboard → Database → Backups → click the backup → Restore. Affects the **entire database**, not just `cms`. This is heavy-handed — it will also overwrite `weconnect` tables that have been updated since the backup. Use only as a last resort.

---

## Cleanup

After a migration has run on production for **at least 48 hours** with no issues:

```sql
-- Drop the in-database backup once you're confident
DROP SCHEMA cms_backup_YYYYMMDD CASCADE;
```

Off-site `pg_dump` files: keep for 30 days, then delete.

---

## What's in the backup vs what isn't

| Captured | Not captured |
|---|---|
| All `cms.*` tables (structure + data + indexes + defaults) | `weconnect.*` tables (intact, no risk) |
| All Payload collections, blocks, globals | Foreign key constraints (recreated on schema-rename restore) |
| All page versions (`_v_*` tables) | Triggers, materialized views (Payload uses none AFAIK) |
| Drafts, publishedAt timestamps | Supabase auth tables (separate schema) |

The `weconnect` schema is deliberately excluded — its data is independent and not affected by Payload migrations.

---

## Migration runbook (the wider workflow)

A full Payload migration that requires a backup looks like this:

1. **Pre-flight**
   - [ ] Take backup using Option A (in-DB clone)
   - [ ] Verify all rows show `✓` in the verification output
   - [ ] (Major migration only) Take Option B (off-site pg_dump) too
   - [ ] Note the backup schema name in the migration plan / commit message

2. **Migration**
   - [ ] Set `push: false` in postgres adapter (if not already)
   - [ ] Run `npx payload migrate:create <name>` — generates a starter migration file
   - [ ] Hand-edit the migration to add data-preservation steps BEFORE any DROP COLUMN
   - [ ] Test on a clone (Supabase database branch if available, or local Postgres) — never on prod first
   - [ ] Commit migration file + supporting code changes

3. **Production deploy**
   - [ ] Run `npx payload migrate` against production (locally with prod DATABASE_URL, OR via Vercel build hook)
   - [ ] Wait for completion — log shows ✓ for each migration step
   - [ ] Verify in `/admin`: pages render, fields editable, locale switcher works (if applicable)
   - [ ] Verify on public site: home page renders, no console errors

4. **Post-migration**
   - [ ] Monitor for 48 hours
   - [ ] Drop the backup schema once confirmed stable

---

## Backup history

Active backups currently in the database:

| Backup schema | Date taken | Reason | Drop after |
|---|---|---|---|
| `cms_backup_20260504` | 2026-05-04 | Pre-Phase-5 localization migration. 46 tables, 1,254 rows verified ✓. | 2026-05-08 (48h post Phase 5 verified stable) or as long as needed |

Append a row each time a new backup is taken. Update "Drop after" once the migration is confirmed stable.

## Quick reference

| Task | Command / Action |
|---|---|
| Take in-DB backup | Run "Option A" SQL in Supabase SQL Editor |
| Verify backup | Check that the verification table shows ✓ for all rows |
| Restore from in-DB backup | `DROP SCHEMA cms CASCADE; ALTER SCHEMA cms_backup_YYYYMMDD RENAME TO cms;` |
| Drop old backup | `DROP SCHEMA cms_backup_YYYYMMDD CASCADE;` |
| Off-site backup | `pg_dump ... --schema=cms --file=backups/cms-$(date +%Y%m%d-%H%M%S).sql` |
| Restore from off-site | `psql ... -f backups/cms-YYYYMMDD.sql` |
