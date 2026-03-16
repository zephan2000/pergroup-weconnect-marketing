/**
 * All queries against the weconnect.listings table.
 *
 * Rules:
 * - Never query weconnect.listings directly from components — use these functions.
 * - Always check schema.ts for the canonical column list before adding fields to SELECT.
 * - Role executing these queries: anon (via RLS).
 */
import { supabase } from '../supabase/client'
import type { Listing } from '../supabase/schema'

/**
 * Returns all listings of type 'space', ordered newest-first.
 * Used by /platform/spaces.
 * Role: anon
 */
export async function getSpacesListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .schema('weconnect')
    .from('listings')
    .select('id, title, type, location, description, price, price_unit, tags, match_score, details, created_at')
    // Intentionally excluding `embedding` — vector column not needed for display.
    .eq('type', 'space')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`getSpacesListings failed: ${error.message}`)
  }

  return (data ?? []) as Listing[]
}

/**
 * Returns a single listing by id.
 * Role: anon
 */
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .schema('weconnect')
    .from('listings')
    .select('id, title, type, location, description, price, price_unit, tags, match_score, details, created_at')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // row not found
    throw new Error(`getListingById failed: ${error.message}`)
  }

  return data as Listing
}

// TODO (STUB): Semantic search function — not implemented in v1.
// When implementing:
//   1. Generate a query embedding via OpenAI/Supabase AI
//   2. Use Supabase's vector similarity search:
//      .rpc('match_listings', { query_embedding: [...], match_threshold: 0.78, match_count: 10 })
//   3. Create the `match_listings` Postgres function using pgvector <-> operator.
// export async function semanticSearchListings(query: string): Promise<Listing[]> {
//   throw new Error('Semantic search is not implemented in v1.')
// }
