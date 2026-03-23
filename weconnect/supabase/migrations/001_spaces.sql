-- 001_spaces.sql — WeConnect spaces table + crawl_jobs + semantic search
-- Run in Supabase SQL Editor. All objects live in the `weconnect` schema.

-- Prerequisites
CREATE SCHEMA IF NOT EXISTS weconnect;
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────────────────────────────────
-- Spaces table — commercial real estate listings
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE weconnect.spaces (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  operator          text,
  type              text CHECK (type IN ('office','lab','coworking','industrial','factory','retail','studio')),
  address           text,
  district          text,
  area_sqft_min     integer,
  area_sqft_max     integer,
  price_sgd_min     numeric(10,2),
  price_sgd_max     numeric(10,2),
  lease_type        text CHECK (lease_type IN ('hot_desk','dedicated_desk','private_office','whole_floor','building','flexible')),
  amenities         text[],
  suitable_industries text[],
  available         boolean DEFAULT true,
  description_en    text,
  description_zh    text,
  source_url        text UNIQUE,
  source_name       text,
  is_verified       boolean DEFAULT false,
  embedding         vector(1536),
  last_scraped_at   timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION weconnect.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spaces_updated_at
  BEFORE UPDATE ON weconnect.spaces
  FOR EACH ROW EXECUTE FUNCTION weconnect.set_updated_at();

-- HNSW index for cosine similarity search (no training step, works for
-- incrementally growing datasets unlike IVFFlat)
CREATE INDEX spaces_embedding_hnsw_idx
  ON weconnect.spaces
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ─────────────────────────────────────────────────────────────────────────
-- RLS — public read, service_role write
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE weconnect.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read spaces"
  ON weconnect.spaces FOR SELECT
  USING (true);

CREATE POLICY "Service role can write spaces"
  ON weconnect.spaces FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update spaces"
  ON weconnect.spaces FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete spaces"
  ON weconnect.spaces FOR DELETE
  TO service_role
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Crawl jobs — observability for ingestion runs
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE weconnect.crawl_jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source          text NOT NULL,
  status          text DEFAULT 'pending',
  pages_crawled   integer DEFAULT 0,
  spaces_upserted integer DEFAULT 0,
  error           text,
  started_at      timestamptz DEFAULT now(),
  finished_at     timestamptz
);

ALTER TABLE weconnect.crawl_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages crawl_jobs"
  ON weconnect.crawl_jobs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Semantic search RPC — called by the search endpoint
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION weconnect.match_spaces (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count     int DEFAULT 10
)
RETURNS TABLE (
  id                uuid,
  name              text,
  type              text,
  operator          text,
  address           text,
  district          text,
  price_sgd_min     numeric,
  price_sgd_max     numeric,
  area_sqft_min     integer,
  area_sqft_max     integer,
  lease_type        text,
  amenities         text[],
  suitable_industries text[],
  description_en    text,
  description_zh    text,
  source_url        text,
  source_name       text,
  available         boolean,
  is_verified       boolean,
  last_scraped_at   timestamptz,
  created_at        timestamptz,
  similarity        float
)
LANGUAGE sql STABLE AS $$
  SELECT
    s.id, s.name, s.type, s.operator, s.address, s.district,
    s.price_sgd_min, s.price_sgd_max, s.area_sqft_min, s.area_sqft_max,
    s.lease_type, s.amenities, s.suitable_industries,
    s.description_en, s.description_zh, s.source_url, s.source_name,
    s.available, s.is_verified, s.last_scraped_at, s.created_at,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM weconnect.spaces s
  WHERE s.available = true
    AND s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Grant schema access to PostgREST roles
-- IMPORTANT: also add "weconnect" to Supabase Dashboard → Settings → API → Exposed schemas
-- ─────────────────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA weconnect TO anon, authenticated, service_role;
GRANT SELECT ON weconnect.spaces TO anon, authenticated;
GRANT ALL ON weconnect.spaces TO service_role;
GRANT ALL ON weconnect.crawl_jobs TO service_role;
