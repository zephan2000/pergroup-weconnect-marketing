/**
 * Supabase server client — uses the SERVICE ROLE key.
 *
 * !! SERVER ONLY !!
 * This file must NEVER be imported in:
 *  - any file with 'use client' directive
 *  - any file under /src/app/ that could be rendered client-side
 *  - any shared utility imported by both server and client code
 *
 * Use this in: server components, server actions, route handlers.
 * The service role key bypasses RLS — handle with care.
 *
 * Role executing queries: service_role
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Factory — call once per request/server component.
 * Implemented as a factory (not a module-level singleton) to make the
 * server-only intent obvious and to avoid accidental client-side bundling.
 */
export function createServerClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
        'Check .env.local.example for required variables.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // Disable session persistence — this is a server-side service account client.
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
