-- ═══════════════════════════════════════════════════════════════════════════
-- Phase 5b.4 — ZH translation fill + mixed-locale string split
--
-- Two operations per field:
--   1. UPDATE en rows that contain mixed-locale strings (e.g.
--      "Who We Are · 我们是谁") → strip the Chinese half so the EN locale
--      renders pure English.
--   2. INSERT ON CONFLICT DO UPDATE the matching zh row with the proper
--      Chinese translation.
--
-- All statements are idempotent. Safe to re-run.
--
-- Order matters where parent tables must exist before _locales — the rows
-- already exist (from Phase 5b.2 + 5b migrations); we only fill text columns.
--
-- AUDITING:
--   • Every block grouped by source (Hero, About, Services, Values, Platform).
--   • Each entry has an EN-comment showing the source string + chosen ZH.
--   • Owner reviews translations + edits this file in place before run.
--
-- BACKUP:
--   • Updates are scoped to text columns, but a backup is cheap insurance.
--   • See docs/improvements/infrastructure/cms-backup-runbook.md.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. HERO BLOCK (pages_blocks_hero_locales)
--    Single parent: 69b92ce6fe25505f1d64e646
-- ─────────────────────────────────────────────────────────────────────────

-- Split mixed-locale eyebrow on EN side; fill ZH versions of the 3-line
-- headline + the eyebrow.
UPDATE cms.pages_blocks_hero_locales
   SET eyebrow = 'Global Tech Innovation Ecosystem'
 WHERE _locale = 'en'
   AND eyebrow = 'Global Tech Innovation Ecosystem · 全球科技创新生态平台';

INSERT INTO cms.pages_blocks_hero_locales (_locale, _parent_id, eyebrow, headline, headline_accent, headline_faint)
VALUES
  -- EN source: "Make Innovation" / "Open to Anyone," / "Anywhere."
  -- ZH chosen to fit the same 3-line visual rhythm.
  ('zh', '69b92ce6fe25505f1d64e646',
   '全球科技创新生态平台',
   '让创新',
   '对每一个人开放，',
   '任何地方。')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET eyebrow         = EXCLUDED.eyebrow,
       headline        = EXCLUDED.headline,
       headline_accent = EXCLUDED.headline_accent,
       headline_faint  = EXCLUDED.headline_faint;

-- ── Hero CTA buttons ────────────────────────────────────────────────────
-- "Discover More"      → 了解更多
-- "WeConnect Platform →" → WeConnect 平台 →   (brand kept)
INSERT INTO cms.pages_blocks_hero_cta_buttons_locales (_locale, _parent_id, label) VALUES
  ('zh', '69b92ce6fe25505f1d64e644', '了解更多'),
  ('zh', '69b92ce6fe25505f1d64e645', 'WeConnect 平台 →')
ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. ABOUT BLOCK (pages_blocks_about_locales + advantages)
-- ─────────────────────────────────────────────────────────────────────────

-- Split section_label
UPDATE cms.pages_blocks_about_locales
   SET section_label = 'Who We Are'
 WHERE _locale = 'en' AND section_label = 'Who We Are · 我们是谁';

-- ZH parent locale row for AboutBlock (parent id confirmed: …e658)
INSERT INTO cms.pages_blocks_about_locales (_locale, _parent_id, section_label, headline, headline_accent, globe_stat_label)
VALUES
  -- EN: "A Network Built on" / "Genuine Trust" / globe label "COUNTRIES"
  ('zh', '69b92ce6fe25505f1d64e658',
   '我们是谁',
   '建立在真诚信任之上的',
   '全球网络',
   '国家')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET section_label    = EXCLUDED.section_label,
       headline         = EXCLUDED.headline,
       headline_accent  = EXCLUDED.headline_accent,
       globe_stat_label = EXCLUDED.globe_stat_label;

-- ── About advantages (4 cards) ──────────────────────────────────────────
-- The EN row's `description` column currently holds Chinese. Move it into
-- the ZH locale's `title`, then clear the EN description (or replace with
-- short EN supplementary line — owner can edit).

UPDATE cms.pages_blocks_about_advantages_locales SET description = NULL
 WHERE _locale = 'en';

INSERT INTO cms.pages_blocks_about_advantages_locales (_locale, _parent_id, title, description) VALUES
  -- 🔭 Multi-Dimensional Global View
  ('zh', '69b92ce6fe25505f1d64e654', '多维度全球视野', NULL),
  -- 🌐 Bicultural Service Network
  ('zh', '69b92ce6fe25505f1d64e655', '双文化服务网络', NULL),
  -- 🛡️ Ethics & Compliance
  ('zh', '69b92ce6fe25505f1d64e656', '操守合规 · 高透明度', NULL),
  -- 🤝 Full-Journey Support
  ('zh', '69b92ce6fe25505f1d64e657', '全程陪伴', NULL)
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET title       = EXCLUDED.title,
       description = EXCLUDED.description;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. SERVICES BLOCK (pages_blocks_services_locales + items)
