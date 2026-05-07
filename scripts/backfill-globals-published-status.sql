-- Backfill _status='published' on globals after enabling versions: { drafts: true }.
--
-- Why: when Drizzle pushed the new `_status` enum column, existing rows landed
-- with the enum's first value ('draft'). Payload then saw no published version,
-- so the editor's "Save Draft" was leaking straight to the live record (the
-- public marketing site reads the main table). Pages had _status='published'
-- because it pre-existed the versions feature being added there; for globals,
-- versions were just enabled, so we backfill manually.
--
-- Idempotent: only updates rows still at 'draft'. Editors who later genuinely
-- save a fresh draft (creating a row in _<slug>_v) won't have their main
-- record clobbered by re-running this; the main row stays 'published' and
-- only the _v row carries the draft.
--
-- Effect after running:
--   • Public site reads find the published main record -> renders unchanged.
--   • New "Save Draft" -> row appended to cms._<slug>_v with
--     version__status='draft'; main table untouched.
--   • Click "Publish" -> main table updated; new _v row with
--     version__status='published', latest=true.

UPDATE cms.nav_settings              SET _status = 'published' WHERE _status = 'draft';
UPDATE cms.footer_settings           SET _status = 'published' WHERE _status = 'draft';
UPDATE cms.weconnect_settings        SET _status = 'published' WHERE _status = 'draft';
UPDATE cms.requirement_form_settings SET _status = 'published' WHERE _status = 'draft';
UPDATE cms.offering_form_settings    SET _status = 'published' WHERE _status = 'draft';
UPDATE cms.contact_form_settings     SET _status = 'published' WHERE _status = 'draft';

-- platform_settings + site_settings currently have no rows; they'll be created
-- with the correct _status when an editor first saves them. No-op for now.
