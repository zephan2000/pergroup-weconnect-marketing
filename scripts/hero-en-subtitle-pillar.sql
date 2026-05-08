-- ═══════════════════════════════════════════════════════════════════════════
-- Set the EN hero subtitle to the brand pillar line.
--
-- ZH already had the pillar line as its subtitle (5b.2 seed); EN was NULL,
-- so the rendered EN hero had no pillar line at all. Standardising both
-- locales on the same field gives a single locale-aware brand line.
--
--   EN: "Tech Innovation · Business Empowerment · Human Care"
--   ZH: "科技创新 · 商业赋能 · 人文关怀"   (already set)
--
-- Idempotent — only updates the EN row when the field is still NULL,
-- preserving any editor customisations.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

UPDATE cms.pages_blocks_hero_locales
SET subtitle = 'Tech Innovation · Business Empowerment · Human Care'
WHERE _locale = 'en'
  AND _parent_id = '69b92ce6fe25505f1d64e646'
  AND subtitle IS NULL;

COMMIT;
