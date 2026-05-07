-- ═══════════════════════════════════════════════════════════════════════════
-- One-shot UX rename for the existing requirement-form-settings global EN row.
--
--   heading             : "Post a Requirement" → "Post a Need"
--   button_submit       : "Submit Requirement" → "Submit Need"
--   section_requirement : "Requirement Details" → "Need Details"
--
-- The slug, types, API contract, and DB schema are unchanged — only the
-- visible English copy editors and visitors see is updated to match the
-- "Need" terminology used elsewhere in the product.
--
-- Idempotent: each UPDATE has an exact-match WHERE on the OLD value, so
-- re-running is a no-op and editor customisations are preserved.
--
-- Dry-run:  node scripts/dry-run-sql.mjs scripts/rename-requirement-to-need.sql
-- Apply:    node scripts/apply-sql.mjs   scripts/rename-requirement-to-need.sql
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

UPDATE cms.requirement_form_settings_locales
   SET heading = 'Post a Need'
 WHERE _locale = 'en'
   AND heading = 'Post a Requirement';

UPDATE cms.requirement_form_settings_locales
   SET button_submit = 'Submit Need'
 WHERE _locale = 'en'
   AND button_submit = 'Submit Requirement';

UPDATE cms.requirement_form_settings_locales
   SET section_requirement = 'Need Details'
 WHERE _locale = 'en'
   AND section_requirement = 'Requirement Details';

COMMIT;
