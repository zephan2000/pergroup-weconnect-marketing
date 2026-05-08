-- Backfill missing EN locale rows for required+localized array fields.
--
-- Why: Phase 5b.2 moved hardcoded arrays (About milestones, Clients
-- partner_types, Clients regions) from React JSX into the CMS, but only
-- the ZH locale was inserted into the *_locales tables. The schema
-- declares title/name as `required: true, localized: true`, so when a
-- recent draft tries to publish, validation rejects 14 fields:
--   • 4× Block 3 (About) → Timeline Milestones → Title
--   • 6× Block 6 (Clients) → Regional Presence → Region Name
--   • 4× Block 6 (Clients) → Partner Types → Title
--
-- This script INSERTs the matching EN row for every array item that has
-- a ZH row but no EN row, mapping by the existing ZH title/name to the
-- original English string from the pre-5b.2 hardcoded arrays
-- (recovered from git: src/components/blocks/{AboutBlock,ClientsBlock}.tsx
-- before commit e318a71).
--
-- Both the live tables and the _pages_v_* version snapshots are covered,
-- so the user can publish their current draft AND every historical version
-- row stays valid for any "Restore" attempts.
--
-- Idempotent: each INSERT is guarded with NOT EXISTS — re-running won't
-- duplicate rows. EN strings can be edited in admin afterwards without
-- being clobbered.
--
-- Mapping reference (ZH → EN):
--   Milestones:
--     新加坡成立              → Founded in Singapore
--     拓展至20+国家           → Expanded to 20+ countries
--     E-Harbor 生态平台启动   → E-Harbor ecosystem launched
--     WeConnect 智能平台上线  → WeConnect AI platform
--   Partner Types:
--     政府与贸易机构 → Government & Trade Bodies
--     行业协会       → Industry Associations
--     专业服务       → Professional Services
--     创新生态       → Innovation Ecosystem
--   Regions:
--     东南亚 → Southeast Asia    欧洲   → Europe
--     北美   → North America     中东   → Middle East
--     非洲   → Africa             大洋洲 → Oceania

BEGIN;

-- ── Helper: emit one EN row per ZH parent that lacks an EN sibling ──

-- 1. About milestones: title only ----------------------------------------
INSERT INTO cms.pages_blocks_about_milestones_locales (_parent_id, _locale, title)
SELECT z._parent_id, 'en',
  CASE z.title
    WHEN '新加坡成立'              THEN 'Founded in Singapore'
    WHEN '拓展至20+国家'           THEN 'Expanded to 20+ countries'
    WHEN 'E-Harbor 生态平台启动'   THEN 'E-Harbor ecosystem launched'
    WHEN 'WeConnect 智能平台上线'  THEN 'WeConnect AI platform'
  END
FROM cms.pages_blocks_about_milestones_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms.pages_blocks_about_milestones_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

INSERT INTO cms._pages_v_blocks_about_milestones_locales (_parent_id, _locale, title)
SELECT z._parent_id, 'en',
  CASE z.title
    WHEN '新加坡成立'              THEN 'Founded in Singapore'
    WHEN '拓展至20+国家'           THEN 'Expanded to 20+ countries'
    WHEN 'E-Harbor 生态平台启动'   THEN 'E-Harbor ecosystem launched'
    WHEN 'WeConnect 智能平台上线'  THEN 'WeConnect AI platform'
  END
FROM cms._pages_v_blocks_about_milestones_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms._pages_v_blocks_about_milestones_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

-- 2. Clients partner_types: title + examples -----------------------------
INSERT INTO cms.pages_blocks_clients_partner_types_locales (_parent_id, _locale, title, examples)
SELECT z._parent_id, 'en',
  CASE z.title
    WHEN '政府与贸易机构' THEN 'Government & Trade Bodies'
    WHEN '行业协会'       THEN 'Industry Associations'
    WHEN '专业服务'       THEN 'Professional Services'
    WHEN '创新生态'       THEN 'Innovation Ecosystem'
  END,
  CASE z.title
    WHEN '政府与贸易机构' THEN 'Singapore EDB, Enterprise SG, CCPIT, regional chambers of commerce'
    WHEN '行业协会'       THEN 'Manufacturing alliances, tech clusters, innovation parks across 53+ countries'
    WHEN '专业服务'       THEN 'Legal, accounting, IP, compliance, and ESG advisory firms — vetted and verified'
    WHEN '创新生态'       THEN 'Universities, R&D labs, accelerators, venture funds, and technology transfer offices'
  END
FROM cms.pages_blocks_clients_partner_types_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms.pages_blocks_clients_partner_types_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

INSERT INTO cms._pages_v_blocks_clients_partner_types_locales (_parent_id, _locale, title, examples)
SELECT z._parent_id, 'en',
  CASE z.title
    WHEN '政府与贸易机构' THEN 'Government & Trade Bodies'
    WHEN '行业协会'       THEN 'Industry Associations'
    WHEN '专业服务'       THEN 'Professional Services'
    WHEN '创新生态'       THEN 'Innovation Ecosystem'
  END,
  CASE z.title
    WHEN '政府与贸易机构' THEN 'Singapore EDB, Enterprise SG, CCPIT, regional chambers of commerce'
    WHEN '行业协会'       THEN 'Manufacturing alliances, tech clusters, innovation parks across 53+ countries'
    WHEN '专业服务'       THEN 'Legal, accounting, IP, compliance, and ESG advisory firms — vetted and verified'
    WHEN '创新生态'       THEN 'Universities, R&D labs, accelerators, venture funds, and technology transfer offices'
  END
FROM cms._pages_v_blocks_clients_partner_types_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms._pages_v_blocks_clients_partner_types_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

-- 3. Clients regions: name only ------------------------------------------
INSERT INTO cms.pages_blocks_clients_regions_locales (_parent_id, _locale, name)
SELECT z._parent_id, 'en',
  CASE z.name
    WHEN '东南亚' THEN 'Southeast Asia'
    WHEN '欧洲'   THEN 'Europe'
    WHEN '北美'   THEN 'North America'
    WHEN '中东'   THEN 'Middle East'
    WHEN '非洲'   THEN 'Africa'
    WHEN '大洋洲' THEN 'Oceania'
  END
FROM cms.pages_blocks_clients_regions_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms.pages_blocks_clients_regions_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

INSERT INTO cms._pages_v_blocks_clients_regions_locales (_parent_id, _locale, name)
SELECT z._parent_id, 'en',
  CASE z.name
    WHEN '东南亚' THEN 'Southeast Asia'
    WHEN '欧洲'   THEN 'Europe'
    WHEN '北美'   THEN 'North America'
    WHEN '中东'   THEN 'Middle East'
    WHEN '非洲'   THEN 'Africa'
    WHEN '大洋洲' THEN 'Oceania'
  END
FROM cms._pages_v_blocks_clients_regions_locales z
WHERE z._locale = 'zh'
  AND NOT EXISTS (
    SELECT 1 FROM cms._pages_v_blocks_clients_regions_locales x
    WHERE x._parent_id = z._parent_id AND x._locale = 'en'
  );

COMMIT;
