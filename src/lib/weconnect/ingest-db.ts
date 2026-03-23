/**
 * Supabase helpers for the ingestion pipeline.
 * Uses the existing server client (service_role key).
 * Role: service_role (bypasses RLS).
 */
import { createServerClient } from '@/lib/supabase/server'

/** Shape of a space row for upsert */
export interface SpaceRow {
  name: string
  operator: string | null
  type: string
  address: string | null
  district: string | null
  area_sqft_min: number | null
  area_sqft_max: number | null
  price_sgd_min: number | null
  price_sgd_max: number | null
  lease_type: string | null
  amenities: string[]
  suitable_industries: string[]
  description_en: string | null
  description_zh: string | null
  source_url: string
  source_name: string
  embedding: number[]
  last_scraped_at: string
}

/**
 * Upsert a space into weconnect.spaces.
 * Deduplicates on source_url — re-scraping the same URL updates the existing row.
 */
export async function upsertSpace(space: SpaceRow): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .schema('weconnect')
    .from('spaces')
    .upsert(space, { onConflict: 'source_url' })

  if (error) {
    throw new Error(`Supabase upsert failed for ${space.source_url}: ${error.message}`)
  }
}

/**
 * Insert a crawl_jobs row. Returns the job ID.
 */
export async function createCrawlJob(source: string): Promise<string> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .schema('weconnect')
    .from('crawl_jobs')
    .insert({ source, status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single()

  if (error) throw new Error(`Failed to create crawl job: ${error.message}`)
  return data.id
}

/**
 * Update a crawl_jobs row with final status.
 */
export async function updateCrawlJob(
  jobId: string,
  update: {
    status: 'done' | 'failed'
    pages_crawled?: number
    spaces_upserted?: number
    error?: string
  }
): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .schema('weconnect')
    .from('crawl_jobs')
    .update({ ...update, finished_at: new Date().toISOString() })
    .eq('id', jobId)

  if (error) {
    console.error(`Failed to update crawl job ${jobId}:`, error.message)
  }
}
