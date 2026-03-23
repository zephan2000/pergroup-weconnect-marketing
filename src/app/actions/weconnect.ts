'use server'

/**
 * Server actions for WeConnect data access.
 * Called from client components (WeConnectOverlay) to keep Supabase queries
 * server-side, where the anon key and RLS are the security boundary.
 */

import { getSpacesListings } from '@/lib/weconnect/listings'
import type { Space } from '@/lib/supabase/schema'

export async function fetchSpacesListings(): Promise<Space[]> {
  return getSpacesListings()
}
