/**
 * All queries against the weconnect.spaces table.
 *
 * Rules:
 * - Never query weconnect.spaces directly from components — use these functions.
 * - Always check schema.ts for the canonical column list before adding fields to SELECT.
 * - Role executing these queries: anon (via RLS).
 */
import { supabase } from '../supabase/client'
import type { Space } from '../supabase/schema'

/** Columns to SELECT for display (excludes embedding vector). */
const DISPLAY_COLUMNS = [
  'id', 'name', 'operator', 'type', 'address', 'district',
  'area_sqft_min', 'area_sqft_max', 'price_sgd_min', 'price_sgd_max',
  'lease_type', 'amenities', 'suitable_industries', 'available',
  'description_en', 'description_zh', 'source_url', 'source_name',
  'is_verified', 'last_scraped_at', 'created_at', 'updated_at',
].join(', ')

/**
 * Returns all available spaces, ordered newest-first.
 * Used by /platform/spaces.
 * Role: anon
 */
export async function getSpacesListings(): Promise<Space[]> {
  const { data, error } = await supabase
    .schema('weconnect')
    .from('spaces')
    .select(DISPLAY_COLUMNS)
    .eq('available', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`getSpacesListings failed: ${error.message}`)
  }

  return (data ?? []) as unknown as Space[]
}

/**
 * Returns a single space by id.
 * Role: anon
 */
export async function getSpaceById(id: string): Promise<Space | null> {
  const { data, error } = await supabase
    .schema('weconnect')
    .from('spaces')
    .select(DISPLAY_COLUMNS)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // row not found
    throw new Error(`getSpaceById failed: ${error.message}`)
  }

  return data as unknown as Space
}
