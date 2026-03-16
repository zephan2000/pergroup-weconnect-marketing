/**
 * TypeScript types for all weconnect schema tables.
 *
 * This file is the single source of truth for WeConnect data shapes.
 * Update this file any time a weconnect.* table is created or altered.
 *
 * Hallucination guard: never query a weconnect table whose type is not here.
 *
 * SQL to create the table (run once in Supabase SQL Editor):
 * ─────────────────────────────────────────────────────────────────────────
 *   -- Prerequisites
 *   CREATE SCHEMA IF NOT EXISTS weconnect;
 *   CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions; -- pgvector
 *
 *   CREATE TABLE weconnect.listings (
 *     id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
 *     title        TEXT        NOT NULL,
 *     type         TEXT        NOT NULL CHECK (type IN ('space', 'funding', 'market')),
 *     location     TEXT,
 *     description  TEXT,
 *     price        TEXT,
 *     price_unit   TEXT,
 *     tags         TEXT[]      DEFAULT '{}',
 *     match_score  INTEGER     DEFAULT 0,
 *     details      JSONB       DEFAULT '{}',
 *     created_at   TIMESTAMPTZ DEFAULT NOW(),
 *     -- Semantic search embedding (pgvector, 1536 dims = OpenAI text-embedding-3-small)
 *     embedding    vector(1536)
 *   );
 *
 *   -- Enable RLS (required before using the anon key)
 *   ALTER TABLE weconnect.listings ENABLE ROW LEVEL SECURITY;
 *
 *   -- Starter read policy (all rows readable by anyone — tighten as needed)
 *   CREATE POLICY "Public listings readable by everyone"
 *     ON weconnect.listings FOR SELECT USING (true);
 *
 *   -- Allow Supabase JS client to access the weconnect schema via PostgREST:
 *   -- Supabase Dashboard → Settings → API → Exposed schemas → add "weconnect"
 * ─────────────────────────────────────────────────────────────────────────
 */

/** A row from weconnect.listings */
export interface Listing {
  id: string // uuid
  title: string
  type: 'space' | 'funding' | 'market'
  location: string | null
  description: string | null
  price: string | null
  price_unit: string | null
  tags: string[]
  match_score: number
  details: Record<string, unknown> // jsonb
  created_at: string // ISO 8601 timestamp string from Supabase

  /**
   * TODO (STUB): pgvector embedding column for semantic search.
   * Dimensions: 1536 (OpenAI text-embedding-3-small / ada-002 compatible).
   * Do NOT read/write this column yet — semantic search is not implemented in v1.
   * When implementing: use pgvector's <-> operator for cosine similarity search.
   * Reference: https://supabase.com/docs/guides/ai/vector-columns
   */
  embedding?: number[] // vector(1536) — excluded from default SELECT queries
}

/** Insert payload for weconnect.listings (id and created_at are auto-generated) */
export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'embedding'>

/** Update payload for weconnect.listings */
export type ListingUpdate = Partial<ListingInsert>
