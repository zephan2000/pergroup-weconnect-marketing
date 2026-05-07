-- ═══════════════════════════════════════════════════════════════════════════
-- VideoBlock — replace `autoplay` boolean with 3-mode `autoplay_mode` enum.
--
--   off       — viewer presses play (default)
--   onLoad    — autoplay on page render (legacy `autoplay=true` maps here)
--   onScroll  — autoplay when scrolled into view (new)
--
-- Backfill rule:
--   autoplay = true  → autoplay_mode = 'onLoad'
--   autoplay = false → autoplay_mode = 'off'
--
-- The legacy `autoplay` boolean column is kept for now (Phase 5b.5 pattern —
-- drop legacy columns only after stability). Component reads autoplay_mode
-- and falls back to the legacy boolean if the new column is missing.
--
-- Idempotent: enum creation guarded with DO/EXCEPTION, ADD COLUMN with
-- IF NOT EXISTS, UPDATE re-runnable.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 1. Enum type (idempotent guard).
DO $$ BEGIN
  CREATE TYPE cms.enum_pages_blocks_video_autoplay_mode AS ENUM ('off', 'onLoad', 'onScroll');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add column to live + version tables.
ALTER TABLE cms.pages_blocks_video
  ADD COLUMN IF NOT EXISTS autoplay_mode
    cms.enum_pages_blocks_video_autoplay_mode DEFAULT 'off' NOT NULL;

ALTER TABLE cms._pages_v_blocks_video
  ADD COLUMN IF NOT EXISTS autoplay_mode
    cms.enum_pages_blocks_video_autoplay_mode DEFAULT 'off' NOT NULL;

-- 3. Backfill from legacy `autoplay` boolean (only on rows still at default).
UPDATE cms.pages_blocks_video
SET autoplay_mode = CASE WHEN autoplay
                         THEN 'onLoad'::cms.enum_pages_blocks_video_autoplay_mode
                         ELSE 'off'::cms.enum_pages_blocks_video_autoplay_mode
                    END
WHERE autoplay_mode = 'off';

UPDATE cms._pages_v_blocks_video
SET autoplay_mode = CASE WHEN autoplay
                         THEN 'onLoad'::cms.enum_pages_blocks_video_autoplay_mode
                         ELSE 'off'::cms.enum_pages_blocks_video_autoplay_mode
                    END
WHERE autoplay_mode = 'off';

COMMIT;
