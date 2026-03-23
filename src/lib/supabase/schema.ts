/**
 * TypeScript types for all weconnect schema tables.
 *
 * This file is the single source of truth for WeConnect data shapes.
 * Update this file any time a weconnect.* table is created or altered.
 *
 * Hallucination guard: never query a weconnect table whose type is not here.
 *
 * SQL: see weconnect/supabase/migrations/001_spaces.sql
 */

/** A row from weconnect.spaces */
export interface Space {
  id: string // uuid
  name: string
  operator: string | null
  type: 'office' | 'lab' | 'coworking' | 'industrial' | 'factory' | 'retail' | 'studio'
  address: string | null
  district: string | null
  area_sqft_min: number | null
  area_sqft_max: number | null
  price_sgd_min: number | null
  price_sgd_max: number | null
  lease_type: string | null
  amenities: string[]
  suitable_industries: string[]
  available: boolean
  description_en: string | null
  description_zh: string | null
  source_url: string | null
  source_name: string | null
  is_verified: boolean
  last_scraped_at: string | null
  created_at: string // ISO 8601
  updated_at: string // ISO 8601

  /** pgvector embedding (1536 dims). Excluded from default SELECT queries. */
  embedding?: number[]
}

/** A row from weconnect.crawl_jobs */
export interface CrawlJob {
  id: string
  source: string
  status: string
  pages_crawled: number
  spaces_upserted: number
  error: string | null
  started_at: string
  finished_at: string | null
}

// ── Legacy alias ──────────────────────────────────────────────────────────
// The old Listing interface mapped to weconnect.listings which has been
// replaced by weconnect.spaces. This alias keeps existing imports working
// during migration. Remove once all references are updated.
/** @deprecated Use Space instead */
export type Listing = Space
