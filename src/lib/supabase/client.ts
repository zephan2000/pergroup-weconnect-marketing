/**
 * Supabase browser client — uses the ANON key.
 *
 * Safe to use in client components. Protected by Row Level Security (RLS).
 * SECURITY: RLS must be enabled on all weconnect.* tables before this client
 * is used in production. See SECURITY.md for required policies.
 *
 * Role executing queries: anon
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Check .env.local.example for required variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