-- ─────────────────────────────────────────────────────────────────────────

-- Split section_label
UPDATE cms.pages_blocks_services_locales
   SET section_label = 'What We Do'
 WHERE _locale = 'en' AND section_label = 'What We Do · 服务内容';

-- ZH parent locale for ServicesBlock (subtitle was set in 5b.2 patch; we
-- now also fill section_label / headline / headline_accent)
INSERT INTO cms.pages_blocks_services_locales (_locale, _parent_id, section_label, headline, headline_accent, subtitle)
VALUES
  -- ServicesBlock parent id: …e65f
  ('zh', '69b92ce6fe25505f1d64e65f',
   '服务内容',
   '全方位',
   '全球化服务',
   '全方位全球化服务')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET section_label    = EXCLUDED.section_label,
       headline         = EXCLUDED.headline,
       headline_accent  = EXCLUDED.headline_accent,
       subtitle         = EXCLUDED.subtitle;

-- ── Service item descriptions (6 ZH translations) ───────────────────────
INSERT INTO cms.pages_blocks_services_services_locales (_locale, _parent_id, title, description) VALUES
  -- 01 Market Intelligence (chinese_title legacy: 洞悉环境 · 商业设计)
  ('zh', '69b92ce6fe25505f1d64e659', '洞悉环境 · 商业设计',
   '行业分析、竞品对标、供应链情报与商业方案设计。'),
  -- 02 Location & Setup (chinese_title legacy: 选址服务 · 企业落地)
  ('zh', '69b92ce6fe25505f1d64e65a', '选址服务 · 企业落地',
   '在53+国家提供办公室、实验室与工厂选址。注册、银行开户、合规落地。'),
  -- 03 Operations & HR (运营实施 · 人力资源)
  ('zh', '69b92ce6fe25505f1d64e65b', '运营实施 · 人力资源',
   '项目管理、人才招聘、国际贸易、财税、供应链本地化。'),
  -- 04 IP, Standards & Compliance (知识产权 · 标准合规)
  ('zh', '69b92ce6fe25505f1d64e65c', '知识产权 · 标准合规',
   'CE、FDA、ISO、HSA认证。数据跨境与AI治理合规方案。'),
  -- 05 Green & ESG (绿色动力 · 双碳平台)
  ('zh', '69b92ce6fe25505f1d64e65d', '绿色动力 · 双碳平台',
   '双碳绿能联盟。能源审计、碳中和方案、ESG报告。'),
  -- 06 Innovation & Acceleration (科技创新 · 全球加速器)
  ('zh', '69b92ce6fe25505f1d64e65e', '科技创新 · 全球加速器',
   'AI+制造、数字医疗、机器人项目。孵化器对接全球加速器。')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET title       = EXCLUDED.title,
       description = EXCLUDED.description;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. VALUES BLOCK (pages_blocks_values_locales + items + mottos)
-- ─────────────────────────────────────────────────────────────────────────

-- Split section_label
UPDATE cms.pages_blocks_values_locales
   SET section_label = 'Our Philosophy'
 WHERE _locale = 'en' AND section_label = 'Our Philosophy · 我们的哲学';

-- ZH parent locale row exists already (en=1, zh=1) — UPDATE to ensure correct value
UPDATE cms.pages_blocks_values_locales
   SET section_label = '我们的哲学'
 WHERE _locale = 'zh';

-- ── Four Harmonies items (ZH "english" = Chinese meaning) ───────────────
-- Each item already has a `chinese` brand char in the parent row (e.g. 心).
-- The localized "english" field shows the meaning in the current locale.
INSERT INTO cms.pages_blocks_values_four_harmonies_items_locales (_locale, _parent_id, english) VALUES
  ('zh', '69b92ce6fe25505f1d64e647', '心灵的觉醒'),     -- Awakening Heart
  ('zh', '69b92ce6fe25505f1d64e648', '社会的和谐'),     -- Harmonious Society
  ('zh', '69b92ce6fe25505f1d64e649', '家庭的和睦'),     -- Amicable Family
  ('zh', '69b92ce6fe25505f1d64e64a', '世界的和平')      -- Peaceful World
ON CONFLICT (_locale, _parent_id) DO UPDATE SET english = EXCLUDED.english;

