-- ═══════════════════════════════════════════════════════════════════════════
-- Phase 5b.4 follow-up — fill ZH `body` rich-text on About + PlatformTeaser
-- locale rows.
--
-- The 5b.4 SQL fill covered headlines / labels / arrays but skipped the rich
-- text `body` columns because Lexical JSON requires per-paragraph structuring.
-- This patch backfills both. Both ZH rows already exist (5b.2 seed); we
-- UPDATE the body jsonb in place.
--
-- Idempotent — UPDATE always rewrites whatever is currently there.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- AboutBlock body (2 paragraphs)
UPDATE cms.pages_blocks_about_locales
SET body = jsonb_build_object(
  'root', jsonb_build_object(
    'type', 'root',
    'format', '',
    'indent', 0,
    'version', 1,
    'direction', 'ltr',
    'children', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', 'ltr',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'version', 1,
            'text', 'PER GROUP 凭借 15+ 年的积淀，已编织起跨越 53 个国家的双文化网络 — 帮助中国企业出海对接世界市场，也让国际公司进入亚洲时获得本地专业支持。'
          )
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', 'ltr',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'version', 1,
            'text', '108 家共创伙伴服务 1,700+ 家国际公司分支机构，凭借真知洞察，而非简单的关系。'
          )
        )
      )
    )
  )
)
WHERE _locale = 'zh' AND _parent_id = '69b92ce6fe25505f1d64e658';

-- PlatformTeaserBlock body (1 paragraph)
UPDATE cms.pages_blocks_platform_teaser_locales
SET body = jsonb_build_object(
  'root', jsonb_build_object(
    'type', 'root',
    'format', '',
    'indent', 0,
    'version', 1,
    'direction', 'ltr',
    'children', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', 'ltr',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'version', 1,
            'text', 'AI 驱动的对接平台，连接企业与 53+ 国家的认证全球合作伙伴。寻找办公室与实验室空间、获取融资、探索市场进入路径 — 全部集中于一个智能平台。'
          )
        )
      )
    )
  )
)
WHERE _locale = 'zh' AND _parent_id = '69b92ce6fe25505f1d64e663';

COMMIT;