-- ── Five Unities items ──────────────────────────────────────────────────
INSERT INTO cms.pages_blocks_values_five_unities_items_locales (_locale, _parent_id, english) VALUES
  ('zh', '69b92ce6fe25505f1d64e64b', '易（变易）'),     -- Changes
  ('zh', '69b92ce6fe25505f1d64e64c', '医（康养）'),     -- Healthy
  ('zh', '69b92ce6fe25505f1d64e64d', '爱'),              -- Love
  ('zh', '69b92ce6fe25505f1d64e64e', '艺（艺术）'),     -- Art
  ('zh', '69b92ce6fe25505f1d64e64f', '义（道义）')      -- Morality
ON CONFLICT (_locale, _parent_id) DO UPDATE SET english = EXCLUDED.english;

-- ── Mottos (3) — split EN labels, fill ZH ───────────────────────────────
UPDATE cms.pages_blocks_values_mottos_locales SET label = 'VALUES'
 WHERE _locale = 'en' AND label = 'VALUES · 价值观';
UPDATE cms.pages_blocks_values_mottos_locales SET label = 'VISION'
 WHERE _locale = 'en' AND label = 'VISION · 愿景';
UPDATE cms.pages_blocks_values_mottos_locales SET label = 'MISSION'
 WHERE _locale = 'en' AND label = 'MISSION · 使命';

-- For ZH: label is the Chinese label, "english" field holds the rendered
-- Chinese motto (matches the `chinese` parent column).
INSERT INTO cms.pages_blocks_values_mottos_locales (_locale, _parent_id, label, english) VALUES
  ('zh', '69b92ce6fe25505f1d64e650', '价值观', '喜乐，和平，公义'),
  ('zh', '69b92ce6fe25505f1d64e651', '愿景',  '以商载道，共创共生'),
  ('zh', '69b92ce6fe25505f1d64e652', '使命',  E'商业最集中的地方\n也是善意最集中的地方')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET label   = EXCLUDED.label,
       english = EXCLUDED.english;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. PLATFORM TEASER BLOCK (pages_blocks_platform_teaser_locales + features)
-- ─────────────────────────────────────────────────────────────────────────

-- Split section_label
UPDATE cms.pages_blocks_platform_teaser_locales
   SET section_label = 'New Platform'
 WHERE _locale = 'en' AND section_label = 'New Platform · 全新平台';

-- ZH parent row (parent id: …e663)
INSERT INTO cms.pages_blocks_platform_teaser_locales (_locale, _parent_id, section_label, headline, headline_accent, launch_cta_label)
VALUES
  ('zh', '69b92ce6fe25505f1d64e663',
   '全新平台',
   'WeConnect —',
   '全球供需对接平台',
   '进入 WeConnect 平台 →')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET section_label    = EXCLUDED.section_label,
       headline         = EXCLUDED.headline,
       headline_accent  = EXCLUDED.headline_accent,
       launch_cta_label = EXCLUDED.launch_cta_label;

-- ── Platform teaser features (3) — split EN, fill ZH ────────────────────
UPDATE cms.pages_blocks_platform_teaser_features_locales SET title = 'Spaces — Offices, Labs, Factories'
 WHERE _locale = 'en' AND title = 'Spaces — Offices, Labs, Factories · 办公室/实验室/厂房';
UPDATE cms.pages_blocks_platform_teaser_features_locales SET title = 'Funding & Investment'
 WHERE _locale = 'en' AND title = 'Funding & Investment · 融资对接';
UPDATE cms.pages_blocks_platform_teaser_features_locales SET title = 'AI Intelligent Matching'
 WHERE _locale = 'en' AND title = 'AI Intelligent Matching · AI智能匹配';

INSERT INTO cms.pages_blocks_platform_teaser_features_locales (_locale, _parent_id, title, description) VALUES
  ('zh', '69b92ce6fe25505f1d64e660', '办公室 · 实验室 · 厂房',
   '全球空间匹配：新加坡、东南亚、中国、欧盟、中东。'),
  ('zh', '69b92ce6fe25505f1d64e661', '融资对接',
   'VC、CVC、政府资助 — 按阶段与行业精准匹配。'),
  ('zh', '69b92ce6fe25505f1d64e662', 'AI 智能匹配',
   '用自然语言描述需求，AI 即时找到最合适的合作伙伴。')
ON CONFLICT (_locale, _parent_id) DO UPDATE
   SET title       = EXCLUDED.title,
       description = EXCLUDED.description;

-- ═══════════════════════════════════════════════════════════════════════════
-- COMMIT — flip to ROLLBACK to dry-run.
-- ═══════════════════════════════════════════════════════════════════════════
COMMIT;
